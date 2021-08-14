import type { Constructor } from './types';
import { window } from './window';
import { connect, defineProperty, HTMLElementConstructor, document } from './helpers';
import { isComponent, isComponentConstructor, isConstructed } from './Component';
import { defineProperties } from './property';
import { defineListeners } from './events';

/**
 * The native custom elements registry.
 */
const nativeCustomElements = window.customElements;

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
 * The plain Custom Element interface.
 */
export type CustomElement<T extends HTMLElement> = T & {
    is: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: null | string, newValue: null | string): void;
}

/**
 * The plain Custom Element constructor.
 */
export type CustomElementConstructor<T extends HTMLElement> = Constructor<CustomElement<T>> & {
    readonly observedAttributes?: string[];
}

/**
 * Check if the function is a Custom Element constructor.
 * @param constructor The function to check.
 */
export const isCustomElementConstructor = <T extends HTMLElement = HTMLElement>(constructor: Function): constructor is CustomElementConstructor<T> => constructor.prototype instanceof HTMLElementConstructor;

/**
 * The CustomElementRegistry interface provides methods for registering custom elements and querying registered elements.
 */
export class CustomElementRegistry {
    /**
     * Support native registry.
     */
    readonly native: boolean = !!nativeCustomElements;

    /**
     * A global registry.
     */
    readonly registry: {
        [key: string]: CustomElementConstructor<HTMLElement>;
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
        [key: string]: Array<(value?: unknown) => void>;
    } = {};

    /**
     * Get the Custom Element definition for a tag.
     *
     * @param name The name of the tag.
     * @return The definition for the given tag.
     */
    get<T extends HTMLElement = HTMLElement>(name: string): CustomElementConstructor<T> | undefined {
        let constructor = this.registry[name] as CustomElementConstructor<T>;
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
    define<T extends HTMLElement = HTMLElement>(name: string, constructor: CustomElementConstructor<T> & { shim?: boolean }, options: ElementDefinitionOptions = {}) {
        if (!assertValidateCustomElementName(name)) {
            throw new SyntaxError('The provided name must be a valid Custom Element name');
        }

        if (typeof (constructor as unknown) !== 'function') {
            throw new TypeError('The referenced constructor must be a constructor');
        }

        if (this.registry[name]) {
            throw new Error('The registry already contains an entry with the same name');
        }

        if (isComponentConstructor(constructor)) {
            defineProperties(constructor.prototype);
            defineListeners(constructor.prototype);
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

        const tagName = (options.extends || name).toLowerCase();
        this.registry[name] = constructor;
        this.tagNames[name] = tagName;

        if (nativeCustomElements) {
            const shouldShim = constructor.shim;
            if (tagName !== name) {
                constructor.shim = true;
                options = {
                    get extends() {
                        constructor.shim = shouldShim;
                        return tagName;
                    },
                };
            }
            nativeCustomElements.define(name, constructor, options);
        } else {
            const queue = this.queue;
            if (document.body) {
                this.upgrade(document.body);
            }
            const elementQueue = queue[name];
            if (elementQueue) {
                for (let i = 0, len = elementQueue.length; i < len; i++) {
                    elementQueue[i](constructor);
                }
            }
        }
    }

    /**
     * It returns a Promise that resolves when the named element is defined.
     * @param name The Custom Element name.
     * @return A Promise that resolves when the named element is defined.
     */
    whenDefined<T extends HTMLElement = HTMLElement>(name: string): Promise<CustomElementConstructor<T>> {
        if (nativeCustomElements) {
            return nativeCustomElements
                .whenDefined(name)
                // not all browsers resolve the constructor class
                .then(() => nativeCustomElements.get(name));
        }
        if (this.registry[name]) {
            return Promise.resolve(this.registry[name] as CustomElementConstructor<T>);
        }
        const queue = this.queue;
        const whenDefinedPromise = new Promise((resolve) => {
            queue[name] = queue[name] || [];
            queue[name].push(resolve);
        });

        return whenDefinedPromise as Promise<CustomElementConstructor<T>>;
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
            if (isConstructed(root)) {
                root.forceUpdate();
            }
            return;
        }

        if (isComponentConstructor(constructor)) {
            const attributes: { name: string; value: string }[] = [];
            const observed = constructor.observedAttributes || [];
            for (let i = 0, len = root.attributes.length; i < len; i++) {
                const attr = root.attributes[i];
                if (observed.indexOf(attr.name) !== -1) {
                    attributes.push({
                        name: attr.name,
                        value: attr.value,
                    });
                }
            }
            const element = constructor.upgrade(root);
            for (let i = 0, len = attributes.length; i < len; i++) {
                const { name, value } = attributes[i];
                if (element.getAttribute(name) === value) {
                    element.attributeChangedCallback(name, null, value);
                } else {
                    element.setAttribute(name, value);
                }
            }
            if (element.isConnected) {
                connect(element);
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
