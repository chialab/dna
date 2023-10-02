import { attachRealm, type Realm } from '@chialab/quantum';
import { customElements, HTMLElement } from '$env';
import { type ClassDescriptor } from './ClassDescriptor';
import { getRootContext } from './Context';
import { type CustomElement, type CustomElementConstructor } from './CustomElement';
import { parseDOM } from './directives';
import {
    defineListeners,
    delegateEventListener,
    dispatchAsyncEvent,
    dispatchEvent,
    getListeners,
    setListeners,
    undelegateEventListener,
    type DelegatedEventCallback,
    type ListenerConfig,
} from './events';
import { defineProperty, isElement, setPrototypeOf, type Constructor } from './helpers';
import { type KeyedProperties, type Template } from './JSX';
import {
    addObserver,
    defineProperties,
    getProperties,
    getProperty,
    getWatched,
    reflectAttributeToProperty,
    reflectPropertyToAttribute,
    removeObserver,
    type PropertyConfig,
    type PropertyObserver,
    type Props,
} from './property';
import { internalRender, render } from './render';

/**
 * A symbol which identify components.
 */
export const COMPONENT_SYMBOL: unique symbol = Symbol();

/**
 * An augmented node with component flags.
 */
export type WithComponentProto<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
};

/**
 * The component mixin interface.
 * This is a helper interface for the TypeScript compiler:
 * for some reasons, TS compiles the base Component class as a variables, losing hierarchy information.
 * We use this mixin to cast the Component class constructor in order to preserve type definition.
 */
export interface ComponentMixin {
    /**
     * Type getter for JSX properties.
     */
    readonly __jsxProperties__: Props<this> & KeyedProperties;

    /**
     * The realm of the component.
     */
    readonly realm: Realm;

    /**
     * The defined component name.
     * For autonomous custom elements, this is the tag name.
     */
    readonly is: string;

    /**
     * A list of slot nodes.
     * @deprecated Use `realm.childNodes` instead.
     */
    get slotChildNodes(): Node[] | undefined;

    /**
     * Invoked each time one of a Component's state property is setted, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    stateChangedCallback<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): void;

    /**
     * Invoked each time one of a Component's property is setted, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    propertyChangedCallback<P extends keyof this>(
        propertyName: P,
        oldValue: this[P] | undefined,
        newValue: this[P]
    ): void;

    /**
     * Get the inner value of a property.
     * This is an helper method for properties getters and setters.
     * @param propertyName The name of the property to get.
     * @returns The inner value of the property.
     */
    getInnerPropertyValue<P extends keyof this>(propertyName: P): this[P];

    /**
     * Set the inner value of a property.
     * This is an helper method for properties getters and setters.
     * @param propertyName The name of the property to get.
     * @param value The inner value to set.
     */
    setInnerPropertyValue<P extends keyof this>(propertyName: P, value: this[P]): void;

    /**
     * Observe a Component Property.
     *
     * @param propertyName The name of the Property to observe
     * @param observer The callback function
     */
    observe<P extends keyof this>(propertyName: P, observer: PropertyObserver<this[P]>): void;

