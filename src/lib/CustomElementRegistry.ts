import { window } from './window';
import { IComponent } from './IComponent';

/**
 * The native custom elements registry.
 */
const customElements = window.customElements;

/**
 * Check the validity of a Custom Element name.
 * @param name The name to validate.
 */
const assertValidateCustomElementName = (name: string): boolean => {
    if (
        !name                       // missing element name
        || /[^a-z\-\d]/.test(name)  // custom element names can contain lowercase characters, digits and hyphens
        || name.indexOf('-') < 1    // custom element names must contain (and must not start with) a hyphen
        || /^\d/i.test(name)        // custom element names must not start with a digit
    ) {
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
        [key: string]: typeof IComponent;
    } = {};

    /**
     * A map of tag names.
     */
    readonly tagNames: {
        [key: string]: string;
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
    get(name: string): typeof IComponent {
        return this.registry[name];
    }

    /**
     * Define a new Custom Element.
     *
     * @param name The tag name for the element.
     * @param constructor The Custom Element constructor.
     * @param options A set of definition options, like `extends` for native tag extension.
     */
    define(name: string, constructor: typeof IComponent, options: ElementDefinitionOptions = {}) {
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
        } catch {
            throw new Error('The registry already contains an entry with the constructor (or is otherwise already defined)');
        }

        let tagName = options.extends || name;
        this.registry[name] = constructor;
        this.tagNames[name] = tagName.toLowerCase();

        if (customElements) {
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
        if (customElements) {
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
        if (customElements && 'upgrade' in customElements) {
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
