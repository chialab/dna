import type { Constructor, ClassDescriptor, IterableNodeList } from './helpers';
import type { CustomElement, CustomElementConstructor } from './CustomElementRegistry';
import type { DelegatedEventCallback, ListenerConfig } from './events';
import type { PropertyConfig, PropertyObserver } from './property';
import type { Template } from './JSX';
import { addObserver, getProperty, reflectPropertyToAttribute, removeObserver, getProperties, reflectAttributeToProperty } from './property';
import { HTMLElementConstructor, isConnected, emulateLifeCycle, setAttributeImpl, createElementImpl, setPrototypeOf, isElement, defineProperty, cloneChildNodes } from './helpers';
import { customElements } from './CustomElementRegistry';
import { DOM } from './DOM';
import { delegateEventListener, undelegateEventListener, dispatchEvent, dispatchAsyncEvent, getListeners, setListeners } from './events';
import { getOrCreateContext } from './Context';
import { internalRender, render } from './render';
import { parseDOM } from './directives';

/**
 * A symbol which identify components.
 */
export const COMPONENT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol which identify constructed components (properties can be assigned).
 */
export const CONSTRUCTED_SYMBOL: unique symbol = Symbol();

/**
 * A symbol which identify initialized components (initial properties are set).
 */
export const INITIALIZED_SYMBOL: unique symbol = Symbol();

type WithComponentFlags<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
    [CONSTRUCTED_SYMBOL]?: boolean;
    [INITIALIZED_SYMBOL]?: boolean;
};

/**
 * The component mixin interface.
 */
export interface ComponentMixin {
    /**
     * A flag with the connected value of the node.
     */
    get isConnected(): boolean;

    /**
     * A list of slot nodes.
     */
    get slotChildNodes(): IterableNodeList | undefined;

    /**
     * Initialize component properties.
     * @param properties A set of initial properties for the element.
     */
    initialize(properties?: Members<this>): void;

    /**
     * Invoked each time one of a Component's state property is setted, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    stateChangedCallback<P extends keyof Members<this>>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): void;

    /**
     * Invoked each time one of a Component's property is setted, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    propertyChangedCallback<P extends keyof Members<this>>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): void;

    /**
     * Get the inner value of a property.
     * This is an helper method for properties getters and setters.
     * @param propertyName The name of the property to get.
     * @returns The inner value of the property.
     */
    getInnerPropertyValue<P extends keyof Members<this>>(propertyName: P): this[P];

    /**
     * Set the inner value of a property.
     * This is an helper method for properties getters and setters.
     * @param propertyName The name of the property to get.
     * @param value The inner value to set.
     */
    setInnerPropertyValue<P extends keyof Members<this>>(propertyName: P, value: this[P]): void;

    /**
     * Observe a Component Property.
     *
     * @param propertyName The name of the Property to observe
     * @param observer The callback function
     */
    observe<P extends keyof Members<this>>(propertyName: P, observer: PropertyObserver<this[P]>): void;

    /**
     * Unobserve a Component Property.
     *
     * @param propertyName The name of the Property to unobserve
     * @param observer The callback function to remove
     */
    unobserve<P extends keyof Members<this>>(propertyName: P, observer: PropertyObserver<this[P]>): void;

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

    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options ?: AddEventListenerOptions): void;

    /**
     * Remove an Event delegation.
     *
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;

    /**
     * Render method of the Component.
     *
     * @returns The instances of the rendered Components and/or Nodes
     */
    render(): Template | undefined;

    /**
     * Force an element to re-render.
     */
    forceUpdate(): void;
}

/**
 * The basic DNA Component interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export type ComponentInstance<T extends HTMLElement = HTMLElement> = CustomElement<T> & ComponentMixin;

/**
 * Component prototype keys.
 */
export type PrototypeKeys = keyof CustomElement | keyof ComponentMixin;

/**
 * Get all methods of a class, excluding inherited methods.
 */
export type MethodsOf<T> = Exclude<{
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T], never & PrototypeKeys>;

/**
 * Check if a property is flagged as readonly.
 */
export type IsReadonly<T, K extends keyof T> =
    (<C>() => C extends { [Q in K]: T[K] } ? 1 : 2) extends (<C>() => C extends { -readonly [Q in K]: T[K] } ? 1 : 2) ? never : K;

/**
 * Get all members of a class, excluding inherited members.
 */
export type Members<T> = {
    [K in keyof T]?: K extends PrototypeKeys ? never : K extends IsReadonly<T, K> ? never : T[K];
};

/**
 * Get all members names of a class, excluding inherited members.
 */
