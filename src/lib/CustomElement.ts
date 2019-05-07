/**
 * The interface of Custom Element, as described by the W3C.
 * @see {@link https://w3c.github.io/webcomponents/spec/custom/} W3C specification.
 */
export type CustomElement = HTMLElement & {
    /**
     * The Custom Element constructor.
     *
     * @param node Instantiate the element using the given node instead of creating a new one.
     * @param properties A set of initial properties for the element.
     */
    new(node?: HTMLElement, properties?: { [key: string]: any; }): CustomElement;
    new(properties?: { [key: string]: any; }): CustomElement;

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
    render(): void;
};
