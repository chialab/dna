import * as Elements from './Elements';
import {
    type DelegatedEventCallback,
    decoratedEvents,
    decoratedListeners,
    defineListener,
    delegateEventListener,
    dispatchAsyncEvent,
    dispatchEvent,
    type EventHandler,
    getListeners,
    type ListenerConfig,
    staticListeners,
    undelegateEventListener,
} from './events';
import { uniqueId } from './factories';
import type { HTML as HTMLNamespace } from './HTML';
import {
    defineProperty as _defineProperty,
    type ClassDescriptor,
    type Constructor,
    getPrototypeOf,
    hasOwn,
    isBrowser,
    setPrototypeOf,
} from './helpers';
import type { Template } from './JSX';
import {
    addObserver,
    decoratedObservers,
    decoratedPropertiesDeclarations,
    defineObserver,
    defineProperty,
    getObservers,
    getProperties,
    getProperty,
    getPropertyForAttribute,
    type PropertyConfig,
    type PropertyDeclaration,
    type PropertyObserver,
    reflectPropertyToAttribute,
    removeObserver,
    staticPropertiesDeclarations,
} from './property';
import { getParentRealm, Realm } from './Realm';
import { getRootContext, internalRender } from './render';

/**
 * A symbol which identify components.
 */
const COMPONENT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol which identify constructed elements.
 */
const INITIALIZED_SYMBOL: unique symbol = Symbol();

/**
 * A symbol which identify connected elements.
 */
const CONNECTED_SYMBOL: unique symbol = Symbol();

/**
 * An augmented node with component flags.
 */
type WithComponentProto<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
    [INITIALIZED_SYMBOL]?: boolean;
    [CONNECTED_SYMBOL]?: boolean;
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
 * @param ctr The constructor to check.
 * @returns True if the constructor is a component class.
 */
export const isComponentConstructor = (ctr: Constructor<HTMLElement>): ctr is ComponentConstructor =>
    !!(ctr.prototype as WithComponentProto<HTMLElement>)?.[COMPONENT_SYMBOL];

/**
 * Check if a component is connected.
 * @param element The component instance to check.
 * @returns True if the component is connected to the DOM and initialized.
 */
const isConnected = <T extends ComponentInstance>(element: T): boolean =>
    !!(element as WithComponentProto<T>)[CONNECTED_SYMBOL];

/**
 * Add connected flag to a component instance.
 * This is used to mark the component as connected to the DOM and initialized.
 * @param element The component instance to mark as connected.
 */
const connect = <T extends ComponentInstance>(element: T): void => {
    (element as WithComponentProto<T>)[CONNECTED_SYMBOL] = true;
};

/**
 * Mark a component instance as disconnected.
 * @param element The component instance to mark as disconnected.
 */
const disconnect = <T extends ComponentInstance>(element: T): void => {
    (element as WithComponentProto<T>)[CONNECTED_SYMBOL] = false;
};

/**
 * Create a base Component class which extends a native constructor.
 * @param ctor The base HTMLElement constructor to extend.
 * @returns The extend class.
 */
