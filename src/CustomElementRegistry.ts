import { window } from './window';
import { isComponent, isComponentConstructor } from './Interfaces';
import { defineProperty } from './helpers';
import { defineProperties } from './property';
import { defineListeners } from './events';

/**
 * The native custom elements registry.
 */
const nativeCustomElements = window.customElements;

/**
 * The current document instance.
 */
const document = window.document;

/**
 * Check the validity of a Custom Element name.
 * @param name The name to validate.
 */
const assertValidateCustomElementName = (name: string): boolean => (
    !!name                     // missing element name
    && name.indexOf('-') >= 1  // custom element names must contain (and must not start with) a hyphen
    && /[a-z\-\d]/.test(name)  // custom element names can contain lowercase characters, digits and hyphens
    && /^[^\d]/i.test(name)    // custom element names must not start with a digit
);

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
    get(name: string): typeof HTMLElement | undefined {
        let constructor: typeof HTMLElement = this.registry[name];
        // the native custom elements get method is slow
        // assert valid names before calling it.
        if (!constructor && nativeCustomElements && assertValidateCustomElementName(name)) {
            constructor = nativeCustomElements.get(name);
        }
        return constructor;
    }

    /**
     * Define a new Custom Element.
     *
     * @param name The tag name for the element.
     * @param constructor The Custom Element constructor.
     * @param options A set of definition options, like `extends` for native tag extension.
     */
    define(name: string, constructor: typeof HTMLElement, options: ElementDefinitionOptions = {}) {
        if (!assertValidateCustomElementName(name)) {
            throw new SyntaxError('The provided name must be a valid Custom Element name');
        }

        if (typeof constructor !== 'function') {
            throw new TypeError('The referenced constructor must be a constructor');
        }

        if (this.registry[name]) {
            throw new Error('The registry already contains an entry with the same name');
        }

        if (isComponentConstructor(constructor)) {
            defineProperties(constructor);
            defineListeners(constructor);
        }

        try {
            defineProperty(constructor.prototype, 'is', {
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
            nativeCustomElements.define(name, constructor, options);
        } else {
            const queue = this.queue;
            if (document.body) {
                this.upgrade(document.body);
            }
            let elementQueue = queue[name];
            if (elementQueue) {
                for (let i = 0, len = elementQueue.length; i < len; i++) {
                    elementQueue[i]();
                }
            }
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
            let attributes: { name: string, value: string }[] = [];
            let observed = constructor.observedAttributes || [];
            for (let i = 0, len = root.attributes.length; i < len; i++) {
                let attr = root.attributes[i];
                if (observed.indexOf(attr.name) !== -1) {
                    attributes.push({
                        name: attr.name,
                        value: attr.value,
                    });
                }
            }
            let element = new constructor(root);
            for (let i = 0, len = attributes.length; i < len; i++) {
                let { name, value } = attributes[i];
                if (element.getAttribute(name) === value) {
                    element.attributeChangedCallback(name, null, value);
                }
            }
            element.forceUpdate();
        }
    }
}

/**
 * The global DNA registry instance.
 */
export const customElements = new CustomElementRegistry();

document.addEventListener('DOMContentLoaded', () => {
    customElements.upgrade(document.body);
});
