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
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (CE_SYMBOL in node) {
                                (node as unknown as CustomElement).connectedCallback();
                            }

                            (node as Element).querySelectorAll('[\\:ce-polyfill]').forEach((child) => {
                                (child as unknown as CustomElement).connectedCallback();
                            });
                        }
                    }
                }
                if (mutation.removedNodes) {
                    for (let i = 0, len = mutation.removedNodes.length; i < len; i++) {
                        const node = mutation.removedNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (CE_SYMBOL in node) {
                                (node as unknown as CustomElement).disconnectedCallback();
                            }

                            (node as Element).querySelectorAll('[\\:ce-polyfill]').forEach((child) => {
                                (child as unknown as CustomElement).disconnectedCallback();
                            });
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
            element.setAttribute(':ce-polyfill', '');

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

    const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
    const polyfillUpgrade = (customElements.upgrade = function (root: Element, nested = false, filter?: NodeFilter) {
        if (!nested) {
            upgrade(root);
        }

        upgradeBlock: if (isElement(root)) {
            if (CE_SYMBOL in root) {
                // already upgraded
                break upgradeBlock;
            }

            const is = root.getAttribute('is');
            if (!is) {
                break upgradeBlock;
            }

            const constructor = customElements.get(is) as CustomElementConstructor;
            if (!constructor) {
                break upgradeBlock;
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

            const upgradedNode = Reflect.construct(constructor, [root], constructor) as CustomElement;
            for (let i = 0, len = attributes.length; i < len; i++) {
                const { name, value } = attributes[i];
                if (upgradedNode.getAttribute(name) === value) {
                    upgradedNode.attributeChangedCallback(name, null, value);
                } else {
                    upgradedNode.setAttribute(name, value);
                }
            }
            if (upgradedNode.isConnected) {
                upgradedNode.connectedCallback();
            }
        }

        if (!nested) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter);
            let node = walker.nextNode() as Element | null;
            while (node) {
                polyfillUpgrade(node, true);
                node = walker.nextNode() as Element | null;
            }
        }
    });

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
        polyfillUpgrade(document.documentElement, false, (node: Node) =>
            isElement(node) &&
            node.tagName?.toLowerCase() === options.extends &&
            node.getAttribute('is')?.toLowerCase() === name
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP
        );
    };
}

/**
 * Check if the browser supports Customized built-in elements.
 * @returns True if the browser supports Customized built-in elements.
 */
function checkBuiltin() {
    const name = 'builtin-br';
    let Constructor = customElements.get(name);
    if (!Constructor) {
        Constructor = class extends HTMLBRElement {};
        customElements.define(name, Constructor, { extends: 'br' });
    }

    return document.createElement('br', { is: name }) instanceof Constructor;
}

if (isBrowser && !checkBuiltin()) {
    polyfillBuiltin();
}
