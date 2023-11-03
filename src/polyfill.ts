import type { CustomElement, CustomElementConstructor } from './CustomElement';
import * as Elements from './Elements';
import { getPrototypeOf, hasOwnProperty, isBrowser, setPrototypeOf } from './helpers';

/**
 * Register a polyfill for Customized built-in elements.
 */
function polyfillBuiltin() {
    const tagNames: Record<string, string> = {};
    const CE_SYMBOL = Symbol();
    const nativeCreateElement = document.createElement.bind(document);
    const builtin = Object.values(Elements);
    const customElements = window.customElements;
    const define = customElements.define.bind(customElements);
    const upgrade = customElements.upgrade.bind(customElements);
    let childListObserver: MutationObserver;

    /**
     * Create a MutationObserver to observe childList changes.
     * @returns A MutationObserver instance.
     */
    const createChildListObserver = () => {
        childListObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    for (let i = 0, len = mutation.addedNodes.length; i < len; i++) {
                        const node = mutation.addedNodes[i];
                        if (CE_SYMBOL in node) {
                            (node as unknown as CustomElement).connectedCallback();
                        }
                    }
                }
                if (mutation.removedNodes) {
                    for (let i = 0, len = mutation.removedNodes.length; i < len; i++) {
                        const node = mutation.removedNodes[i];
                        if (CE_SYMBOL in node) {
                            (node as unknown as CustomElement).disconnectedCallback();
                        }
                    }
                }
            });
        });

        childListObserver.observe(document, {
            childList: true,
            subtree: true,
        });

        return childListObserver;
    };

    /**
     * Shim a Custom Element constructor.
     * @param constructor The Custom Element constructor.
     */
    const shimConstructor = (constructor: CustomElementConstructor & { __shim?: boolean }) => {
        if (!childListObserver) {
            createChildListObserver();
        }

        let CurrentConstructor = constructor;
        let ParentCostructor = getPrototypeOf(CurrentConstructor) as CustomElementConstructor;
        while (!builtin.includes(ParentCostructor)) {
            CurrentConstructor = ParentCostructor;
            if (hasOwnProperty.call(CurrentConstructor, '__shim')) {
                return;
            }
            ParentCostructor = getPrototypeOf(CurrentConstructor) as CustomElementConstructor;
        }

        if (hasOwnProperty.call(CurrentConstructor, '__shim')) {
            return;
        }

        const ShimConstructor = function ShimConstructor(this: CustomElement) {
            const name = this.is;
            if (!name) {
                throw new TypeError('Illegal constructor');
            }

            const ActualConstructor = this.constructor as CustomElementConstructor;
            const tag = tagNames[name];
            if (!tag) {
                return Reflect.construct(ParentCostructor, [], ActualConstructor);
            }

            const element = nativeCreateElement(tag) as CustomElement;
            setPrototypeOf(element, ActualConstructor.prototype);

            const observedAttributes = ActualConstructor.observedAttributes || [];
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    const attributeName = mutation.attributeName;
                    if (!attributeName) {
                        return;
                    }
                    if (!observedAttributes.includes(attributeName)) {
                        return;
                    }

                    element.attributeChangedCallback(
                        attributeName,
                        mutation.oldValue,
                        element.getAttribute(attributeName),
                        mutation.attributeNamespace
                    );
                });
            });
            observer.observe(element, {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: observedAttributes,
            });
            (element as CustomElement & { [CE_SYMBOL]: true })[CE_SYMBOL] = true;

            return element;
        };
        setPrototypeOf(ShimConstructor, ParentCostructor);
        (ShimConstructor as Function).apply = Function.apply;
        (ShimConstructor as Function).call = Function.call;
        ShimConstructor.prototype = ParentCostructor.prototype;

        setPrototypeOf(CurrentConstructor, ShimConstructor);
        setPrototypeOf(CurrentConstructor.prototype, ShimConstructor.prototype);
        CurrentConstructor.__shim = true;
    };

    customElements.upgrade = function (root: HTMLElement) {
        const nodes = root.children;
        for (let i = 0, len = nodes.length; i < len; i++) {
            const node = nodes[i] as HTMLElement;
            if (node) {
                customElements.upgrade(node);
            }
        }

        const is = root.getAttribute('is');
        if (!is) {
            upgrade(root);
            return;
        }

        const constructor = customElements.get(is) as CustomElementConstructor;
        if (!constructor) {
            return;
        }

        const attributes: { name: string; value: string }[] = [];
        const observed = (constructor as CustomElementConstructor).observedAttributes || [];
        for (let i = 0, len = root.attributes.length; i < len; i++) {
            const attr = root.attributes[i];
            if (observed.includes(attr.name)) {
                attributes.push({
                    name: attr.name,
                    value: attr.value,
                });
            }
        }

        root = Reflect.construct(constructor, [root], constructor);

        for (let i = 0, len = attributes.length; i < len; i++) {
            const { name, value } = attributes[i];
            if (root.getAttribute(name) === value) {
                (root as CustomElement).attributeChangedCallback(name, null, value);
            } else {
                root.setAttribute(name, value);
            }
        }
        if (root.isConnected) {
            (root as CustomElement).connectedCallback();
        }
    };

    customElements.define = function (
        name: string,
        constructor: CustomElementConstructor,
        options: ElementDefinitionOptions = {}
    ) {
        if (!options.extends) {
            return define.call(customElements, name, constructor, options);
        }

        tagNames[name] = options.extends;
        shimConstructor(constructor);
        define.call(customElements, name, constructor, options);
    };
}

/**
 * Check if the browser supports Customized built-in elements.
 * @returns True if the browser supports Customized built-in elements.
 */
function checkBuiltin() {
    const name = 'builtin-br';
    const Constructor = class extends HTMLBRElement {};
    customElements.define(name, Constructor, { extends: 'br' });

    return document.createElement('br', { is: name }) instanceof Constructor;
}

if (isBrowser && !checkBuiltin()) {
    polyfillBuiltin();
}
