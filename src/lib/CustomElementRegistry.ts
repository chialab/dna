import { CustomElement } from './CustomElement';

/**
 * A regex for Custom Element.
 * @author mathiasbynens
 */
const VALIDATION_REGEX = /^[a-z](?:[-.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[-.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/; /* eslint-disable-line no-misleading-character-class */

/**
 * Check the validity of a Custom Element name.
 * @param name The name to validate.
 */
const assertValidateCustomElementName = (name: string): boolean => {
    if (!name || !name.match(VALIDATION_REGEX)) {
        throw new SyntaxError('The provided name must be a valid Custom Element name');
    }
    return true;
};

/**
 * The CustomElementRegistry interface provides methods for registering custom elements and querying registered elements.
 */
export class CustomElementRegistry {
    /**
     * A global registry.
     */
    readonly registry: {
        [key: string]: CustomElement;
    } = {};

    /**
     * Collect "whenDefined" promises.
     */
    private queue: {
        [key: string]: Array<(value?: unknown) => void>
    } = {};

    /**
     * Get the Custom Element definition for a tag.
     *
     * @param name The name of the tag.
     * @return The definition for the given tag.
     */
    get(name: string): CustomElement {
        return this.registry[name];
    }

    /**
     * Define a new Custom Element.
     *
     * @param name The tag name for the element.
     * @param constructor The Custom Element constructor.
     * @param options A set of definition options, like `extends` for native tag extension.
     */
    define(name: string, constructor: CustomElement, options: { extends?: string; } = {}) {
        assertValidateCustomElementName(name);

        if (typeof constructor !== 'function') {
            throw new TypeError('The referenced constructor must be a constructor');
        }

        if (this.registry[name]) {
            throw new Error('The registry already contains an entry with the same name');
        }

        try {
            Object.defineProperty(constructor.prototype, 'is', {
                writable: false,
                configurable: false,
                value: name,
            });
            if (options.extends) {
                Object.defineProperty(constructor, 'extends', {
                    writable: false,
                    configurable: false,
                    value: options.extends.toLowerCase(),
                });
            }
        } catch {
            throw new Error('The registry already contains an entry with the constructor (or is otherwise already defined)');
        }

        this.registry[name] = constructor;

        if (typeof customElements !== 'undefined') {
            return customElements.define(name, constructor, options);
        }

        const queue = this.queue;
        if (queue[name]) {
            queue[name].forEach((resolve) => resolve());
        }
    }

    /**
     * It returns a Promise that resolves when the named element is defined.
     * @param name The Custom Element name.
     * @return A Promise that resolves when the named element is defined.
     */
    whenDefined(name: string): Promise<void> {
        if (typeof customElements !== 'undefined') {
            return customElements.whenDefined(name);
        }
        if (this.registry[name]) {
            return Promise.resolve();
        }
        const queue = this.queue;
        const whenDefinedPromise = new Promise((resolve) => {
            queue[name] = queue[name] || [];
            queue[name].push(resolve);
        });

        return whenDefinedPromise as Promise<void>;
    }

    /**
     * It upgrades all custom elements in a subtree even before they are connected to the main document.
     * @param root A Node instance with descendant elements that are to be upgraded.
     */
    upgrade(root: HTMLElement) {
        if (typeof customElements !== 'undefined' && 'upgrade' in customElements) {
            return customElements.upgrade(root);
        }
        // iterate registry entries in order to retrieve all registered tags
        const registry = this.registry;
        for (let key in registry) {
            const constructor = registry[key];
            // find all nodes for the current Component configuration
            const nodes = root.querySelectorAll(`${key}, [is="${key}"]`);
            // iterate all nodes found
            for (let i = 0, len = nodes.length; i < len; i++) {
                const node = nodes[i];
                // check if already instantiated
                if (node instanceof constructor) {
                    continue;
                }
                new constructor(node as HTMLElement);
            }
        }
    }
}

/**
 * The global DNA registry instance.
 */
export const registry = new CustomElementRegistry();
