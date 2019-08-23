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
 * A global registry.
 */
export const REGISTRY: {
    [key: string]: Definition;
} = {};

/**
 * A regex for Custom Element.
 * @author mathiasbynens
 */
const VALIDATION_REGEX = /^[a-z](?:[-.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[-.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;

/**
 * Check the validity of a Custom Element name.
 * @param name The name to validate.
 */
export function assertValidateCustomElementName(name: string): boolean {
    if (!name || !name.match(VALIDATION_REGEX)) {
        throw new SyntaxError('The provided name is not a valid Custom Element name');
    }
    return true;
}

/**
 * Get the Custom Element definition for a tag.
 *
 * @param name The name of the tag.
 * @return The definition for the given tag.
 */
export function get(name: string): CustomElement {
    assertValidateCustomElementName(name);

    return REGISTRY[name] && REGISTRY[name].constructor || null;
}

/**
 * Collect "whenDefined" promises.
 */
const WHEN_DEFINED_COLLECTOR: {
    [key: string]: Array<(value?: unknown) => void>
} = {};

/**
 * It returns a Promise that resolves when the named element is defined.
 * @param name The Custom Element name.
 * @return A Promise that resolves when the named element is defined.
 */
export function whenDefined(name: string): Promise<void> {
    if (get(name)) {
        return Promise.resolve();
    }
    const whenDefinedPromise = new Promise((resolve) => {
        WHEN_DEFINED_COLLECTOR[name] = WHEN_DEFINED_COLLECTOR[name] || [];
        WHEN_DEFINED_COLLECTOR[name].push(resolve);
    });

    return whenDefinedPromise as Promise<void>;
}

/**
 * Define a new Custom Element.
 *
 * @param name The tag name for the element.
 * @param constructor The Custom Element constructor.
 * @param options A set of definition options, like `extends` for native tag extension.
 */
export function define(name: string, constructor: CustomElement, options: { extends?: string; } = {}) {
    assertValidateCustomElementName(name);

    if (typeof constructor !== 'function') {
        throw new TypeError('The referenced constructor is not a constructor');
    }

    if (get(name)) {
        throw new Error('The registry already contains an entry with the same name');
    }

    try {
        Object.defineProperty(constructor.prototype, 'is', {
            writable: false,
            configurable: false,
            value: name,
        });
    } catch {
        throw new Error('The registry already contains an entry with the constructor (or is otherwise already defined)');
    }

    REGISTRY[name] = {
        name,
        constructor,
        extends: options.extends && options.extends.toLowerCase(),
    };

    if (WHEN_DEFINED_COLLECTOR[name]) {
        WHEN_DEFINED_COLLECTOR[name].forEach((resolve) => resolve());
    }
}

/**
 * It upgrades all custom elements in a subtree even before they are connected to the main document.
 * @param root A Node instance with descendant elements that are to be upgraded.
 */
export function upgrade(root: HTMLElement) {
    let elements: CustomElement[] = [];
    // iterate registry entries in order to retrieve all registered tags
    for (let key in REGISTRY) {
        const { name, constructor } = REGISTRY[key];
        // find all nodes for the current Component configuration
        const nodes = root.querySelectorAll(`${name}, [is="${name}"]`);
        // iterate all nodes found
        nodes.forEach((node) => {
            // check if already instantiated
            if (!(node instanceof constructor)) {
                let elem = new constructor(node as HTMLElement);
                elements.push(elem);
            }
        });
    }

    return elements;
}
