import { type Constructor } from './helpers';

/**
 * The plain Custom Element interface.
 */
export type CustomElement<T extends HTMLElement = HTMLElement> = T & {
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
     * @param attributeName The name of the updated attribute.
     * @param oldValue The previous value of the attribute.
     * @param newValue The new value for the attribute (null if removed).
     */
    attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
}

/**
 * The plain Custom Element constructor.
 */
export type CustomElementConstructor<T extends CustomElement = CustomElement> = Constructor<T> & {
    /**
     * An array containing the names of the attributes to observe.
     */
    readonly observedAttributes?: string[];
}

export type CustomElementRegistryMap = Record<string, CustomElementConstructor>;