    /**
     * Unobserve a Component Property.
     *
     * @param propertyName The name of the Property to unobserve
     * @param observer The callback function to remove
     */
    unobserve<P extends keyof this>(propertyName: P, observer: PropertyObserver<this[P]>): void;

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
    dispatchEvent(
        event: string,
        detail?: CustomEventInit['detail'],
        bubbles?: boolean,
        cancelable?: boolean,
        composed?: boolean
    ): boolean;

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
    dispatchAsyncEvent(
        event: string,
        detail?: CustomEventInit['detail'],
        bubbles?: boolean,
        cancelable?: boolean,
        composed?: boolean
    ): Promise<any[]>;

    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(
        event: string,
        selector: string | null,
        callback: DelegatedEventCallback,
        options?: AddEventListenerOptions
    ): void;

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
 * The basic DNA Component constructor.
 */
export interface ComponentConstructor<T extends ComponentInstance = ComponentInstance>
    extends CustomElementConstructor<T> {
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
     * Create a new Component instance.
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    // We cannot infer component properties from the base class
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (node?: HTMLElement, properties?: { [key: string]: any }): T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (properties?: { [key: string]: any }): T;

    prototype: T;
}

/**
 * Check if a node is a component.
 * @param node The node to check.
 * @returns True if element is a custom element.
 */
export const isComponent = <T extends ComponentInstance>(node: T | Node): node is T =>
    !!(node as WithComponentProto<typeof node>)[COMPONENT_SYMBOL];

/**
 * Check if a constructor is a component constructor.
 * @param constructor The constructor to check.
 * @returns True if the constructor is a component class.
 */
export const isComponentConstructor = <T extends ComponentInstance, C extends ComponentConstructor<T>>(
    constructor: Function | C
): constructor is C => !!constructor.prototype && !!constructor.prototype[COMPONENT_SYMBOL];

/**
 * Create a base Component class which extends a native constructor.
 * @param ctor The base HTMLElement constructor to extend.
 * @returns The extend class.
 */
const mixin = <T extends HTMLElement>(ctor: Constructor<T>) => {
    const Component = class Component extends (ctor as Constructor<HTMLElement>) {
        /**
         * Type getter for JSX properties.
         */
        declare readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * An array containing the names of the attributes to observe.
         * @returns The list of attributes to observe.
         */
        static get observedAttributes(): string[] {
            const propertiesDescriptor = getProperties(this.prototype as unknown as ComponentInstance<T>);
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
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * The tag name used for Component definition.
         * @returns The custom element definition name.
         */
        get is(): string {
            return undefined as unknown as string;
        }

        /**
         * A list of slot nodes.
         * @deprecated Use `realm.childNodes` instead.
         * @returns The list of slotted nodes.
         */
        get slotChildNodes() {
            return this.realm.childNodes;
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
            const element = (node ? (setPrototypeOf(node, this), node) : this) as this;

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
                if (property.static) {
                    getWatched(element).push(propertyKey);
                }
            }

            const realm = attachRealm(element);
            defineProperty(element, 'realm', {
                value: realm,
                configurable: true,
            });
            realm.observe(() => element.forceUpdate());

            return element;
        }

        /**
         * Invoked each time the Component is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback() {
            if (!this.hasAttribute(':defined')) {
                if (this.is !== this.localName) {
                    // force the is attribute
                    this.setAttribute('is', this.is);
                }
                this.setAttribute(':scope', this.is);
                this.setAttribute(':defined', '');
            }

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
        propertyChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ) {
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
        dispatchEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean
        ): boolean;
        dispatchEvent(
            event: Event | string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean
        ) {
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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean
        ): Promise<any[]>;
        dispatchAsyncEvent(
            event: Event | string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean
        ) {
            return dispatchAsyncEvent(this, event as string, detail, bubbles, cancelable, composed);
        }

        /**
         * Delegate an Event listener.
         * @param event The event name to listen.
         * @param selector The selector to delegate.
         * @param callback The callback to trigger when an Event matches the delegation.
         * @param options Add event listener options.
         */
        delegateEventListener(
            event: string,
            selector: string | null,
            callback: DelegatedEventCallback,
            options?: AddEventListenerOptions
        ) {
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
            return this.realm?.childNodes;
        }

        /**
         * Force an element to re-render.
         */
        forceUpdate() {
            const realm = this.realm;
            if (realm) {
                realm.requestUpdate(() => {
                    internalRender(getRootContext(realm.root), this.render(), realm);
                });
            }
        }
    };

    defineProperty(Component.prototype, COMPONENT_SYMBOL, {
        get() {
            return true;
        },
    });

    return Component as unknown as ComponentConstructor<ComponentInstance<T>>;
};

/**
 * Get a native HTMLElement constructor to  extend by its name.
 * @param constructor The constructor (eg. "HTMLAnchorElement") to extend.
 * @returns A proxy that extends the native constructor.
 */
export const extend = <T extends HTMLElement>(constructor: Constructor<T>) => mixin(constructor);

/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 */
export const Component = extend(HTMLElement);

/**
 * Decorate a component class in order to watch decorated properties.
 * @param constructor The component class to decorate.
 * @returns The decorated component class.
 */
const decorateConstructor = <T extends ComponentConstructor>(constructor: T) =>
    class Component extends (constructor as ComponentConstructor) {
        /**
         * @inheritdoc
         */
        constructor(...args: any[]) {
            super(...args);

            const properties = getProperties(Component.prototype as this);
            for (const propertyKey in properties) {
                getWatched(this).push(propertyKey);
            }
        }
    };

/**
 * Decorate a component prototype class.
 * @param classOrDescriptor The component class to decorate.
 * @returns The decorated component class.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customElementPrototype = <T extends ComponentConstructor>(classOrDescriptor: T | ClassDescriptor): any => {
    if (typeof classOrDescriptor === 'function') {
        // typescript
        return decorateConstructor(classOrDescriptor);
    }

    // spec 2
    const { kind, elements } = classOrDescriptor;
    return {
        kind,
        elements,
        finisher(constructor: Function) {
            return decorateConstructor(constructor as T);
        },
    };
};

/**
 * Define a component class.
 * @param name The name of the custom element.
 * @param constructor The component class to define.
 * @param options The custom element options.
 * @returns The decorated component class.
 * @throws If the name has already been registered.
 * @throws An error if the component is already defined.
 */
export function define(name: string, constructor: ComponentConstructor, options?: ElementDefinitionOptions) {
    defineProperties(constructor.prototype);
    defineListeners(constructor.prototype);
    try {
        defineProperty(constructor.prototype, 'is', {
            writable: false,
            configurable: false,
            value: name,
        });
    } catch {
        throw new Error(
            'The registry already contains an entry with the constructor (or is otherwise already defined)'
        );
    }
    customElements.define(name, constructor, options);

    return constructor;
}

/**
 * Decorate and define a component class.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @returns The decorated component class.
 */
export const customElement =
    (name: string, options?: ElementDefinitionOptions) =>
    // TypeScript complains about return type because we handle babel output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends ComponentConstructor>(classOrDescriptor: T | ClassDescriptor): any => {
        if (typeof classOrDescriptor === 'function') {
            // typescript
            return define(name, decorateConstructor(classOrDescriptor), options);
        }

        // spec 2
        const { kind, elements } = classOrDescriptor;
        return {
            kind,
            elements,
            finisher(constructor: Function) {
                return define(name, decorateConstructor(constructor as T), options);
            },
        };
    };
