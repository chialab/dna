import type { Constructor, ClassDescriptor } from './types';
import type { DelegatedEventCallback } from './events';
import type { PropertyObserver } from './property';
import type { Template } from './render';
import { createSymbolKey, HTMLElement, isConnected, emulateLifeCycle, setAttributeImpl, createElementImpl, setPrototypeOf, isElement, defineProperty, cloneChildNodes } from './helpers';
import { customElements } from './CustomElementRegistry';
import { DOM } from './DOM';
import { delegateEventListener, undelegateEventListener, dispatchEvent, dispatchAsyncEvent, getListeners } from './events';
import { getOrCreateContext, internalRender } from './render';
import { getProperties, getProperty, getPropertyForAttribute } from './property';

/**
 * A symbol which identify components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENT_SYMBOL: unique symbol = createSymbolKey() as any;

export type WithComponentFlag<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
};

/**
 * A symbol which identify constructed components (properties can be assigned).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CONSTRUCTED_SYMBOL: unique symbol = createSymbolKey() as any;

export type WithConstructedFlag<T> = T & {
    [CONSTRUCTED_SYMBOL]?: boolean;
};

/**
 * Check if a node is a component.
 * @param node The node to check.
 */
export const isComponent = (node: WithComponentFlag<Node>): node is ComponentInstance<HTMLElement> => !!node[COMPONENT_SYMBOL];

/**
 * Check if a node is a constructed component.
 * @param node The node to check.
 */
export const isConstructed = (node: WithConstructedFlag<Node>) => !!node[CONSTRUCTED_SYMBOL];

/**
 * Add the constructed flag to the node.
 * @param node The constructed node.
 */
export const flagConstructed = (node: WithConstructedFlag<HTMLElement>) => {
    node[CONSTRUCTED_SYMBOL] = true;
};

/**
 * Check if a constructor is a component constructor.
 * @param constructor The constructor to check.
 */
export const isComponentConstructor = (constructor: Function): constructor is ComponentConstructor<HTMLElement> => !!constructor.prototype[COMPONENT_SYMBOL];

/**
 * Extract slotted child nodes for initial child nodes.
 * @param context The compoonent context.
 * @return A list of new slotted children.
 */
function initSlotChildNodes<T extends HTMLElement>(element: ComponentInstance<T>) {
    const context = getOrCreateContext(element);
    const doc = element.ownerDocument;
    /* istanbul ignore next */
    if (!element.childNodes.length && doc.readyState === 'loading') {
        return;
    }
    const slotChildNodes = cloneChildNodes(element.childNodes);
    for (let i = 0, len = slotChildNodes.length; i < len; i++) {
        element.removeChild(slotChildNodes[i]);
    }
    context.slotChildNodes = slotChildNodes;
    return slotChildNodes;
}

/**
 * Create a base Component class which extends a native constructor.
 * @param ctor The base HTMLElement constructor to extend.
 * @return The extend class.
 */
