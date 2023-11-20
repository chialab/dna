import { type Realm } from '@chialab/quantum';
import { type DelegatedEventCallback, type ListenerConfig } from './events';
import { type KeyedProperties, type Props, type Template } from './JSX';
import { type PropertyConfig, type PropertyObserver } from './property';

export declare namespace Builtins {
    export class HTMLElement extends globalThis.HTMLElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLAnchorElement extends globalThis.HTMLAnchorElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLAnchorElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLAreaElement extends globalThis.HTMLAreaElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLAreaElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLAudioElement extends globalThis.HTMLAudioElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLAudioElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLBaseElement extends globalThis.HTMLBaseElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLBaseElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLQuoteElement extends globalThis.HTMLQuoteElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLQuoteElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLBodyElement extends globalThis.HTMLBodyElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLBodyElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLBRElement extends globalThis.HTMLBRElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLBRElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLButtonElement extends globalThis.HTMLButtonElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLButtonElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLCanvasElement extends globalThis.HTMLCanvasElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLCanvasElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTableCaptionElement extends globalThis.HTMLTableCaptionElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableCaptionElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTableColElement extends globalThis.HTMLTableColElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableColElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDataElement extends globalThis.HTMLDataElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDataElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDataListElement extends globalThis.HTMLDataListElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDataListElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLModElement extends globalThis.HTMLModElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLModElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDetailsElement extends globalThis.HTMLDetailsElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDetailsElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDialogElement extends globalThis.HTMLDialogElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDialogElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDirectoryElement extends globalThis.HTMLDirectoryElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDirectoryElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDivElement extends globalThis.HTMLDivElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDivElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLDListElement extends globalThis.HTMLDListElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLDListElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLEmbedElement extends globalThis.HTMLEmbedElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLEmbedElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLFieldSetElement extends globalThis.HTMLFieldSetElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFieldSetElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLFontElement extends globalThis.HTMLFontElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFontElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLFormElement extends globalThis.HTMLFormElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFormElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLFrameElement extends globalThis.HTMLFrameElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFrameElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLFrameSetElement extends globalThis.HTMLFrameSetElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLFrameSetElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLHeadingElement extends globalThis.HTMLHeadingElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLHeadingElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLHeadElement extends globalThis.HTMLHeadElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLHeadElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLHRElement extends globalThis.HTMLHRElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLHRElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLIFrameElement extends globalThis.HTMLIFrameElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLIFrameElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLImageElement extends globalThis.HTMLImageElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLImageElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLInputElement extends globalThis.HTMLInputElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLInputElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLLabelElement extends globalThis.HTMLLabelElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLabelElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLLegendElement extends globalThis.HTMLLegendElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLegendElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLLIElement extends globalThis.HTMLLIElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLIElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLLinkElement extends globalThis.HTMLLinkElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLLinkElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLMapElement extends globalThis.HTMLMapElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMapElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLMarqueeElement extends globalThis.HTMLMarqueeElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMarqueeElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLMenuElement extends globalThis.HTMLMenuElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMenuElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLMetaElement extends globalThis.HTMLMetaElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMetaElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLMeterElement extends globalThis.HTMLMeterElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLMeterElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLObjectElement extends globalThis.HTMLObjectElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLObjectElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLOListElement extends globalThis.HTMLOListElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOListElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLOptGroupElement extends globalThis.HTMLOptGroupElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOptGroupElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLOptionElement extends globalThis.HTMLOptionElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOptionElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLOutputElement extends globalThis.HTMLOutputElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLOutputElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLParagraphElement extends globalThis.HTMLParagraphElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLParagraphElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLParamElement extends globalThis.HTMLParamElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLParamElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLPictureElement extends globalThis.HTMLPictureElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLPictureElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLPreElement extends globalThis.HTMLPreElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLPreElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLProgressElement extends globalThis.HTMLProgressElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLProgressElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLScriptElement extends globalThis.HTMLScriptElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLScriptElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLSelectElement extends globalThis.HTMLSelectElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSelectElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLSlotElement extends globalThis.HTMLSlotElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSlotElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLSourceElement extends globalThis.HTMLSourceElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSourceElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLSpanElement extends globalThis.HTMLSpanElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLSpanElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLStyleElement extends globalThis.HTMLStyleElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLStyleElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTableElement extends globalThis.HTMLTableElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTableSectionElement extends globalThis.HTMLTableSectionElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableSectionElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTableCellElement extends globalThis.HTMLTableCellElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableCellElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTemplateElement extends globalThis.HTMLTemplateElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTemplateElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTextAreaElement extends globalThis.HTMLTextAreaElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTextAreaElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTimeElement extends globalThis.HTMLTimeElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTimeElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTitleElement extends globalThis.HTMLTitleElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTitleElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTableRowElement extends globalThis.HTMLTableRowElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTableRowElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLTrackElement extends globalThis.HTMLTrackElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLTrackElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLUListElement extends globalThis.HTMLUListElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLUListElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
    export class HTMLVideoElement extends globalThis.HTMLVideoElement {
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
         * Type getter for JSX properties.
         */
        readonly __jsxProperties__: Props<this> & KeyedProperties;

        /**
         * The realm of the component.
         */
        readonly realm: Realm;

        /**
         * A flag to indicate if the component is collecting updates.
         */
        collectingUpdates: boolean;

        /**
         * A flag to indicate if the component has a scheduled update.
         */
        updateScheduled: boolean;

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
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        // We cannot infer component properties from the base class
        constructor(node?: HTMLVideoElement);

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
        dispatchAsyncEvent(
            event: string,
            detail?: CustomEventInit['detail'],
            bubbles?: boolean,
            cancelable?: boolean,
            composed?: boolean // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
}
