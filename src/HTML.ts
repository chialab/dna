import { type Realm } from '@chialab/quantum';
import { type DelegatedEventCallback, type ListenerConfig } from './events';
import { type Template as JSXTemplate } from './JSX';
import { type PropertyConfig, type PropertyObserver } from './property';

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
    }
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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
    }
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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
         * Invoked each time the component has been updated.
         */
        updatedCallback(): void;

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
    }
}
