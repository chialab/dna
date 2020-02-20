import { createSymbolKey } from './symbols';
import { ClassFieldObserver, ClassFieldDescriptor } from './property';
import { DelegatedEventCallback } from './listener';
import { Template } from './Template';

/**
 * A symbol which identify a DNA custom element.
 */
export const CE_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Check if a node is a DNA Custom Element instance.
 * @ignore
 * @param node The node to check.
 * @return The node is a Custom Element instance.
 */
export const isCustomElement = (node: any): node is CustomElement => node[CE_SYMBOL] === true;

/**
 * Check if the environment supports Custom Elements.
 * @ignore
 */
export const checkNativeSupport = () => typeof customElements !== 'undefined';

/**
 * The basic Custom Element interface.
 * It's a Custom Element, but with some extra useful method.
 * @see [W3C specification]{@link https://w3c.github.io/webcomponents/spec/custom/}.
 */
export type CustomElement<T extends HTMLElement = HTMLElement> = T & {
    /**
     * An unique symbol for DNA Custom elements.
     */
    readonly [CE_SYMBOL]: true;

    /**
     * The tag name used for Component definition.
     */
    readonly is: string | undefined;

    /**
     * A set of properties to define to the node.
     */
    readonly properties?: {
        [key: string]: ClassFieldDescriptor;
    };

    /**
     * A set of delegated events to bind to the node.
     */
    readonly listeners?: {
        [key: string]: DelegatedEventCallback;
    };

    /**
     * A set of delegated events to bind to the node.
     */
    readonly template?: HTMLTemplateElement;

    /**
     * A list of CSSStyleSheet to apply to the component.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * The DNA Custom Element constructor.
     *
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    new(node?: T, properties?: { [key: string]: any; }): CustomElement<T>;
    new(properties?: { [key: string]: any; }): CustomElement<T>;

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
    unobserve(propertyName: string, callback: ClassFieldObserver):void;

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
    dispatchEvent(event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;

    /**
     * Delegate an Event listener.
     *
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     */
    delegateEventListener(event: string, selector: string|null, callback: DelegatedEventCallback): void;

    /**
     * Remove an Event delegation.
     *
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(event?: string, selector?: string|null, callback?: DelegatedEventCallback): void;
}
