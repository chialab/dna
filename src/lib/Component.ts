import { window } from './window';
import { createSymbolKey } from './symbols';
import { ComponentInterface, ComponentConstructorInterface, COMPONENT_SYMBOL } from './Interfaces';
import { customElements } from './CustomElementRegistry';
import { DOM, isElement, isConnected, connect, cloneChildNodes, emulateLifeCycle, removeChildImpl } from './DOM';
import { DelegatedEventCallback, delegateEventListener, undelegateEventListener, dispatchEvent, dispatchAsyncEvent } from './events';
import { createContext, getContext, setContext } from './Context';
import { Template, TemplateItems } from './Template';
import { getSlotted, setSlotted } from './slotted';
import { render } from './render';
import { ClassFieldDescriptor, ClassFieldObserver, ClassFieldAttributeConverter } from './property';
import { template } from './html';

const { document, HTMLElement } = window;

/**
 * A Symbol which contains all Property instances of a Component.
 * @private
 */
const PROPERTIES_SYMBOL: unique symbol = createSymbolKey() as any;

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
     * A set of properties to define to the node.
     */
    readonly properties?: {
        [key: string]: ClassFieldDescriptor | Function | Function[];
    };

    /**
     * A set of delegated events to bind to the node.
     */
    readonly listeners?: {
        [key: string]: DelegatedEventCallback;
    };

    /**
     * A list of CSSStyleSheet to apply to the component.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * A flag with the connected value of the node.
     */
    get isConnected(): boolean {
        return isConnected(this);
    }

    /**
     * The render context reference of the node.
     */
    get $() {
        return getContext(this);
    }

    /**
     * A list of slot nodes.
     */
    get slotChildNodes() {
        return getSlotted(this);
    }

    set slotChildNodes(children: TemplateItems) {
        setSlotted(this, children);
        this.forceUpdate();
    }

    get [COMPONENT_SYMBOL]() {
        return true;
    }

    /**
     * Create a new Component instance.
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    constructor(node?: HTMLElement | { [key: string]: any; }, properties: { [key: string]: any; } = {}) {
        super();

        let element = node as this;
        let props = properties as { [key: string]: any; };
        if (!isElement(element)) {
            props = node || {};
            element = this;
        } else {
            Object.setPrototypeOf(element, this);
        }

        setContext(element, createContext(element));

        let children = cloneChildNodes(element);
        setSlotted(element, children);
        children.forEach((child) => removeChildImpl.call(element, child));

        const propertyDescriptors = {} as {
            [key: string]: ClassFieldDescriptor;
        };

        let proto = Object.getPrototypeOf(element);
        while (proto.constructor !== HTMLElement) {
            let propertiesDescriptor = Object.getOwnPropertyDescriptor(proto, 'properties');
            let listenersDescriptor = Object.getOwnPropertyDescriptor(proto, 'listeners');
            let propertiesGetter = propertiesDescriptor && propertiesDescriptor.get;
            let listenersGetter = listenersDescriptor && listenersDescriptor.get;
            if (propertiesGetter) {
                let descriptorProperties = propertiesGetter.call(element) || {};
                for (let propertyKey in descriptorProperties) {
                    if (!(propertyKey in propertyDescriptors)) {
                        let descriptor = descriptorProperties[propertyKey];
                        if (typeof descriptor === 'function' || Array.isArray(descriptor)) {
                            descriptor = { type: descriptor };
                        }
                        propertyDescriptors[propertyKey] = descriptor;
                    }
                }
            }
            if (listenersGetter) {
                let descriptorListeners = listenersGetter.call(element) || {};
                // register listeners
                for (let eventPath in descriptorListeners) {
                    let paths = eventPath.trim().split(' ');
                    element.delegateEventListener(paths.shift() as string, paths.join(' '), descriptorListeners[eventPath]);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }

        // setup properties
        for (let propertyKey in propertyDescriptors) {
            let descriptor = propertyDescriptors[propertyKey];
            let symbol = element.defineProperty(propertyKey, descriptor);
            if (!(propertyKey in props)) {
                element.initProperty(propertyKey, descriptor, symbol);
            }
        }

        element.initialize(props);

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
        this.setAttribute('is', this.is);
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
        let properties = this.getProperties();
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
        const property = this.getProperty(propertyName) as ClassFieldDescriptor;
        const attrName = property.attribute as string;
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
     * Retrieve all properties descriptors.
     * @return A list of class field descriptors.
     */
    getProperties(): { [propertyKey: string]: ClassFieldDescriptor } {
        return (this as any)[PROPERTIES_SYMBOL] || {};
    }

    /**
     * Retrieve property descriptor.
     * @param propertyKey The name of the property.
     * @return The class field descriptor.
     */
    getProperty(propertyKey: string): ClassFieldDescriptor | null {
        const descriptors = this.getProperties();
        if (!descriptors) {
            return null;
        }
        return descriptors[propertyKey] || null;
    }

    /**
     * Define an observed property.
     * @param propertyKey THe name of the class field.
     * @param descriptor The property descriptor.
     * @param symbol The symbol to use to store property value.
     * @return The symbol used to store property value.
     */
    defineProperty(propertyKey: string, descriptor: ClassFieldDescriptor, symbol: symbol = createSymbolKey()): symbol {
        const observedAttributes = (this.constructor as typeof Component).observedAttributes;
        const descriptors = (this as any)[PROPERTIES_SYMBOL] = this.getProperties();
        descriptors[propertyKey] = descriptor;
        (descriptor as any).__proto__ = null;
        descriptor.name = propertyKey;
        descriptor.symbol = symbol;

        let hasAttribute = descriptor.attribute || observedAttributes.indexOf(propertyKey) !== -1;
        let attribute: string = hasAttribute === true ? propertyKey : hasAttribute as string;
        descriptor.attribute = attribute;

        let type: Function[] = descriptor.type as Function[] || [];
        if (!Array.isArray(type)) {
            type = [type];
        }
        descriptor.type = type;

        if (attribute) {
            descriptor.fromAttribute = descriptor.fromAttribute || ((newValue) => {
                if (type.indexOf(Boolean) !== -1 && (!newValue || newValue === attribute)) {
                    if (newValue === '' || newValue === attribute) {
                        // if the attribute value is empty or it is equal to the attribute name consider it as a boolean
                        return true;
                    }
                    return false;
                }
                if (newValue) {
                    if (type.indexOf(Number) !== -1 && !isNaN(newValue as unknown as number)) {
                        return parseFloat(newValue);
                    }
                    if (type.indexOf(Object) !== -1 || type.indexOf(Array) !== -1) {
                        try {
                            return JSON.parse(newValue as string);
                        } catch {
                            //
                        }
                    }
                }
                return newValue;
            });
            descriptor.toAttribute = descriptor.toAttribute || ((newValue) => {
                let falsy = newValue == null || newValue === false;
                if (falsy) {
                    // a falsy value should remove the attribute
                    return null;
                }
                if (typeof newValue === 'object') {
                    // objects should be ignored
                    return;
                }
                // if the value is `true` should set an empty attribute
                if (newValue === true) {
                    return '';
                }
                // otherwise just set the value
                return `${newValue}`;
            });
        }

        let observers = descriptor.observers || [];
        if (descriptor.observe) {
            observers = [descriptor.observe, ...observers];
        }
        descriptor.observers = observers;

        const validate = typeof descriptor.validate === 'function' && descriptor.validate;
        const finalDescriptor: PropertyDescriptor = {
            enumerable: true,
        };

        const getter = descriptor.getter || ((value) => value);
        const get = function get(this: any) {
            return getter.call(this, this[symbol]);
        };

        const setter = descriptor.setter || ((value) => value);
        const set = function set(this: any, value: any) {
            return setter.call(this, value);
        };

        finalDescriptor.get = get;
        finalDescriptor.set = function(this: any, newValue: any) {
            const oldValue = this[symbol];
            newValue = set.call(this, newValue);

            if (oldValue === newValue) {
                // no changes
                return;
            }

            const falsy = newValue == null || newValue === false;
            // if types or custom validator has been set, check the value validity
            if (!falsy) {
                let valid = true;
                if (type.length) {
                    // check if the value is an instanceof of at least one constructor
                    valid = type.some((Type) => (newValue instanceof Type || (newValue.constructor && newValue.constructor === Type)));
                }
                if (valid && validate) {
                    valid = validate.call(this, newValue);
                }
                if (!valid) {
                    throw new TypeError(`Invalid \`${newValue}\` value for \`${String(descriptor.name)}\` property`);
                }
            }

            this[symbol] = newValue;

            if (observers) {
                observers.forEach((observer) => observer.call(this, oldValue, newValue));
            }

            // trigger Property changes
            this.propertyChangedCallback(descriptor.name as string, oldValue, newValue);
        };

        Object.defineProperty(this, propertyKey, finalDescriptor);
        return symbol;
    }

    /**
     * Initialize constructor properties.
     * @param props The propertie to set.
     */
    initialize(props: { [key: string]: any; }) {
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
        const property = this.getProperty(propertyName);
        if (!property) {
            throw new Error(`Missing property ${propertyName}`);
        }
        const observers = property.observers as Function[];
        observers.push(callback);
    }

    /**
     * Unobserve a Component Property.
     *
     * @param propertyName The name of the Property to unobserve
     * @param callback The callback function to remove
     */
    unobserve(propertyName: string, callback: ClassFieldObserver) {
        const property = this.getProperty(propertyName);
        if (!property) {
            throw new Error(`Missing property ${propertyName}`);
        }
        const observers = property.observers as Function[];
        const io = observers.indexOf(callback);
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
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback) {
        return delegateEventListener(this, event, selector, callback);
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
        let document = this.ownerDocument;
        let templateNode = document && document.querySelector(`template[name="${this.is}"]`) as HTMLTemplateElement;
        if (templateNode) {
            return template(templateNode, this);
        }
        return this.slotChildNodes;
    }

    /**
     * Force an element to re-render.
     */
    forceUpdate() {
        const template = this.render();
        if (template) {
            render(this, template);
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
} as ComponentConstructorInterface<InstanceType<T>>;

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
export class Component extends extend(HTMLElement) {}