const mixin = <T extends HTMLElement>(ctor: Constructor<T>) => {
    const Component = class Component extends (ctor as Constructor) {
        /**
         * An array containing the names of the attributes to observe.
         */
        static get observedAttributes(): string[] {
            const propertiesDescriptor = getProperties(this.prototype);
            const attributes = [];
            for (let key in propertiesDescriptor) {
                const prop = propertiesDescriptor[key as keyof typeof propertiesDescriptor];
                if (prop && prop.attribute) {
                    attributes.push(prop.attribute);
                }
            }

            return attributes;
        }

        /**
         * Identify shimmed constructors.
         * Constructor will skip native constructing when true.
         */
        static shim?: boolean;

        /**
         * Upgrade a plain element prototype.
         * @param node The node to upgrade.
         * @return The new prototyped node.
         */
        static upgrade<T extends HTMLElement>(node: T) {
            return new this(node);
        }

        /**
         * The tag name used for Component definition.
         */
        get is(): string {
            return undefined as unknown as string;
        }

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
            return getOrCreateContext(this).slotChildNodes;
        }

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        constructor(...args: any[]) {
            super();

            const node = isElement(args[0]) && args[0];
            const props = (node ? args[1] : args[0]) as { [P in keyof this]: this[P] };

            const element = (node ? (setPrototypeOf(node, this), node) : this) as this;
            const constructor = element.constructor as typeof Component;
            const context = getOrCreateContext(element);
            context.is = element.is;
            initSlotChildNodes(element);

            // setup listeners
            const listeners = getListeners(constructor) || [];
            for (let i = 0, len = listeners.length; i < len; i++) {
                let listener = listeners[i];
                element.delegateEventListener(listener.event, listener.selector, listener.callback, listener.options);
            }

            // setup properties
            const propertiesDescriptor = getProperties(this);
            for (let propertyKey in propertiesDescriptor) {
                delete element[propertyKey];
                const descriptor = propertiesDescriptor[propertyKey];
                if (typeof descriptor.initializer === 'function') {
                    element[propertyKey] = descriptor.initializer.call(element);
                } else if ('value' in descriptor) {
                    element[propertyKey] = descriptor.value;
                } else if (typeof descriptor.defaultValue !== 'undefined') {
                    element[propertyKey] = descriptor.defaultValue;
                }
            }

            element.initialize(props);
            return element;
        }

        /**
         * Initialize component properties.
         * @param properties A set of initial properties for the element.
         */
        initialize(properties?: { [P in keyof this]: this[P] }) {
            flagConstructed(this);
            if (properties) {
                for (let propertyKey in properties) {
                    this[propertyKey] = properties[propertyKey];
                }
            }
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
            const property = getPropertyForAttribute(this, attributeName);
            if (!property) {
                return;
            }

            // update the Component Property value
            if (property.fromAttribute) {
                this[property.name] = property.fromAttribute.call(this, newValue);
            }
        }

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]) {
            const property = getProperty(this, propertyName);
            if (property.event) {
                this.dispatchEvent(property.event, {
                    newValue,
                    oldValue,
                });
            }
            if (this.isConnected) {
                this.forceUpdate();
            }
        }

        /**
         * Invoked each time one of a Component's property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        propertyChangedCallback<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]) {
            const property = getProperty(this, propertyName);
            const attrName = property.attribute;
            if (attrName && property.toAttribute) {
                const value = property.toAttribute.call(this, newValue);
                if (value === null) {
                    this.removeAttribute(attrName);
                } else if (value !== undefined && value !== this.getAttribute(attrName)) {
                    this.setAttribute(attrName, value);
                }
            }

            if (property.event) {
                this.dispatchEvent(property.event, {
                    newValue,
                    oldValue,
                });
            }

            if (this.isConnected) {
                this.forceUpdate();
            }
        }

        /**
         * Observe a Component Property.
         *
         * @param propertyName The name of the Property to observe
         * @param callback The callback function
         */
        observe<P extends keyof this>(propertyName: P, callback: PropertyObserver<this, this[P]>) {
            const property = getProperty(this, propertyName);
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
        unobserve<P extends keyof this>(propertyName: P, callback: PropertyObserver<this, this[P]>) {
            const property = getProperty(this, propertyName);
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
        dispatchEvent(event: Event): boolean;
        dispatchEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;
        dispatchEvent(event: Event | string, detail?: CustomEventInit['detail'], bubbles?: boolean, cancelable?: boolean, composed?: boolean) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatchAsyncEvent(event: Event): Promise<any[]>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatchAsyncEvent(event: string, detail?: CustomEventInit['detail'], bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise<any[]>;
        dispatchAsyncEvent(event: Event | string, detail?: CustomEventInit['detail'], bubbles?: boolean, cancelable?: boolean, composed?: boolean) {
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
            const childNodes = this.slotChildNodes || initSlotChildNodes(this);
            if (childNodes) {
                internalRender(this, this.render(), false);
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
    };

    defineProperty(Component.prototype, COMPONENT_SYMBOL, {
        get() {
            return true;
        },
    });

    return Component;
};

/**
 * The basic DNA Component constructor.
 */
export type ComponentConstructor<T extends HTMLElement> = ReturnType<typeof mixin> & Constructor<T>;

/**
 * The basic DNA Component interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export type ComponentInstance<T extends HTMLElement> = InstanceType<ComponentConstructor<T>>;

/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param base The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export const shim = <T extends typeof HTMLElement>(base: T): T => {
    const shim = function(this: InstanceType<ReturnType<typeof mixin>>, ...args: any[]) {
        const constructor = this.constructor as ReturnType<typeof mixin>;
        const is = this.is;
        if (!is) {
            throw new TypeError('Illegal constructor');
        }

        const tag = customElements.tagNames[is];
        let element: InstanceType<typeof constructor>;
        if (customElements.native && !constructor.shim) {
            element = Reflect.construct(base, args, constructor.prototype.constructor);
            if (tag === element.localName) {
                return element;
            }
        }

        element = createElementImpl(tag) as InstanceType<typeof constructor>;
        setPrototypeOf(element, constructor.prototype);
        emulateLifeCycle(element);
        return element;
    } as unknown as T;
    setPrototypeOf(shim, base);
    (shim as Function).apply = Function.apply;
    (shim as Function).call = Function.call;
    shim.prototype = base.prototype;
    return shim;
};

/**
 * Get a native HTMLElement constructor to extend by its name.
 * @param name The name of the constructor (eg. "HTMLAnchorElement").
 * @return A proxy that extends the native constructor.
 */
export const extend = <T extends HTMLElement>(constructor: Constructor<T>) => mixin(shim(constructor)) as unknown as ComponentConstructor<T>;

/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 */
export const Component = extend(HTMLElement);

/**
 * Decorate and define component classes.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @return The decorated component class.
 */
export const customElement = (name: string, options?: ElementDefinitionOptions) =>
    // TypeScript complains about return type because we handle babel output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (classOrDescriptor: ComponentConstructor<HTMLElement>|ClassDescriptor): any => {
        const upgrade = (constructor: ComponentConstructor<HTMLElement>) => {
            const Component = class extends constructor {
                /**
                 * Store constructor properties.
                 */
                private initProps?: { [P in keyof this]: this[P] };

                /**
                 * @inheritdoc
                 */
                constructor(...args: any[]) {
                    // So sorry about this, but I can't get it working otherwise
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    super(...args);
                    flagConstructed(this);
                    this.initialize(this.initProps);
                }

                /**
                 * @inheritdoc
                 */
                initialize(props?: { [P in keyof this]: this[P] }) {
                    if (!isConstructed(this)) {
                        this.initProps = props;
                        return;
                    }
                    return super.initialize(props);
                }
            };

            customElements.define(name, Component, options);
            return Component as typeof classOrDescriptor;
        };

        if (typeof classOrDescriptor === 'function') {
            // typescript
            return upgrade(classOrDescriptor);
        }

        // spec 2
        const { kind, elements } = classOrDescriptor;
        return {
            kind,
            elements,
            finisher<T extends HTMLElement>(constructor: Constructor<T>) {
                return upgrade(constructor as ComponentConstructor<T>);
            },
        };
    };
