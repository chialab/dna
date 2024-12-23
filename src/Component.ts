import { attachRealm, type Realm } from '@chialab/quantum';
import { type ClassDescriptor } from './ClassDescriptor';
import { $parse } from './directives';
import * as Elements from './Elements';
import {
    defineListeners,
    delegateEventListener,
    dispatchAsyncEvent,
    dispatchEvent,
    getListeners,
    undelegateEventListener,
    type DelegatedEventCallback,
    type ListenerConfig,
} from './events';
import { defineProperty, isBrowser, setPrototypeOf } from './helpers';
import { type HTML as HTMLNamespace } from './HTML';
import { type Template } from './JSX';
import {
    addObserver,
    defineProperties,
    getProperties,
    getProperty,
    getPropertyForAttribute,
    reflectPropertyToAttribute,
    removeObserver,
    type PropertyConfig,
    type PropertyObserver,
} from './property';
import { getRootContext, internalRender, render } from './render';

/**
 * A symbol which identify components.
 */
const COMPONENT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol which identify constructed elements.
 */
const INITIALIZED_SYMBOL: unique symbol = Symbol();

/**
 * An augmented node with component flags.
 */
type WithComponentProto<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
    [INITIALIZED_SYMBOL]?: boolean;
};

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
export const isComponentConstructor = <T extends ComponentConstructor>(constructor: Function | T): constructor is T =>
    !!constructor.prototype && !!constructor.prototype[COMPONENT_SYMBOL];

/**
 * Create a base Component class which extends a native constructor.
 * @param ctor The base HTMLElement constructor to extend.
 * @returns The extend class.
 */
export const extend = <T extends HTMLElement, C extends { new (...args: any[]): T; prototype: T }>(ctor: C) =>
    class Component extends (ctor as { new (...args: any[]): HTMLElement; prototype: HTMLElement }) {
        /**
         * An array containing the names of the attributes to observe.
         * @returns The list of attributes to observe.
         */
        static get observedAttributes(): string[] {
            const propertiesDescriptor = getProperties(this.prototype as ComponentInstance);
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
         * A flag to indicate if the component is collecting updates.
         */
        private _collectingUpdates = 0;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        private _updateScheduled = false;

        /**
         * The property that changed.
         */
        private _changedProperty: keyof this | null = null;

        /**
         * The initial properties of the component.
         */
        private _initialProps?: Record<Extract<keyof this, string>, this[Extract<keyof this, string>]>;

        /**
         * A flag to indicate component instances.
         * @returns True if the element is a component.
         */
        get [COMPONENT_SYMBOL]() {
            return true;
        }

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
            render($parse(value), this);
            customElements.upgrade(this);
        }

        constructor(...args: any[]) {
            super();
            if (!isBrowser) {
                throw new Error('Components can be used only in browser environment');
            }

            const element = (args.length ? (setPrototypeOf(args[0], this), args[0]) : this) as this;
            const realm = attachRealm(element);
            defineProperty(element, 'realm', {
                value: realm,
                configurable: true,
            });

            element._initialProps = Object.getOwnPropertyNames(element).reduce(
                (acc, key) => {
                    acc[key as Extract<keyof this, string>] = element[key as Extract<keyof this, string>];
                    return acc;
                },
                {} as Record<Extract<keyof this, string>, this[Extract<keyof this, string>]>
            );

            return element;
        }

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         * @throws An error if the component has already been initialized.
         */
        initialize() {
            if (isInitialized(this)) {
                throw new Error('The component has already been initialized');
            }

            // setup listeners
            const computedListeners = getListeners(this);
            for (let i = 0, len = computedListeners.length; i < len; i++) {
                const { event, selector, callback, options } = computedListeners[i];
                this.delegateEventListener(event, selector, callback.bind(this), options);
            }

            // setup properties
            const computedProperties = getProperties(this);
            for (const propertyKey in computedProperties) {
                delete this[propertyKey];
                const property = computedProperties[propertyKey];
                if (typeof property.initializer === 'function') {
                    this[propertyKey] = property.initializer.call(this);
                } else if (typeof property.defaultValue !== 'undefined') {
                    this[propertyKey] = property.defaultValue;
                }
            }

            this.realm.observe(() => this.requestUpdate());
            (this as WithComponentProto<ComponentInstance>)[INITIALIZED_SYMBOL] = true;

            for (const propertyKey in computedProperties) {
                const property = computedProperties[propertyKey];
                if (this._initialProps?.[propertyKey] !== undefined && (!property.get || property.set)) {
                    this[propertyKey] = this._initialProps[propertyKey];
                }
            }
            delete this._initialProps;
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

            // trigger a re-render when the Node is connected
            this.requestUpdate();
        }

        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback() {}

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback() {}

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

            const { name, attribute, fromAttribute } = property;
            if (name === this._changedProperty) {
                return;
            }

            if (attribute && fromAttribute) {
                this[name] = fromAttribute.call(this, newValue);
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
            this._changedProperty = propertyName;
            reflectPropertyToAttribute(this, propertyName, newValue);
            this._changedProperty = null;
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
            this._changedProperty = propertyName;
            reflectPropertyToAttribute(this, propertyName, newValue);
            this._changedProperty = null;
        }

        /**
         * Get the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @returns The inner value of the property.
         */
        getInnerPropertyValue<P extends keyof this>(propertyName: P): this[P] {
            return this[getProperty(this, propertyName, true).symbol as keyof this] as this[P];
        }

        /**
         * Set the inner value of a property.
         * This is an helper method for properties getters and setters.
         * @param propertyName The name of the property to get.
         * @param value The inner value to set.
         */
        setInnerPropertyValue<P extends keyof this>(propertyName: P, value: this[P]) {
            this[getProperty(this, propertyName, true).symbol as keyof this] = value;
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
            return dispatchEvent(this, event, detail, bubbles, cancelable, composed);
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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
         * Check if the component should update.
         *
         * @returns True if the component should update.
         */
        shouldUpdate() {
            return true;
        }

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate() {
            if (this._collectingUpdates === 0) {
                this.forceUpdate();
                return true;
            }

            this._updateScheduled = true;
            return false;
        }

        /**
         * Force an element to re-render.
         */
        forceUpdate() {
            const realm = this.realm;
            if (realm) {
                this.collectUpdatesStart();
                realm.requestUpdate(() => {
                    internalRender(getRootContext(realm.root), this.render(), realm);
                });
                this.collectUpdatesEnd();
                this.updatedCallback();
            }
        }

        /**
         * Start collecting updates.
         */
        collectUpdatesStart() {
            this._collectingUpdates++;
        }

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd() {
            this._collectingUpdates--;

            if (this._updateScheduled && this._collectingUpdates === 0) {
                this._updateScheduled = false;
                this.requestUpdate();
                return true;
            }
            return false;
        }

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object) {
            this.collectUpdatesStart();
            try {
                for (const key in props) {
                    this[key as keyof this] = props[key as keyof typeof props] as this[keyof typeof props];
                }
            } finally {
                this.collectUpdatesEnd();
            }

            return this;
        }
    } as unknown as BaseComponentConstructor<T>;

