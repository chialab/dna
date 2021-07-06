import type { Constructor } from './types';
/**
 * The plain Custom Element interface.
 */
export declare type CustomElement<T extends HTMLElement> = T & {
    is: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
};
/**
 * The plain Custom Element constructor.
 */
export declare type CustomElementConstructor<T extends HTMLElement> = Constructor<CustomElement<T>> & {
    readonly observedAttributes?: string[];
};
/**
 * Check if the function is a Custom Element constructor.
 * @param constructor The function to check.
 */
export declare const isCustomElementConstructor: (constructor: Function) => constructor is CustomElementConstructor<HTMLElement>;
/**
 * The CustomElementRegistry interface provides methods for registering custom elements and querying registered elements.
 */
export declare class CustomElementRegistry {
    /**
     * Support native registry.
     */
    readonly native: boolean;
    /**
     * A global registry.
     */
    readonly registry: {
        [key: string]: CustomElementConstructor<HTMLElement>;
    };
    /**
     * A map of tag names.
     */
    readonly tagNames: {
        [key: string]: string;
    };
    /**
     * Collect "whenDefined" promises.
     */
    readonly queue: {
        [key: string]: Array<(value?: unknown) => void>;
    };
    /**
     * Get the Custom Element definition for a tag.
     *
     * @param name The name of the tag.
     * @return The definition for the given tag.
     */
    get(name: string): CustomElementConstructor<HTMLElement> | undefined;
    /**
     * Define a new Custom Element.
     *
     * @param name The tag name for the element.
     * @param constructor The Custom Element constructor.
     * @param options A set of definition options, like `extends` for native tag extension.
     */
    define(name: string, constructor: CustomElementConstructor<HTMLElement> & {
        shim?: boolean;
    }, options?: ElementDefinitionOptions): void;
    /**
     * It returns a Promise that resolves when the named element is defined.
     * @param name The Custom Element name.
     * @return A Promise that resolves when the named element is defined.
     */
    whenDefined(name: string): Promise<CustomElementConstructor<HTMLElement>>;
    /**
     * It upgrades all custom elements in a subtree even before they are connected to the main document.
     * @param root A Node instance with descendant elements that are to be upgraded.
     */
    upgrade(root: HTMLElement): void;
}
/**
 * The global DNA registry instance.
 */
export declare const customElements: CustomElementRegistry;
