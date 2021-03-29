import type { ClassFieldObserver, ClassFieldDescriptor } from './property';
import type { DelegatedEventCallback, DelegatedEventDescriptor } from './events';
import type { IterableNodeList } from './NodeList';
import type { Template } from './Template';
import { createSymbolKey } from './symbols';

/**
 * A symbol which identify components.
 */
export const COMPONENT_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * A symbol which identify constructed components (properties can be assigned).
 */
export const CONSTRUCTED_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Check if a node is a component.
 * @param node The node to check.
 */
export const isComponent = (node: any): node is ComponentInterface<HTMLElement> => !!node[COMPONENT_SYMBOL];

/**
 * Check if a node is a constructed component.
 * @param node The node to check.
 */
export const isConstructed = (node: any): node is ComponentInterface<HTMLElement> => !!node[CONSTRUCTED_SYMBOL];

/**
 * Check if a constructor is a component constructor.
 * @param constructor The constructor to check.
 */
export const isComponentConstructor = (constructor: Function): constructor is ComponentConstructorInterface<HTMLElement> => !!constructor.prototype[COMPONENT_SYMBOL];

export type ComponentInterface<T extends HTMLElement> = T & {
    /**
     * The defined component name.
     */
    readonly is: string;

    /**
     * Identify components.
     */
    [COMPONENT_SYMBOL]: boolean;

    /**
     * Identify constructed components.
     */
    [CONSTRUCTED_SYMBOL]: boolean;

    /**
     * A list of slot nodes.
     */
    slotChildNodes: IterableNodeList;

    /**
     * A list of CSSStyleSheet to apply to the component.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * The component constructor.
     */
    constructor: ComponentConstructorInterface<T>;

    /**
     * Initialize component properties.
     *
     * @param properties A set of initial properties for the element.
     */
    initialize(properties?: { [key: string]: unknown }): void;

    /**
     * Invoked each time the Custom Element is appended into a document-connected element.
     * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     */
    connectedCallback(): void;

    /**
     * Invoked each time the Custom Element is disconnected from the document's DOM.
     */
    disconnectedCallback(): void;

    /**
     * Invoked each time one of the Custom Element's attributes is added, removed, or changed.
     *
     * @param attributeName The name of the updated attribute.
     * @param oldValue The previous value of the attribute.
     * @param newValue The new value for the attribute (null if removed).
     */
    attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: null | string): void;

    /**
     * Invoked each time one of the Custom Element's properties is added, removed, or changed.
     *
     * @param propertyName The name of the changed property.
     * @param oldValue The previous value of the property.
     * @param newValue The new value for the property (undefined if removed).
     */
    propertyChangedCallback(propertyName: string, oldValue: any, newValue: any): void;

    /**
     * Invoke the Custom Element's rendering.
     */
    render(): Template;

    /**
     * Force an element to re-render.
     */
    forceUpdate(): void;

    /**
     * Observe a Component Property.
     *
     * @param propertyName The name of the Property to observe.
     * @param callback The callback function.
     */
    observe(propertyName: string, callback: ClassFieldObserver): void;

    /**
     * Unobserve a Component Property.
     * @memberof PropertiesMixin
     *
     * @param propertyName The name of the Property to unobserve.
     * @param callback The callback function to remove.
     */
    unobserve(propertyName: string, callback: ClassFieldObserver): void;

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
    dispatchEvent(event: string, detail?: unknown, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;

    /**
     * Dispatch an async custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchAsyncEvent(event: Event): Promise<unknown[]>; /* eslint-disable-line no-dupe-class-members */
    dispatchAsyncEvent(event: string, detail?: unknown, bubbles?: boolean, cancelable?: boolean, composed?: boolean): Promise<unknown[]>;

    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(event: string, selector: string | null, callback: DelegatedEventCallback): void;

    /**
     * Remove an Event delegation.
     *
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(event?: string, selector?: string | null, callback?: DelegatedEventCallback): void;

    /**
     * Should emulate life cycle for the node.
     */
    emulateLifeCycle(): void;
}

/**
 * The basic DNA Component interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export type ComponentConstructorInterface<T extends HTMLElement> = {
    /**
     * An array containing the names of the attributes to observe.
     */
    readonly observedAttributes: string[];

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
        [key: string]: DelegatedEventCallback | DelegatedEventDescriptor;
    };

    /**
     * Should skip native constructors.
     */
    readonly shim?: boolean;

    /**
     * The DNA Custom Element constructor.
     *
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    new(node?: HTMLElement, properties?: { [key: string]: unknown }): ComponentInterface<T>;
    new(properties?: { [key: string]: unknown }): ComponentInterface<T>;
    new(): ComponentInterface<T>;
    prototype: ComponentInterface<T>;
};