/**
 * A collection of extended builtin HTML constructors.
 */
export const HTML = new Proxy({} as typeof HTMLNamespace, {
    get(target, name) {
        const constructor = Reflect.get(target, name);
        if (constructor) {
            return constructor;
        }
        if (name === 'Element') {
            name = 'HTMLElement';
        } else {
            name = `HTML${name as string}Element`;
        }

        if (name in Elements) {
            const constructor = extend(Elements[name as keyof typeof Elements]);
            Reflect.set(target, name, constructor);
            return constructor;
        }

        return null;
    },
});

/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete lifecycle implementation.
 * All DNA components **must** extends this class.
 */
export const Component = HTML.Element;

/**
 * The basic DNA Component interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export type ComponentInstance = InstanceType<typeof Component>;

/**
 * Base Component constructor.
 */
export interface BaseComponentConstructor<T extends HTMLElement = HTMLElement> {
    /**
     * The tag name of the extended builtin element.
     */
    readonly tagName?: string;

    /**
     * An array containing the names of the attributes to observe.
     */
    readonly observedAttributes?: string[];

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
    new (...args: any[]): T;

    prototype: T;
}

/**
 * The basic DNA Component constructor.
 */
export type ComponentConstructor<T extends ComponentInstance = ComponentInstance> = BaseComponentConstructor<T>;

/**
 * Check if a component has been constructed.
 * @param element The element to check.
 * @returns True if the element has been constructed.
 */
export const isInitialized = (element: ComponentInstance) =>
    !!(element as WithComponentProto<ComponentInstance>)[INITIALIZED_SYMBOL];

/**
 * Define a component class.
 * @param name The name of the custom element.
 * @param constructor The component class to define.
 * @param options The custom element options.
 * @returns The decorated component class.
 * @throws If the name has already been registered.
 * @throws An error if the component is already defined.
 */
export function define<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    name: string,
    constructor: C,
    options?: ElementDefinitionOptions
) {
    class Component extends (constructor as ComponentConstructor) {
        constructor(...args: any[]) {
            super(...args);
            if (new.target === Component && !isInitialized(this)) {
                this.initialize();
            }
        }
    }

    defineProperties(Component.prototype);
    defineListeners(Component.prototype);
    try {
        if (constructor.name) {
            defineProperty(Component, 'name', {
                writable: false,
                configurable: false,
                value: constructor.name,
            });
        }
        defineProperty(Component, 'tagName', {
            writable: false,
            configurable: false,
            value: (options && options.extends) || name,
        });
        defineProperty(Component.prototype, 'is', {
            writable: false,
            configurable: false,
            value: name,
        });
    } catch {
        throw new Error(
            'The registry already contains an entry with the constructor (or is otherwise already defined)'
        );
    }

    if (isBrowser) {
        customElements.define(name, Component, options);
    }

    return Component as C;
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
            return define(name, classOrDescriptor, options);
        }

        // spec 2
        const { kind, elements } = classOrDescriptor;
        return {
            kind,
            elements,
            finisher(constructor: Function) {
                return define(name, constructor as T, options);
            },
        };
    };