export type MemberKeys<T> = Exclude<{
    [K in keyof T]?: K extends PrototypeKeys ? never : K extends IsReadonly<T, K> ? never : K;
}[keyof T], never | undefined>;

/**
 * Get a filtered list of available members of a class, excluding inherited members.
 */
export type Props<T> = Partial<Pick<Members<T>, MemberKeys<T>>>;

/**
 * The basic DNA Component constructor.
 */
export interface ComponentConstructor<T extends ComponentInstance = ComponentInstance> extends CustomElementConstructor<T> {
    /**
     * Define component properties.
     */
    readonly properties?: {
        [key: string]: PropertyConfig;
    };

    /**
     * Define component listeners.
     */
    readonly listeners?: {
        [key: string]: ListenerConfig;
    };

    /**
     * Identify shimmed constructors.
     * Constructor will skip native constructing when true.
     */
    shim?: boolean;

    /**
     * Upgrade a plain element prototype.
     * @param node The node to upgrade.
     * @returns The new prototyped node.
     */
    upgrade(node: HTMLElement): T;

    /**
     * Create a new Component instance.
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    // We cannot infer component properties from the base class
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new(node?: HTMLElement, properties?: { [key: string]: any }): T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new(properties?: { [key: string]: any }): T;

    prototype: T;
}

/**
 * Check if a node is a component.
 * @param node The node to check.
 * @returns True if element is a custom element.
 */
export const isComponent = <T extends ComponentInstance>(node: T|Node): node is T => !!(node as WithComponentFlags<T>)[COMPONENT_SYMBOL];

/**
 * Check if a node is a constructed component.
 * @param node The node to check.
 * @returns True if the element is fully constructed.
 */
export const isConstructed = <T extends ComponentInstance>(node: T): boolean => !!(node as WithComponentFlags<T>)[CONSTRUCTED_SYMBOL];

/**
 * Add the constructed flag to the node.
 * @param node The constructed node.
 */
export const flagConstructed = <T extends ComponentInstance>(node: T) => {
    (node as WithComponentFlags<T>)[CONSTRUCTED_SYMBOL] = true;
};

/**
 * Check if a custom element has been initialized.
 * @param node The node to check.
 * @returns True if the element is fully constructed.
 */
export const isInitialized = <T extends ComponentInstance>(node: T): boolean => !!(node as WithComponentFlags<T>)[INITIALIZED_SYMBOL];

/**
 * Add the initialized flag to the node.
 * @param node The initialized node.
 */
export const flagInitialized = <T extends ComponentInstance>(node: T) => {
    (node as WithComponentFlags<T>)[INITIALIZED_SYMBOL] = true;
};

/**
 * Check if a constructor is a component constructor.
 * @param constructor The constructor to check.
 * @returns True if the constructor is a component class.
 */
export const isComponentConstructor = <T extends ComponentInstance, C extends ComponentConstructor<T>>(constructor: Function | C): constructor is C => !!constructor.prototype[COMPONENT_SYMBOL];

/**
 * Extract slotted child nodes for initial child nodes.
 * @param element The compoonent instance.
 * @returns A list of new slotted children.
 */
function initSlotChildNodes<T extends HTMLElement, C extends ComponentInstance<T>>(element: C) {
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
 * @returns The extend class.
 */
const mixin = <T extends HTMLElement>(ctor: Constructor<T>) => {
    const Component = class Component extends (ctor as Constructor<HTMLElement>) {
        /**
         * An array containing the names of the attributes to observe.
         * @returns The list of attributes to observe.
         */
        static get observedAttributes(): string[] {
            const propertiesDescriptor = getProperties(this.prototype);
            const attributes = [];
            for (const key in propertiesDescriptor) {
                const prop = propertiesDescriptor[key as keyof typeof propertiesDescriptor];
                if (prop && prop.attribute && !prop.state) {
                    attributes.push(prop.attribute);
                }
            }

            return attributes;
        }

        /**
         * Define component properties.
         */
        static readonly properties?: {
            [key: string]: PropertyConfig;
        };

        /**
         * Define component listeners.
         */
        static readonly listeners?: {
            [key: string]: ListenerConfig;
        };

        /**
         * Identify shimmed constructors.
         * Constructor will skip native constructing when true.
         */
        static shim?: boolean;

        /**
         * Upgrade a plain element prototype.
         * @param node The node to upgrade.
         * @returns The new prototyped node.
         */
        static upgrade(node: HTMLElement) {
            return new this(node);
        }

        /**
         * The tag name used for Component definition.
         * @returns The custom element definition name.
         */
        get is(): string {
            return undefined as unknown as string;
        }

        /**
         * A flag with the connected value of the node.
         * @returns True if the node is connected to the document.
         */
        get isConnected(): boolean {
            return isConnected.call(this);
        }

        /**
         * A list of slot nodes.
         * @returns The list of slotted nodes.
         */
        get slotChildNodes() {
            return getOrCreateContext(this).slotChildNodes;
        }

        /**
         * Handle setting text content to component.
         * @returns The element text content.
         */
        get textContent() {
            return super.textContent;
        }
        set textContent(value) {
            render(value, this);
        }

        /**
         * Handle setting text content to component.
         * @returns The element inner HTML.
         */
        get innerHTML() {
            return super.innerHTML;
        }
        set innerHTML(value) {
            render(parseDOM(value), this);
            customElements.upgrade(this);
        }

        constructor(...args: any[]) {
            super();

            const node = isElement(args[0]) && args[0];
            const props = (node ? args[1] : args[0]) as Members<this>;

            const element = (node ? (setPrototypeOf(node, this), node) : this) as this;
            const context = getOrCreateContext(element);
            context.is = element.is;

            // setup listeners
            const computedListeners = getListeners(element).map((listener) => ({
                ...listener,
                callback: listener.callback.bind(element),
            }));
            setListeners(element, computedListeners);
            for (let i = 0, len = computedListeners.length; i < len; i++) {
                const { event, target, selector, callback, options } = computedListeners[i];
                if (!target) {
                    element.delegateEventListener(event, selector, callback, options);
                }
            }

            // setup properties
            const computedProperties = getProperties(element);
            for (const propertyKey in computedProperties) {
                delete element[propertyKey];
                const property = computedProperties[propertyKey];
                if (typeof property.initializer === 'function') {
                    element[propertyKey] = property.initializer.call(element);
                } else if (typeof property.defaultValue !== 'undefined') {
                    element[propertyKey] = property.defaultValue;
                }
            }

            element.initialize(props);
            return element;
        }

        /**
         * Initialize component properties.
         * @param properties A set of initial properties for the element.
         */
        initialize(properties?: Members<this>) {
            flagConstructed(this);
            if (properties) {
                for (const propertyKey in properties) {
                    this[propertyKey] = properties[propertyKey] as this[typeof propertyKey];
                }
            }
            initSlotChildNodes(this);
            flagInitialized(this);
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

            const listeners = getListeners(this);
            for (let i = 0, len = listeners.length; i < len; i++) {
                const { event, target, callback, options } = listeners[i];
                if (target) {
                    target.addEventListener(event, callback, options);
                }
            }

            // trigger a re-render when the Node is connected
            this.forceUpdate();
        }

        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback() {
            const listeners = getListeners(this);
            for (let i = 0, len = listeners.length; i < len; i++) {
                const { event, target, callback, options } = listeners[i];
                if (target) {
                    target.removeEventListener(event, callback, options);
                }
            }
        }

        /**
         * Invoked each time one of the Component's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         */
        attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: string | null) {
            reflectAttributeToProperty(this, attributeName, newValue);
        }

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]) {
            reflectPropertyToAttribute(this, propertyName, newValue);
        }

