/**
 * The plain Custom Element mixin.
 */
export interface CustomElementMixin {
    /**
     * The tag name used for element definition.
     */
    readonly is: string;

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
     * @param attrName The name of the updated attribute.
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
}

/**
 * The plain Custom Element interface.
 */
export type CustomElement<T extends HTMLElement = HTMLElement> = T & CustomElementMixin;

/**
 * The plain Custom Element constructor.
 */
export interface CustomElementConstructor<T extends HTMLElement = HTMLElement> {
    /**
     * An array containing the names of the attributes to observe.
     */
    readonly observedAttributes?: string[];

    new (): T & CustomElementMixin;
    prototype: T & CustomElementMixin;
}
