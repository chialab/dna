import { document, HTMLElement } from './window';
import { ComponentInterface, ComponentConstructorInterface, COMPONENT_SYMBOL } from './Interfaces';
import { customElements } from './CustomElementRegistry';
import { isElement, removeChildImpl, setAttributeImpl } from './helpers';
import { DOM, isConnected, connect, emulateLifeCycle } from './DOM';
import { DelegatedEventCallback, delegateEventListener, undelegateEventListener, dispatchEvent, dispatchAsyncEvent, getListeners } from './events';
import { Context, getContext, createContext } from './Context';
import { Template } from './Template';
import { internalRender } from './render';
import { ClassFieldDescriptor, ClassFieldObserver, ClassFieldAttributeConverter, getProperties, getProperty } from './property';
import { cloneChildNodes } from './NodeList';

/**
 * Create a base Component class which extends a native constructor.
 * @param constructor The base HTMLElement constructor to extend.
 * @return The extend class.
 */
const mixin = <T extends typeof HTMLElement>(constructor: T) => class Component extends (constructor as typeof HTMLElement) {
    /**
     * An array containing the names of the attributes to observe.
     */
    static readonly observedAttributes: string[] = [];

    /**
     * The tag name used for Component definition.
     */
    get is(): string {
        return undefined as unknown as string;
    }

    /**
     * A list of CSSStyleSheet to apply to the component.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * A flag with the connected value of the node.
     */
    get isConnected(): boolean {
        return isConnected.call(this);
    }

    /**
     * The render context reference of the node.
     */
    get $() {
        return getContext(this).keyed;
    }

    /**
     * A list of slot nodes.
     */
    get slotChildNodes() {
        return getContext(this).slotChildNodes;
    }

    /**
     * Flag DNA components.
     */
    get [COMPONENT_SYMBOL]() {
        return true;
    }

    /**
     * Create a new Component instance.
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    constructor(node?: HTMLElement | { [key: string]: any; }, properties?: { [key: string]: any; }) {
        super();

        let element = node as this;
        let props = properties;
        if (!isElement(element)) {
            props = node;
            element = this;
        } else {
            Object.setPrototypeOf(element, this);
        }

        element.initialize(createContext(element), props);

        if (element.isConnected) {
            connect(element, element !== this);
        }

        return element;
    }

    /**
     * Invoked each time the Component is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     */
    connectedCallback() {
        // force the is attribute for styling
        setAttributeImpl.call(this, 'is', this.is);
        // trigger a re-render when the Node is connected
        this.forceUpdate();
    }

    /**
     * Invoked each time the Component is disconnected from the document's DOM.
     */
    disconnectedCallback() { }

    /**
     * Invoked each time one of the Component's attributes is added, removed, or changed.
     *
     * @param attributeName The name of the updated attribute.
     * @param oldValue The previous value of the attribute.
     * @param newValue The new value for the attribute (null if removed).
     */
    attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: string | null) {
        let properties = getProperties(this.constructor as ComponentConstructorInterface<HTMLElement>);
        let property: ClassFieldDescriptor | undefined;
        for (let propertyKey in properties) {
            let prop = properties[propertyKey];
            if (prop.attribute === attributeName) {
                property = prop;
                break;
            }
        }

        if (!property) {
            return;
        }

        // update the Component Property value
        (this as any)[property.name as string] = (property.fromAttribute as ClassFieldAttributeConverter).call(this as any, newValue);
    }

    /**
     * Invoked each time one of the Component's properties is added, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any) {
        let property = getProperty(this.constructor as ComponentConstructorInterface<HTMLElement>, propertyName) as ClassFieldDescriptor;
        let attrName = property.attribute as string;
        if (attrName && property.toAttribute) {
            let value = property.toAttribute.call(this as any, newValue);
            if (value === null) {
                this.removeAttribute(attrName);
            } else if (value !== undefined && value !== this.getAttribute(attrName)) {
                this.setAttribute(attrName, value);
            }
        }

        if (property.event) {
            let eventName = property.event === true ? `${propertyName}change` : property.event;
            this.dispatchEvent(eventName, {
                newValue,
                oldValue,
            });
        }

        if (this.isConnected) {
            this.forceUpdate();
        }
    }

    /**
     * Extract slotted child nodes for initial child nodes.
     * @return A list of new slotted children.
     */
    private initSlotChildNodes() {
        let slotChildNodes = cloneChildNodes(this.childNodes);
        for (let i = 0, len = slotChildNodes.length; i < len; i++) {
            removeChildImpl.call(this, slotChildNodes[i]);
        }
        return slotChildNodes;
    }

    /**
     * Initialize constructor properties.
     * @param context The element context.
     * @param props The propertie to set.
     */
    initialize(context: Context, props: { [key: string]: any; } = {}) {
        if (document.readyState === 'complete') {
            context.slotChildNodes = this.initSlotChildNodes();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                context.slotChildNodes = this.initSlotChildNodes();
                this.forceUpdate();
            });
        }

        let constructor = this.constructor as ComponentConstructorInterface<HTMLElement>;

        // setup listeners
        let listeners = getListeners(constructor) || [];
        for (let i = 0, len = listeners.length; i < len; i++) {
            let listener = listeners[i];
            this.delegateEventListener(listener.event, listener.selector, listener.callback, listener.options);
        }

        // setup properties
        let propertiesDescriptor = getProperties(constructor);
        for (let propertyKey in propertiesDescriptor) {
            delete (this as any)[propertyKey];
            let descriptor = propertiesDescriptor[propertyKey];
            if (!(propertyKey in props)) {
                this.initProperty(propertyKey, descriptor, descriptor.symbol as symbol);
            }
        }
        for (let propertyKey in props) {
            (this as any)[propertyKey] = props[propertyKey];
        }
    }

    /**
     * Initialize instance property.
     *
     * @param propertyKey The property name.
     * @param descriptor The property descriptor.
     * @param symbol The property symbolic key.
     * @param initializer The initializer function of the decorator.
     * @return The current property value.
     */
    initProperty(propertyKey: string, descriptor: ClassFieldDescriptor, symbol: symbol, initializer?: Function): any {
        let target = this as any;
        if (typeof target[symbol] !== 'undefined') {
            return target[symbol];
        }
        if (typeof initializer === 'function') {
            target[symbol] = initializer.call(target);
        } else if ('value' in descriptor) {
            target[symbol] = descriptor.value;
        } else if (descriptor.attribute && this.hasAttribute(descriptor.attribute as string)) {
            let value = this.getAttribute(descriptor.attribute as string);
            target[symbol] = (descriptor.fromAttribute as ClassFieldAttributeConverter).call(this, value);
        } else if ('defaultValue' in descriptor) {
            target[symbol] = descriptor.defaultValue;
        }
        return target[symbol];
    }

    /**
     * Observe a Component Property.
     *
     * @param propertyName The name of the Property to observe
     * @param callback The callback function
     */
    observe(propertyName: string, callback: ClassFieldObserver) {
        let property = getProperty(this.constructor as ComponentConstructorInterface<HTMLElement>, propertyName);
        if (!property) {
            throw new Error(`Missing property ${propertyName}`);
        }
        (property.observers as Function[]).push(callback);
    }

    /**
     * Unobserve a Component Property.
     *
     * @param propertyName The name of the Property to unobserve
     * @param callback The callback function to remove
     */
    unobserve(propertyName: string, callback: ClassFieldObserver) {
        let property = getProperty(this.constructor as ComponentConstructorInterface<HTMLElement>, propertyName);
        if (!property) {
            throw new Error(`Missing property ${propertyName}`);
        }
        let observers = property.observers as Function[];
        let io = observers.indexOf(callback);
        if (io !== -1) {
            observers.splice(io, 1);
        }
    }

    /**
     * Dispatch a custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchEvent(event: Event): boolean; /* eslint-disable-line no-dupe-class-members */
    dispatchEvent(event: string, detail?: any, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean; /* eslint-disable-line no-dupe-class-members */
    dispatchEvent(event: Event | string, detail?: any, bubbles?: boolean, cancelable?: boolean, composed?: boolean) { /* eslint-disable-line no-dupe-class-members */
        return dispatchEvent(this, event as string, detail, bubbles, cancelable, composed);
    }

    /**
     * Dispatch an async custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchAsyncEvent(event: Event): Promise<any[]>; /* eslint-disable-line no-dupe-class-members */
    dispatchAsyncEvent(event: string, detail?: any, bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise<any[]>; /* eslint-disable-line no-dupe-class-members */
    dispatchAsyncEvent(event: Event | string, detail?: any, bubbles?: boolean, cancelable?: boolean, composed?: boolean) { /* eslint-disable-line no-dupe-class-members */
        return dispatchAsyncEvent(this, event as string, detail, bubbles, cancelable, composed);
    }

    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions) {
        return delegateEventListener(this, event, selector, callback, options);
    }

    /**
     * Remove an Event delegation.
     *
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback) {
        return undelegateEventListener(this, event, selector, callback);
    }

    /**
     * Render method of the Component.
     *
     * @return The instances of the rendered Components and/or Nodes
     */
    render(): Template | undefined {
        return this.slotChildNodes;
    }

    /**
     * Force an element to re-render.
     */
    forceUpdate() {
        if (this.slotChildNodes) {
            internalRender(this, this.render());
        }
    }

    /**
     * Append a child to the Component.
     *
     * @param newChild The child to add.
     */
    appendChild<T extends Node>(newChild: T): T {
        return DOM.appendChild(this, newChild);
    }

    /**
     * Remove a child from the Component.
     *
     * @param {Node} oldChild The child to remove.
     */
    removeChild<T extends Node>(oldChild: T): T {
        return DOM.removeChild(this, oldChild);
    }

    /**
     * Insert a child before another in the Component.
     *
     * @param newChild The child to insert.
     * @param refChild The referred Node.
     */
    insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
        return DOM.insertBefore(this, newChild, refChild);
    }

    /**
     * Replace a child with another in the Component.
     *
     * @param newChild The child to insert.
     * @param oldChild The Node to replace.
     */
    replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
        return DOM.replaceChild(this, newChild, oldChild);
    }

    /**
     * Set a Component attribute.
     *
     * @param ualifiedName The attribute name.
     * @param value The value to set.
     */
    setAttribute(qualifiedName: string, value: string) {
        return DOM.setAttribute(this, qualifiedName, value);
    }

    /**
     * Remove a Component attribute.
     *
     * @param qualifiedName The attribute name.
     */
    removeAttribute(qualifiedName: string) {
        return DOM.removeAttribute(this, qualifiedName);
    }

    /**
     * Should emulate life cycle for the node.
     */
    emulateLifeCycle() {
        emulateLifeCycle(this);
    }
} as unknown as ComponentConstructorInterface<InstanceType<T>>;

/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param base The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export const shim = <T extends typeof HTMLElement>(base: T): T => {
    const shim = function(this: any, ...args: any[]) {
        let constructor = this.constructor as T;
        let is = this.is;
        if (!is) {
            throw new TypeError('Illegal constructor');
        }

        let tag = customElements.tagNames[is];
        let element: HTMLElement;
        try {
            element = Reflect.construct(base, args, constructor);
            if (tag === element.localName) {
                return element;
            }
        } catch {
            //
        }

        element = document.createElement(tag) as HTMLElement;
        Object.setPrototypeOf(element, constructor.prototype);
        emulateLifeCycle(element as ComponentInterface<InstanceType<T>>);
        return element;
    } as any as T;
    Object.setPrototypeOf(shim, base);
    (shim as any).apply = Function.apply;
    (shim as any).call = Function.call;
    shim.prototype = base.prototype;
    return shim;
};

/**
 * Get a native HTMLElement constructor to extend by its name.
 * @param name The name of the constructor (eg. "HTMLAnchorElement").
 * @return A proxy that extends the native constructor.
 */
export const extend = <T extends typeof HTMLElement>(constructor: T) => mixin(shim(constructor));

/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 */
export const Component = extend(HTMLElement);