        /**
         * Invoked each time one of a Component's property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        propertyChangedCallback<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]) {
            reflectPropertyToAttribute(this, propertyName, newValue);
        }

        /**
         * Get the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @returns The inner value of the property.
         */
        getInnerPropertyValue<P extends keyof this>(propertyName: P): this[P] {
            const property = getProperty(this, propertyName, true);
            return this[property.symbol as keyof this] as this[P];
        }

        /**
         * Set the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @param value The inner value to set.
         */
        setInnerPropertyValue<P extends keyof this>(propertyName: P, value: this[P]) {
            const property = getProperty(this, propertyName, true);
            this[property.symbol as keyof this] = value;
        }

        /**
         * Observe a Component Property.
         *
         * @param propertyName The name of the Property to observe
         * @param observer The callback function
         */
        observe<P extends keyof this>(propertyName: P, observer: PropertyObserver<this[P]>) {
            addObserver(this, propertyName, observer);
        }

        /**
         * Unobserve a Component Property.
         *
         * @param propertyName The name of the Property to unobserve
         * @param observer The callback function to remove
         */
        unobserve<P extends keyof this>(propertyName: P, observer: PropertyObserver<this[P]>) {
            removeObserver(this, propertyName, observer);
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
         * @param event The event name to listen.
         * @param selector The selector to delegate.
         * @param callback The callback to trigger when an Event matches the delegation.
         * @param options Add event listener options.
         */
        delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback, options?: AddEventListenerOptions) {
            delegateEventListener(this, event, selector, callback, options);
        }

