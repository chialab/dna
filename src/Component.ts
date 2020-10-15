import { ComponentInterface, ComponentConstructorInterface, COMPONENT_SYMBOL } from './Interfaces';
import { customElements } from './CustomElementRegistry';
import { HTMLElement, isElement, isConnected, emulateLifeCycle, setAttributeImpl, createElementImpl } from './helpers';
import { DOM } from './DOM';
import { DelegatedEventCallback, delegateEventListener, undelegateEventListener, dispatchEvent, dispatchAsyncEvent, getListeners } from './events';
import { getContext, createContext } from './Context';
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

        let context = createContext(element);
        if (!this.childNodes.length && this.ownerDocument.readyState === 'loading') {
            this.ownerDocument.addEventListener('DOMContentLoaded', () => {
                context.slotChildNodes = element.initSlotChildNodes();
                element.forceUpdate();
            });
        } else {
            context.slotChildNodes = element.initSlotChildNodes();
        }

        let constructor = element.constructor as ComponentConstructorInterface<HTMLElement>;

        // setup listeners
        let listeners = getListeners(constructor) || [];
        for (let i = 0, len = listeners.length; i < len; i++) {
            let listener = listeners[i];
            element.delegateEventListener(listener.event, listener.selector, listener.callback, listener.options);
        }

        // setup properties
        let propertiesDescriptor = getProperties(constructor);
        for (let propertyKey in propertiesDescriptor) {
            delete (element as any)[propertyKey];
            let descriptor = propertiesDescriptor[propertyKey];
            if (!props || !(propertyKey in props)) {
                let symbol = descriptor.symbol as symbol;
                if (typeof (element as any)[symbol] !== 'undefined') {
                    continue;
                }
                if (typeof descriptor.initializer === 'function') {
                    (element as any)[symbol] = descriptor.initializer.call(element);
                } else if ('value' in descriptor) {
                    (element as any)[symbol] = descriptor.value;
                } else if ('defaultValue' in descriptor) {
                    (element as any)[symbol] = descriptor.defaultValue;
                }
            }
        }
        if (props) {
            for (let propertyKey in props) {
                (element as any)[propertyKey] = props[propertyKey];
            }
        }

        return element;
    }

    /**
     * Invoked each time the Component is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     */
    connectedCallback() {
        if (this.is !== this.localName) {
            // force the is attribute
            setAttributeImpl.call(this, 'is', this.is);
        }
        setAttributeImpl.call(this, ':defined', '');
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
            this.removeChild(slotChildNodes[i]);
        }
        return slotChildNodes;
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
        if (!(constructor as any).shim &&
            typeof Reflect !== 'undefined' &&
            typeof base === 'function'
        ) {
            element = Reflect.construct(base, args, constructor);
            if (tag === element.localName) {
                return element;
            }
        }

        element = createElementImpl(tag) as HTMLElement;
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
