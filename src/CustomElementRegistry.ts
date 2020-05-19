import window from './window';
import { isComponent, isComponentConstructor } from './Interfaces';

/**
 * The native custom elements registry.
 */
const nativeCustomElements = window.customElements;

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
        [key: string]: typeof HTMLElement;
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
    readonly queue: {
        [key: string]: Array<(value?: unknown) => void>
    } = {};

    /**
     * Get the Custom Element definition for a tag.
     *
     * @param name The name of the tag.
     * @return The definition for the given tag.
     */
    get(name: string): typeof HTMLElement {
        return this.registry[name];
    }

    /**
     * Define a new Custom Element.
     *
     * @param name The tag name for the element.
     * @param constructor The Custom Element constructor.
     * @param options A set of definition options, like `extends` for native tag extension.
     */
    define(name: string, constructor: typeof HTMLElement, options: ElementDefinitionOptions = {}) {
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

        if (nativeCustomElements) {
            return nativeCustomElements.define(name, constructor, options);
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
        if (nativeCustomElements) {
            return nativeCustomElements.whenDefined(name);
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
        const is = (root.getAttribute('is') || root.tagName).toLowerCase();
        const constructor = this.get(is);
        // find all root children
        const nodes = root.children;
        // iterate all nodes found
        for (let i = 0, len = nodes.length; i < len; i++) {
            this.upgrade(nodes[i] as HTMLElement);
        }
        if (!constructor) {
            return;
        }
        if (nativeCustomElements && 'upgrade' in nativeCustomElements) {
            // native upgrade
            nativeCustomElements.upgrade(root);
        }
        // check if already instantiated
        if (isComponent(root)) {
            root.forceUpdate();
            return;
        }

        if (isComponentConstructor(constructor)) {
            new constructor(root).forceUpdate();
        }
    }
}

/**
 * The global DNA registry instance.
 */
export const customElements = new CustomElementRegistry();