        /**
         * Remove an Event delegation.
         *
         * @param event The Event name to undelegate.
         * @param selector The selector to undelegate.
         * @param callback The callback to remove,
         */
        undelegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback) {
            undelegateEventListener(this, event, selector, callback);
        }

        /**
         * Render method of the Component.
         *
         * @returns The instances of the rendered Components and/or Nodes
         */
        render(): Template | undefined {
            return this.slotChildNodes;
        }

        /**
         * Force an element to re-render.
         */
        forceUpdate() {
            const childNodes = this.slotChildNodes;
            if (childNodes) {
                internalRender(this, this.render(), false);
            }
        }

        /**
         * Append a child to the Component.
         *
         * @param newChild The child to add.
         * @returns The appended child.
         */
        appendChild<T extends Node>(newChild: T): T {
            return DOM.appendChild(this, newChild);
        }

        /**
         * Remove a child from the Component.
         *
         * @param oldChild The child to remove.
         * @returns The removed node.
         */
        removeChild<T extends Node>(oldChild: T): T {
            return DOM.removeChild(this, oldChild);
        }

        /**
         * Insert a child before another in the Component.
         *
         * @param newChild The child to insert.
         * @param refChild The referred node.
         * @returns The inserted child.
         */
        insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
            return DOM.insertBefore(this, newChild, refChild);
        }

        /**
         * Replace a child with another in the Component.
         *
         * @param newChild The child to insert.
         * @param oldChild The Node to replace.
         * @returns The replaced node.
         */
        replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
            return DOM.replaceChild(this, newChild, oldChild);
        }

        /**
         * Insert a child at the given position.
         * @param position The position of the insertion.
         * @param insertedElement The child to insert.
         * @returns The inserted child.
         */
        insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null {
            return DOM.insertAdjacentElement(this, position, insertedElement);
        }

        /**
         * Set a Component attribute.
         * @param qualifiedName The attribute name.
         * @param value The value to set.
         */
        setAttribute(qualifiedName: string, value: string) {
            DOM.setAttribute(this, qualifiedName, value);
        }

        /**
         * Remove a Component attribute.
         * @param qualifiedName The attribute name.
         */
        removeAttribute(qualifiedName: string) {
            DOM.removeAttribute(this, qualifiedName);
        }
    };

    defineProperty(Component.prototype, COMPONENT_SYMBOL, {
        get() {
            return true;
        },
    });

    return Component as ComponentConstructor<ComponentInstance<T>>;
};

/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param base The constructor or the class to shim.
 * @returns A newable constructor with the same prototype.
 */
export const shim = <T extends { new(): HTMLElement; prototype: HTMLElement }>(base: T): T => {
    type Component = ComponentInstance<InstanceType<T>>;
    type Constrcutor = ComponentConstructor<Component>;

    const shim = function ShimComponent(this: Component, ...args: any[]) {
        const constructor = this.constructor as Constrcutor;
        const is = this.is;
        if (!is) {
            throw new TypeError('Illegal constructor');
        }

        const tag = customElements.tagNames[is];
        let element: Component;
        if (customElements.native && !constructor.shim) {
            element = Reflect.construct(base, args, constructor);
            if (tag === element.localName) {
                return element;
            }
        }

        element = createElementImpl(tag) as Component;
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
 * @param constructor The constructor (eg. "HTMLAnchorElement") to extend.
 * @returns A proxy that extends the native constructor.
 */
export const extend = <T extends HTMLElement>(constructor: Constructor<T>) => mixin(shim(constructor));

/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 */
export const Component = extend(HTMLElementConstructor);

/**
 * Decorate and define component classes.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @returns The decorated component class.
 */
export const customElement = (name: string, options?: ElementDefinitionOptions) =>
    // TypeScript complains about return type because we handle babel output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends ComponentConstructor>(classOrDescriptor: T|ClassDescriptor): any => {
        const upgrade = (constructor: T) => {
            const Component = class Component extends (constructor as ComponentConstructor) {
                /**
                 * Store constructor properties.
                 */
                private __initProps?: Members<this>;

                /**
                 * @inheritdoc
                 */
                constructor(...args: any[]) {
                    super(...args);
                    if (name === this.is) {
                        flagConstructed(this);
                        this.initialize(this.__initProps);
                    }
                }

                /**
                 * @inheritdoc
                 */
                initialize(properties?: Members<this>) {
                    if (!isConstructed(this)) {
                        this.__initProps = properties;
                        return;
                    }
                    return super.initialize(properties);
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
            finisher(constructor: Function) {
                return upgrade(constructor as T);
            },
        };
    };