export const extend = <T extends HTMLElement, C extends Constructor<HTMLElement>>(ctor: C) =>
    class Component extends (ctor as Constructor<HTMLElement>) {
        /**
         * An array containing the names of the attributes to observe.
         * @returns The list of attributes to observe.
         */
        static get observedAttributes(): string[] {
            const propertiesDescriptor = getProperties(this.prototype as ComponentInstance);
            const attributes = [];
            for (const key in propertiesDescriptor) {
                const prop = propertiesDescriptor[key as keyof typeof propertiesDescriptor];
                if (prop?.attribute && !prop.state) {
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
        set is(value: string) {
            // do nothing, the is property is read-only, but no errors will be thrown
        }

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * A list of slot nodes.
         * @returns The list of slotted nodes.
         */
        get slotChildNodes(): Node[] {
            if (isConnected(this)) {
                return this.realm.childNodes;
            }
            return Array.from(this.childNodes);
        }

        /**
         * Handle setting text content to component.
         * @returns The element text content.
         */
        get textContent() {
            return super.textContent;
        }
        set textContent(value) {
            this._resetRendering();
            super.textContent = value;
            if (this.isConnected) {
                this.realm.initialize();
            }
        }

        /**
         * Handle setting text content to component.
         * @returns The element inner HTML.
         */
        get innerHTML() {
            return super.innerHTML;
        }
        set innerHTML(value) {
            this._resetRendering();
            super.innerHTML = value;
            if (this.isConnected) {
                customElements.upgrade(this);
                this.realm.initialize();
            }
        }

        constructor(node?: HTMLElement) {
            super();
            if (!isBrowser) {
                throw new Error('Components can be used only in browser environment');
            }

            let element: this;
            if (node) {
                setPrototypeOf(node, this);
                element = node as this;
            } else {
                element = this;
            }
            element._initialProps = Object.getOwnPropertyNames(element).reduce(
                (acc, key) => {
                    acc[key as Extract<keyof this, string>] = element[key as Extract<keyof this, string>];
                    return acc;
                },
                {} as Record<Extract<keyof this, string>, this[Extract<keyof this, string>]>
            );

            const realm = new Realm(element);
            _defineProperty(element, 'realm', {
                value: realm,
            });
            realm.dangerouslyOpen();
            realm.observe(() => {
                this.childListChangedCallback();
            });

            // biome-ignore lint/correctness/noConstructorReturn: We need to return the element instance for the CE polyfill.
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
                const [event, selector, callback, options] = computedListeners[i];
                this.delegateEventListener(event, selector, callback.bind(this), options);
            }

            // setup observers
            const computedObservers = getObservers(this);
            for (const propertyKey in computedObservers) {
                const observers = computedObservers[propertyKey];
                for (const observer of observers) {
                    this.observe(propertyKey, observer.bind(this));
                }
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

            flagInitialized(this);
            if (this.isConnected) {
                connect(this);
                this.realm.initialize();
            }

            for (const propertyKey in computedProperties) {
                const property = computedProperties[propertyKey];
                if (this._initialProps?.[propertyKey] !== undefined && (!property.get || property.set)) {
                    this[propertyKey] = this._initialProps[propertyKey];
                }
            }
            this._initialProps = undefined;
        }

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name: string | null = null): Node[] {
            return this.slotChildNodes.filter((node) => {
                if (node.nodeType === Node.COMMENT_NODE) {
                    return false;
                }
                if (getParentRealm(node) !== this.realm) {
                    // collect nodes from other realms
                    return !name;
                }
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return !name;
                }

                const slotName = (node as HTMLElement).getAttribute('slot') || null;
                return slotName === name;
            });
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

            if (!isConnected(this)) {
                connect(this);
                this.realm.initialize();
            }
        }

        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback() {
            disconnect(this);
            this._resetRendering();
            this.realm.restore();
        }

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback() {}

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback() {
            this.requestUpdate();
        }

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
        // biome-ignore lint/suspicious/noExplicitAny: We really need to return an array of any, as the event listeners can return anything.
        dispatchAsyncEvent(event: Event): Promise<any[]>;
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean
            // biome-ignore lint/suspicious/noExplicitAny: We really need to return an array of any, as the event listeners can return anything.
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
            return this.childNodesBySlot();
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
            if (!isConnected(this)) {
                return false;
            }
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
            this.collectUpdatesStart();
            this.realm.requestUpdate(() => {
                internalRender(getRootContext(this, true), this.render());
            });
            this.collectUpdatesEnd();
            this.updatedCallback();
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

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string {
            return uniqueId(this, ...suffixex);
        }

        /**
         * Reset the rendering state of the component.
         */
        private _resetRendering() {
            this.realm.requestUpdate(() => {
                internalRender(getRootContext(this, true), null);
            });
        }

        /**
         * @inheritdoc
         * @internal
         */
        appendChild<T extends Node>(node: T): T {
            if (this.realm.open) {
                return super.appendChild(node);
            }
            this.realm.append(node);
            return node;
        }

        /**
         * @inheritdoc
         * @internal
         */
        removeChild<T extends Node>(child: T): T {
            if (this.realm.open) {
                return super.removeChild(child);
            }
            this.realm.removeChild(child);
            return child;
        }

        /**
         * @inheritdoc
         * @internal
         */
        insertBefore<T extends Node>(node: T, child: Node | null): T {
            if (this.realm.open) {
                return super.insertBefore(node, child);
            }
            this.realm.insertBefore([node], child);
            return node;
        }

        /**
         * @inheritdoc
         * @internal
         */
        replaceChild<T extends Node>(node: Node, child: T): T {
            if (this.realm.open) {
                return super.replaceChild(node, child);
            }
            this.realm.replaceChild([node], child);
            return child;
        }

        /**
         * @inheritdoc
         * @internal
         */
        append(...nodes: (Node | string)[]): void {
            if (this.realm.open) {
                super.append(...nodes);
                return;
            }
            this.realm.append(...nodes);
        }

        /**
         * @inheritdoc
         * @internal
         */
        prepend(...nodes: (Node | string)[]): void {
            if (this.realm.open) {
                super.prepend(...nodes);
                return;
            }
            this.realm.prepend(...nodes);
        }

        /**
         * @inheritdoc
         * @internal
         */
        insertAdjacentElement(where: InsertPosition, element: Element): Element | null {
            if (this.realm.open) {
                return super.insertAdjacentElement(where, element);
            }
            switch (where) {
                case 'afterbegin':
                    this.realm.prepend(element);
                    return element;
                case 'beforeend':
                    this.realm.append(element);
                    return element;
                default:
                    return super.insertAdjacentElement(where, element);
            }
        }
    } as unknown as BaseComponentConstructor<T>;

/**
 * A collection of extended builtin HTML constructors.
 */
export const HTML: typeof HTMLNamespace = new Proxy({} as typeof HTMLNamespace, {
    get(target, name) {
        const ctr = Reflect.get(target, name);
        if (ctr) {
            return ctr;
        }
        const className =
            name === 'Element' ? 'HTMLElement' : (`HTML${name as string}Element` as keyof typeof Elements);
        if (className in Elements) {
            // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Elements is an alias of global HTML namespace
            const ctr = extend(Elements[className]);
            Reflect.set(target, name, ctr);
            return ctr;
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
export const Component: (typeof HTMLNamespace)['Element'] = HTML.Element;

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
     * Metadata for decorators.
     */
    readonly [Symbol.metadata]?: object;

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
    // biome-ignore lint/suspicious/noExplicitAny: We cannot infer component properties from the base class
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
export const isInitialized = (element: ComponentInstance): boolean =>
    !!(element as WithComponentProto<ComponentInstance>)[INITIALIZED_SYMBOL];

/**
 * Flag a component as initialized.
 * @param element The component instance to flag as initialized.
 */
const flagInitialized = (element: ComponentInstance): void => {
    (element as WithComponentProto<ComponentInstance>)[INITIALIZED_SYMBOL] = true;
};

/**
 * Finalize a component constructor.
 * @param name The name of the custom element.
 * @param ctr The component class to define.
 * @param options The custom element options.
 * @returns The decorated component class.
 * @throws If the name has already been registered.
 * @throws An error if the component is already defined.
 */
function finalize<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    name: string,
    ctr: C,
    options?: ElementDefinitionOptions
) {
    class Component extends (ctr as ComponentConstructor) {
        constructor(node?: HTMLElement) {
            super(node);
            if (new.target === Component && !isInitialized(this)) {
                this.initialize();
            }
        }
    }

    try {
        if (ctr.name) {
            _defineProperty(Component, 'name', {
                writable: false,
                configurable: false,
                value: ctr.name,
            });
        }
        if (hasOwn.call(ctr, Symbol.metadata)) {
            // ensure metadata is inherited
            _defineProperty(Component, Symbol.metadata, {
                writable: false,
                configurable: true,
                value: ctr[Symbol.metadata],
            });
        }
        _defineProperty(Component, 'tagName', {
            writable: false,
            configurable: false,
            value: options?.extends || name,
        });
        _defineProperty(Component.prototype, 'is', {
            configurable: false,
            get: () => name,
            set: () => {
                // do nothing, the is property is read-only, but no errors will be thrown
            },
        });
    } catch {
        throw new Error(
            'The registry already contains an entry with the constructor (or is otherwise already defined)'
        );
    }

    return Component as C;
}

/**
 * Define a component class.
 * @param name The name of the custom element.
 * @param ctr The component class to define.
 * @param options The custom element options.
 * @returns The decorated component class.
 * @throws If the name has already been registered.
 * @throws An error if the component is already defined.
 */
export function define<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    name: string,
    ctr: C,
    options?: ElementDefinitionOptions,
    finalizeConstructor = true
) {
    const handled = new Set<string>();
    const Component = finalizeConstructor ? finalize(name, ctr, options) : ctr;
    const prototype = Component.prototype as T;
    let currentCtr = Component;
    while (isComponentConstructor(currentCtr)) {
        for (const [propertyKey, declaration] of staticPropertiesDeclarations(currentCtr)) {
            if (handled.has(propertyKey)) {
                continue;
            }
            defineProperty(
                prototype,
                propertyKey,
                declaration as PropertyDeclaration<T[typeof propertyKey]>,
                undefined,
                true
            );
            handled.add(propertyKey);
        }

        for (const [propertyKey, declaration] of decoratedPropertiesDeclarations(currentCtr)) {
            if (handled.has(propertyKey)) {
                continue;
            }
            defineProperty(prototype, propertyKey, declaration as PropertyDeclaration<T[typeof propertyKey]>);
            handled.add(propertyKey);
        }

        for (const [propertyKey, eventName] of decoratedEvents(currentCtr)) {
            const key: unique symbol = Symbol();
            _defineProperty(prototype, propertyKey, {
                get(this: Element & { [key]?: EventHandler }) {
                    return this[key] ?? null;
                },
                set(this: Element & { [key]?: EventHandler }, value: EventHandler) {
                    const actualListener = this[key];
                    this[key] = value;
                    if (actualListener) {
                        this.removeEventListener(eventName, actualListener);
                    }
                    if (value) {
                        this.addEventListener(eventName, value);
                    }
                },
            });
        }

        for (const [event, selector, callback, options] of staticListeners(currentCtr)) {
            defineListener(prototype, event, selector, callback, options);
        }

        for (const [event, selector, callback, options] of decoratedListeners(currentCtr)) {
            defineListener(prototype, event, selector, callback, options);
        }

        for (const [propertyKey, observer] of decoratedObservers(currentCtr)) {
            defineObserver(prototype, propertyKey, observer);
        }

        currentCtr = getPrototypeOf(currentCtr);
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
    // biome-ignore lint/suspicious/noExplicitAny: TypeScript complains about return type because we handle babel output
    <T extends ComponentConstructor>(classOrDescriptor: T, context?: ClassDecoratorContext): any => {
        if (typeof context === 'object') {
            // standard decorator
            if (context.kind !== 'class') {
                throw new TypeError('The @customElement decorator can be used only on classes');
            }
            const ctr = finalize(name, classOrDescriptor, options);
            context.addInitializer(() => {
                define(name, ctr, options, false);
            });
            return ctr;
        }

        if (typeof classOrDescriptor === 'function') {
            // typescript
            return define(name, classOrDescriptor, options);
        }

        // spec 2
        const { kind, elements } = classOrDescriptor as ClassDescriptor<T, unknown>;
        return {
            kind,
            elements,
            finisher(ctr: T) {
                return define(name, ctr, options);
            },
        };
    };
