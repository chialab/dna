import type { DelegatedEventCallback, ListenerConfig } from './events';
import type { Template as JSXTemplate } from './JSX';
import type { PropertyConfig, PropertyObserver } from './property';
import type { Realm } from './Realm';

export declare namespace HTML {
    export class Element extends globalThis.HTMLElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Anchor extends globalThis.HTMLAnchorElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLAnchorElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Area extends globalThis.HTMLAreaElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLAreaElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Audio extends globalThis.HTMLAudioElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLAudioElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Base extends globalThis.HTMLBaseElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLBaseElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Quote extends globalThis.HTMLQuoteElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLQuoteElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Body extends globalThis.HTMLBodyElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLBodyElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class BR extends globalThis.HTMLBRElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLBRElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Button extends globalThis.HTMLButtonElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLButtonElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Canvas extends globalThis.HTMLCanvasElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLCanvasElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class TableCaption extends globalThis.HTMLTableCaptionElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableCaptionElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class TableCol extends globalThis.HTMLTableColElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableColElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Data extends globalThis.HTMLDataElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDataElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class DataList extends globalThis.HTMLDataListElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDataListElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Mod extends globalThis.HTMLModElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLModElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Details extends globalThis.HTMLDetailsElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDetailsElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Dialog extends globalThis.HTMLDialogElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDialogElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Directory extends globalThis.HTMLDirectoryElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDirectoryElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Div extends globalThis.HTMLDivElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDivElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class DList extends globalThis.HTMLDListElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDListElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Embed extends globalThis.HTMLEmbedElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLEmbedElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class FieldSet extends globalThis.HTMLFieldSetElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFieldSetElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Font extends globalThis.HTMLFontElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFontElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Form extends globalThis.HTMLFormElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFormElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Frame extends globalThis.HTMLFrameElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFrameElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class FrameSet extends globalThis.HTMLFrameSetElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFrameSetElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Heading extends globalThis.HTMLHeadingElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLHeadingElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Head extends globalThis.HTMLHeadElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLHeadElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class HR extends globalThis.HTMLHRElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLHRElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class IFrame extends globalThis.HTMLIFrameElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLIFrameElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Image extends globalThis.HTMLImageElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLImageElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Input extends globalThis.HTMLInputElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLInputElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Label extends globalThis.HTMLLabelElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLabelElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Legend extends globalThis.HTMLLegendElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLegendElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class LI extends globalThis.HTMLLIElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLIElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Link extends globalThis.HTMLLinkElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLinkElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    // biome-ignore lint/suspicious/noShadowRestrictedNames: For consistency with other elements.
    export class Map extends globalThis.HTMLMapElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMapElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Marquee extends globalThis.HTMLMarqueeElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMarqueeElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Menu extends globalThis.HTMLMenuElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMenuElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Meta extends globalThis.HTMLMetaElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMetaElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Meter extends globalThis.HTMLMeterElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMeterElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    // biome-ignore lint/suspicious/noShadowRestrictedNames: For consistency with other elements.
    export class Object extends globalThis.HTMLObjectElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLObjectElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class OList extends globalThis.HTMLOListElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOListElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class OptGroup extends globalThis.HTMLOptGroupElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOptGroupElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Option extends globalThis.HTMLOptionElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOptionElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Output extends globalThis.HTMLOutputElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOutputElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Paragraph extends globalThis.HTMLParagraphElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLParagraphElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Param extends globalThis.HTMLParamElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLParamElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Picture extends globalThis.HTMLPictureElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLPictureElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Pre extends globalThis.HTMLPreElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLPreElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Progress extends globalThis.HTMLProgressElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLProgressElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Script extends globalThis.HTMLScriptElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLScriptElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Select extends globalThis.HTMLSelectElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSelectElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Slot extends globalThis.HTMLSlotElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSlotElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Source extends globalThis.HTMLSourceElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSourceElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Span extends globalThis.HTMLSpanElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSpanElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Style extends globalThis.HTMLStyleElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLStyleElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Table extends globalThis.HTMLTableElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class TableSection extends globalThis.HTMLTableSectionElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableSectionElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class TableCell extends globalThis.HTMLTableCellElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableCellElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Template extends globalThis.HTMLTemplateElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTemplateElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class TextArea extends globalThis.HTMLTextAreaElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTextAreaElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Time extends globalThis.HTMLTimeElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTimeElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Title extends globalThis.HTMLTitleElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTitleElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class TableRow extends globalThis.HTMLTableRowElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableRowElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Track extends globalThis.HTMLTrackElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTrackElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class UList extends globalThis.HTMLUListElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLUListElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
    export class Video extends globalThis.HTMLVideoElement {
        /**
         * The tag name of the extended builtin element.
         */
        static readonly tagName?: string;

        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes?: string[];

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
         * The defined component name.
         * For autonomous custom elements, this is the tag name.
         */
        readonly is: string;

        /**
         * A list of slot nodes.
         */
        readonly slotChildNodes: Node[];

        /**
         * The realm instance of the component.
         */
        readonly realm: Realm;

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLVideoElement);

        /**
         * Get slotted nodes by slot name.
         * @param name The name of the slot.
         * @returns A list of nodes.
         */
        childNodesBySlot(name?: string | null): Node[];

        /**
         * The callback for initialized components.
         * It runs once when the component is created, at the end of the constructor.
         */
        initialize(): void;

        /**
         * Invoked each time the element is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback(): void;

        /**
         * Invoked each time the element is disconnected from the document's DOM.
         */
        disconnectedCallback(): void;

        /**
         * Invoked each time one of the elements's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         * @param namespace Attribute namespace.
         */
        attributeChangedCallback(
            attrName: string,
            oldValue: null | string,
            newValue: null | string,
            namespace?: null | string
        ): void;

        /**
         * Invoked each time one of a Component's state property is setted, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        stateChangedCallback<P extends keyof this>(
            propertyName: P,
            oldValue: this[P] | undefined,
            newValue: this[P]
        ): void;

        /**
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

        /**
         * Invoked each time the component child list is changed.
         */
        childListChangedCallback(): void;

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
        render(): JSXTemplate | undefined;

        /**
         * Check if the component should update.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         * @returns True if the component should update.
         */
        shouldUpdate<P extends keyof this>(propertyName: P, oldValue: this[P] | undefined, newValue: this[P]): boolean;

        /**
         * Request an element to re-render.
         *
         * @returns True if a re-render has been triggered.
         */
        requestUpdate(): boolean;

        /**
         * Force an element to re-render.
         */
        forceUpdate(): void;

        /**
         * Start collecting updates.
         */
        collectUpdatesStart(): void;

        /**
         * Stop collecting updates and run a single re-render, if needed.
         * @returns True if a re-render has been triggered.
         */
        collectUpdatesEnd(): boolean;

        /**
         * Assign properties to the component.
         * It runs a single re-render after the assignment.
         * @param props The properties to assign.
         * @returns The component instance.
         */
        assign(props: object): this;

        /**
         * Generate a unique ID for the component instance.
         * @param suffixex A list of suffixes to append to the generated ID.
         * @return A unique identifier string.
         */
        getUniqueId(...suffixex: string[]): string;
    }
}
