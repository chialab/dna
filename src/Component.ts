import { type ClassDescriptor } from './ClassDescriptor';
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
 * A symbol which identify the owner of a node.
 */
const OWNER_SYMBOL = Symbol();

/**
 * An augmented node with component flags.
 */
type WithComponentProto<T> = T & {
    [COMPONENT_SYMBOL]?: boolean;
    [INITIALIZED_SYMBOL]?: boolean;
};

/**
 * An augmented node with owner symbol.
 */
type WithOwner<T> = T & {
    [OWNER_SYMBOL]?: ComponentInstance | null;
};

/**
 * Get the owner of a node.
 * @param node The node to get the owner.
 * @returns The owner of the node.
 */
const getOwner = <T extends Node>(node: WithOwner<T>): ComponentInstance | null => node[OWNER_SYMBOL] ?? null;

/**
 * Set the owner of a node.
 * @param node The node to set the owner.
 * @param owner The owner of the node.
 */
const setOwner = <T extends Node>(node: WithOwner<T>, owner: ComponentInstance | null): void => {
    node[OWNER_SYMBOL] = owner;
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
         * A flag to indicate if the component is rendering.
         */
        private _rendering = false;

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
         * @returns The list of slotted nodes.
         */
        readonly slotChildNodes: Node[] = [];

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
                this._initializeSlotChildNodes();
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
                this._initializeSlotChildNodes();
            }
        }

        /**
         * The flag to indicate if the component is rendering.
         * @returns True if the component is rendering.
         */
        get rendering() {
            return this._rendering;
        }

        constructor(...args: any[]) {
            super();
            if (!isBrowser) {
                throw new Error('Components can be used only in browser environment');
            }

            const element = (args.length ? (setPrototypeOf(args[0], this), args[0]) : this) as this;
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
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name: string | null = null): Node[] {
            return this.slotChildNodes.filter((node) => {
                if (node.nodeType === Node.COMMENT_NODE) {
                    return false;
                }
                if (getOwner(node) !== this) {
                    return !name;
                }
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return !name;
                }
                const slotName = (node as Element).getAttribute('slot') || null;
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

            // trigger a re-render when the Node is connected
            this._initializeSlotChildNodes();
        }

        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback() {
            this._resetRendering();
            this._restoreSlotChildNodes();
        }

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
            if (!this.isConnected) {
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
            this.renderStart();
            internalRender(getRootContext(this, true), this.render());
            this.renderEnd();
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
         * Start rendering the component.
         */
        renderStart(): void {
            this._rendering = true;
        }

        /**
         * Stop rendering the component.
         */
        renderEnd(): void {
            this._rendering = false;
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
         * Initialize the slot child nodes.
         */
        private _initializeSlotChildNodes(): void {
            const remove = Reflect.get(ctor.prototype, 'removeChild').bind(this);
            customElements.upgrade(this);
            this.slotChildNodes.splice(0, this.slotChildNodes.length, ...[].slice.call(this.childNodes));
            this.slotChildNodes.forEach((node) => {
                this._adoptNode(node);
                remove(node);
            });
            this.requestUpdate();
        }

        /**
         * Reset the rendering state of the component.
         */
        private _resetRendering() {
            this.renderStart();
            internalRender(getRootContext(this, true), null);
            this.renderEnd();
        }

        /**
         * Restore the slot child nodes.
         */
        private _restoreSlotChildNodes(): void {
            const append = Reflect.get(ctor.prototype, 'appendChild').bind(this);
            this.slotChildNodes.forEach((node) => {
                this._releaseNode(node);
                append(node);
            });
            this.slotChildNodes.splice(0, this.slotChildNodes.length);
        }

        /**
         * Adopt a node into the component.
         * @param node The node to adopt.
         * @throws An error if the node is already adopted.
         */
        private _adoptNode(node: Node) {
            if (getOwner(node)) {
                throw new Error('Node already adopted');
            }

            setOwner(node, this);

            const root = this;
            if (node.nodeType === Node.COMMENT_NODE) {
                const proto = Object.getPrototypeOf(node as Comment);
                const shadowProto = {
                    get parentNode() {
                        return root;
                    },
                    get nextSibling() {
                        const io = root.slotChildNodes.indexOf(node);
                        if (io === -1) {
                            return null;
                        }
                        return root.slotChildNodes[io + 1] || null;
                    },
                    get previousSibling() {
                        const io = root.slotChildNodes.indexOf(node);
                        if (io === -1) {
                            return null;
                        }
                        return root.slotChildNodes[io - 1] || null;
                    },
                    before(...nodes: (Node | string)[]) {
                        root._insertNodesBefore(root._importNodes(nodes), node);
                        root.requestUpdate();
                    },
                    after(...nodes: (Node | string)[]) {
                        const io = root.slotChildNodes.indexOf(node);
                        const nextSibling = io === -1 ? null : root.slotChildNodes[io + 1];
                        root._insertNodesBefore(root._importNodes(nodes), nextSibling);
                        root.requestUpdate();
                    },
                };

                Object.setPrototypeOf(shadowProto, proto);
                Object.setPrototypeOf(node, shadowProto);
            }
        }

        /**
         * Release a node from the component.
         * @param node The node to release.
         */
        private _releaseNode(node: Node): void {
            if (getOwner(node) === this) {
                setOwner(node, null);
            }
        }

        /**
         * Create and import nodes into the component.
         * @param nodes The nodes to create and import.
         * @param acc The accumulator for the nodes.
         * @returns The imported nodes.
         */
        private _importNodes(nodes: (Node | string)[], acc: Node[] = []): Node[] {
            for (const node of nodes) {
                if (typeof node === 'string') {
                    const textNode = this.ownerDocument.createTextNode(node);
                    this._adoptNode(textNode);
                    acc.push(textNode);
                    continue;
                }
                if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    this._importNodes([].slice.call(node.childNodes), acc);
                    continue;
                }
                if (!getOwner(node)) {
                    this._adoptNode(node);
                }
                acc.push(node);
            }

            return acc;
        }

        /**
         * Remove nodes from the slot child nodes array.
         * @param nodes The nodes to remove.
         */
        private _removeNodes(nodes: Node[]) {
            for (const node of nodes) {
                const io = this.slotChildNodes.indexOf(node);
                if (io !== -1) {
                    this.slotChildNodes.splice(io, 1);
                }
            }
        }

        /**
         * Prepend nodes to the slot child nodes array.
         * @param nodes The nodes to prepend.
         */
        private _prependNodes(nodes: Node[]) {
            this._removeNodes(nodes);
            this.slotChildNodes.unshift(...nodes);
        }

        /**
         * Append nodes to the slot child nodes array.
         * @param nodes The nodes to append.
         */
        private _appendNodes(nodes: Node[]) {
            this._removeNodes(nodes);
            this.slotChildNodes.push(...nodes);
        }

        /**
         * Insert nodes before a reference node in the slot child nodes array.
         * @param nodes The nodes to insert.
         * @param referenceNode The reference node to insert before.
         */
        private _insertNodesBefore(nodes: Node[], referenceNode: Node | null) {
            const io = referenceNode ? this.slotChildNodes.indexOf(referenceNode) : -1;
            if (io === -1) {
                this._appendNodes(nodes);
                return;
            }
            this._removeNodes(nodes);
            this.slotChildNodes.splice(io, 0, ...nodes);
        }

        /**
         * Replace nodes in the slot child nodes array.
         * @param nodes The nodes to replace.
         * @param referenceNode The reference node to replace.
         */
        private _replaceNodes(nodes: Node[], referenceNode: Node) {
            const io = this.slotChildNodes.indexOf(referenceNode);
            if (io === -1) {
                this._appendNodes(nodes);
                return;
            }
            this._removeNodes(nodes);
            this.slotChildNodes.splice(io, 1, ...nodes);
        }

        /**
         * @inheritdoc
         */
        append(...nodes: (Node | string)[]): void {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'append').apply(this, nodes);
            }
            this._appendNodes(this._importNodes(nodes));
            this.requestUpdate();
        }

        /**
         * @inheritdoc
         */
        prepend(...nodes: (Node | string)[]): void {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'prepend').apply(this, nodes);
            }
            this._prependNodes(this._importNodes(nodes));
            this.requestUpdate();
        }

        /**
         * @inheritdoc
         */
        appendChild<T extends Node>(node: T): T {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'appendChild').call(this, node) as T;
            }
            this._appendNodes(this._importNodes([node]));
            this.requestUpdate();
            return node;
        }

        /**
         * @inheritdoc
         */
        insertBefore<T extends Node>(node: T, referenceNode: Node | null): T {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'insertBefore').call(this, node, referenceNode) as T;
            }

            this._insertNodesBefore(this._importNodes([node]), referenceNode);
            this.requestUpdate();
            return node;
        }

        /**
         * @inheritdoc
         */
        replaceChild<T extends Node>(node: Node, referenceNode: T): T {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'replaceChild').call(this, node, referenceNode) as T;
            }

            this._replaceNodes(this._importNodes([node]), referenceNode);
            this._releaseNode(referenceNode);
            this.requestUpdate();
            return referenceNode;
        }

        /**
         * @inheritdoc
         */
        removeChild<T extends Node>(node: T): T {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'removeChild').call(this, node) as T;
            }

            this._removeNodes([node]);
            this._releaseNode(node);
            this.requestUpdate();
            return node;
        }

        /**
         * @inheritdoc
         */
        insertAdjacentElement(where: InsertPosition, node: Element): Element | null {
            if (!this.isConnected || this.rendering) {
                return Reflect.get(ctor.prototype, 'insertAdjacentElement').call(this, where, node);
            }

            switch (where) {
                case 'afterbegin':
                    this._prependNodes(this._importNodes([node]));
                    this.requestUpdate();
                    return node;
                case 'beforeend':
                    this._appendNodes(this._importNodes([node]));
                    this.requestUpdate();
                    return node;
                default:
                    return Reflect.get(ctor.prototype, 'insertAdjacentElement', this).call(this, where, node);
            }
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
