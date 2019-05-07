import { CustomElement } from './CustomElement';

/**
 * Describe a Custom Element definition.
 */
export type Definition = {
    /**
     * The name of the Custom Element tag.
     */
    name: string;
    /**
     * The Custom Element constructor.
     */
    constructor: CustomElement;
    /**
     * The name of the tag to extend.
     */
    extends?: string;
}

/**
 * A global Custom Elements registry.
 */
const REGISTRY: {
    [key: string]: Definition;
} = {};

/**
 * Check if a Custom Element tag is registered.
 *
 * @param name The name of the tag to check.
 */
export function has(name: string): boolean {
    return name in REGISTRY;
}

/**
 * Get the Custom Element definition for a tag.
 *
 * @param name The name of the tag.
 * @return The definition for the given tag.
 */
export function get(name: string): Definition {
    return REGISTRY[name];
}

/**
 * Get a list of definitions in the registry.
 * @return An array of definitions.
 */
export function entries(): Definition[] {
    let result = [];
    for (let key in REGISTRY) {
        result.push(REGISTRY[key]);
    }
    return result;
}

/**
 * Define a new Custom Element.
 *
 * @param name The tag name for the element.
 * @param constructor The Custom Element constructor.
 * @param options A set of definition options, like `extends` for native tag extension.
 */
export function define(name: string, constructor: CustomElement, options: { extends?: string; } = {}) {
    name = name.toLowerCase();

    Object.defineProperty(constructor.prototype, 'is', {
        writable: false,
        configurable: false,
        value: name,
    });
    REGISTRY[name] = {
        name,
        constructor,
        extends: options.extends,
    };
}
