import type { CustomElement, CustomElementConstructor } from './CustomElement';
import * as Elements from './Elements';
import { getPrototypeOf, hasOwn, isBrowser, setPrototypeOf } from './helpers';

/**
 * Register a polyfill for Customized built-in elements.
 */
function polyfillBuiltin() {
    const tagNames: Record<string, string> = {};
    const CE_SYMBOL = Symbol();
    const CONNECTED_SYMBOL = Symbol();
    const nativeImportNode = document.importNode.bind(document);
    const nativeCreateElement = document.createElement.bind(document);
    const nativeCreateElementNS = document.createElementNS.bind(document);
    const builtin = Object.values(Elements);
    const customElements = window.customElements;
    const define = customElements.define.bind(customElements);
    const upgrade = customElements.upgrade.bind(customElements);
    const cloneNode = Node.prototype.cloneNode;
    const setInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    const filterBuiltinElement = (node: Node) =>
        isElement(node) && getIs(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    let childListObserver: MutationObserver;

    const handleMutation = (mutation: MutationRecord) => {
        if (mutation.addedNodes) {
            for (let i = 0, len = mutation.addedNodes.length; i < len; i++) {
                const node = mutation.addedNodes[i];
                if (isElement(node)) {
                    polyfillUpgrade(node as Element);

                    if (isCustomElement(node) && !isConnected(node)) {
                        connect(node);
                    }

                    node.querySelectorAll('[\\:ce-polyfill]').forEach((child) => {
                        if (isCustomElement(child) && !isConnected(child)) {
                            connect(child as CustomElement);
                        }
                    });
                }
            }
        }
        if (mutation.removedNodes) {
            for (let i = 0, len = mutation.removedNodes.length; i < len; i++) {
                const node = mutation.removedNodes[i];
                if (isElement(node)) {
                    if (isCustomElement(node) && isConnected(node)) {
                        disconnect(node);
                    }

                    node.querySelectorAll('[\\:ce-polyfill]').forEach((child) => {
                        if (isCustomElement(child) && isConnected(child)) {
                            disconnect(child as CustomElement);
                        }
                    });
                }
            }
        }

        if (mutation.attributeName) {
            const element = mutation.target as CustomElement;
            const observedAttributes = (element.constructor as CustomElementConstructor).observedAttributes || [];
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
        }
    };

    const isCustomElement = (node: Node): node is CustomElement => {
        return CE_SYMBOL in node;
    };

    const isConnected = (element: CustomElement) => {
        if (CONNECTED_SYMBOL in element) {
            return element[CONNECTED_SYMBOL] === true;
        }
        return false;
    };

    const connect = (
        element: CustomElement & {
            [CONNECTED_SYMBOL]?: boolean;
        }
    ) => {
        element[CONNECTED_SYMBOL] = true;
        element.connectedCallback();
    };

    const disconnect = (
        element: CustomElement & {
            [CONNECTED_SYMBOL]?: boolean;
        }
    ) => {
        element[CONNECTED_SYMBOL] = false;
        element.disconnectedCallback();
    };

    /**
     * Create a MutationObserver to observe childList changes.
     * @returns A MutationObserver instance.
     */
    const createChildListObserver = () => {
        childListObserver = new MutationObserver((mutations) => {
            mutations.forEach(handleMutation);
        });

        childListObserver.observe(document, {
            childList: true,
            subtree: true,
        });

        return childListObserver;
    };

    /**
     * Shim a Custom Element constructor.
     * @param ctr The Custom Element constructor.
     */
    const shimConstructor = (ctr: CustomElementConstructor & { __shim?: boolean }) => {
        if (!childListObserver) {
            createChildListObserver();
        }

        let currentConstructor = ctr;
        let parentCostructor = getPrototypeOf(currentConstructor) as CustomElementConstructor;
        while (!builtin.includes(parentCostructor)) {
            currentConstructor = parentCostructor;
            if (hasOwn.call(currentConstructor, '__shim')) {
                return;
            }
            parentCostructor = getPrototypeOf(currentConstructor) as CustomElementConstructor;
        }

        if (hasOwn.call(currentConstructor, '__shim')) {
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
                return Reflect.construct(parentCostructor, [], ActualConstructor);
            }

            const element = nativeCreateElement(tag) as CustomElement;
            setPrototypeOf(element, ActualConstructor.prototype);
            if (!element.hasAttribute('is')) {
                element.setAttribute('is', name);
            }
            element.setAttribute(':ce-polyfill', '');

            const observedAttributes = ActualConstructor.observedAttributes || [];
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(handleMutation);
            });
            observer.observe(element, {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: observedAttributes,
                childList: true,
                subtree: true,
            });
            (element as CustomElement & { [CE_SYMBOL]: true })[CE_SYMBOL] = true;

            return element;
        };
        setPrototypeOf(ShimConstructor, parentCostructor);
        ShimConstructor.apply = Function.apply;
        ShimConstructor.call = Function.call;
        ShimConstructor.prototype = parentCostructor.prototype;

        setPrototypeOf(currentConstructor, ShimConstructor);
        setPrototypeOf(currentConstructor.prototype, ShimConstructor.prototype);
        currentConstructor.__shim = true;
    };

    const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;

    const getIs = (node: Element): string | null => {
        if (node.hasAttribute('is')) {
            return node.getAttribute('is');
        }
        if ('is' in node) {
            if (node.tagName.toLowerCase() !== (node.is as string)?.toLowerCase()) {
                return node.is as string;
            }
        }
        return null;
    };

    const upgradeNodeIfNeeded = (node: Node): boolean => {
        if (!isElement(node) || isCustomElement(node)) {
            return false;
        }
        const is = getIs(node);
        if (!is) {
            return false;
        }
        const ctr = customElements.get(is) as CustomElementConstructor;
        if (!ctr) {
            return false;
        }

        const attributes: { name: string; value: string }[] = [];
        const observed = (ctr as CustomElementConstructor).observedAttributes || [];
        for (let i = 0, len = node.attributes.length; i < len; i++) {
            const attr = node.attributes[i];
            if (observed.includes(attr.name)) {
                attributes.push({
                    name: attr.name,
                    value: attr.value,
                });
            }
        }

        const upgradedNode = Reflect.construct(ctr, [node], ctr) as CustomElement;
        if (!upgradedNode.hasAttribute('is')) {
            upgradedNode.setAttribute('is', is);
        }
        upgradedNode.setAttribute(':ce-polyfill', '');
        for (let i = 0, len = attributes.length; i < len; i++) {
            const { name, value } = attributes[i];
            if (upgradedNode.getAttribute(name) === value) {
                upgradedNode.attributeChangedCallback(name, null, value);
            } else {
                upgradedNode.setAttribute(name, value);
            }
        }
        if (upgradedNode.isConnected && !isConnected(upgradedNode)) {
            connect(upgradedNode);
        }

        return true;
    };

    const polyfillUpgrade = (root: Node, nested = false, filter: NodeFilter = filterBuiltinElement) => {
        if (!nested) {
            upgrade(root);
        }

        upgradeNodeIfNeeded(root);

        if (!nested) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter);
            let node = walker.nextNode() as Element | null;
            while (node) {
                polyfillUpgrade(node, true);
                node = walker.nextNode() as Element | null;
            }
        }
    };

    customElements.upgrade = polyfillUpgrade;

    customElements.define = (name: string, ctr: CustomElementConstructor, options: ElementDefinitionOptions = {}) => {
        if (!options.extends) {
            return define.call(customElements, name, ctr, options);
        }

        tagNames[name] = options.extends;
        shimConstructor(ctr);
        define.call(customElements, name, ctr, options);
        polyfillUpgrade(document.documentElement, false, (node: Node) =>
            isElement(node) && node.tagName?.toLowerCase() === options.extends && getIs(node)?.toLowerCase() === name
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP
        );
    };

    document.createElement = (tagName: string, options?: ElementCreationOptions) => {
        if (options?.is) {
            const ctr = customElements.get(options.is);
            if (ctr) {
                return new ctr();
            }
        }
        return nativeCreateElement.call(document, tagName, options);
    };

    document.createElementNS = ((
        namespace: string | null,
        qualifiedName: string,
        options?: string | ElementCreationOptions
    ) => {
        if (typeof options === 'object' && options !== null && options?.is) {
            const ctr = customElements.get(options.is);
            if (ctr) {
                return new ctr() as Element;
            }
        }
        return nativeCreateElementNS.call(document, namespace, qualifiedName, options) as Element;
    }) as typeof nativeCreateElementNS;

    document.importNode = ((node: Node, deep?: boolean) => {
        const result = nativeImportNode.call(document, node, deep);
        polyfillUpgrade(result);
        return result;
    }) as typeof nativeImportNode;

    Node.prototype.cloneNode = function (deep?: boolean) {
        const clone = cloneNode.call(this, deep);
        polyfillUpgrade(clone as Element);
        return clone;
    };

    if (setInnerHTML) {
        Object.defineProperty(Element.prototype, 'innerHTML', {
            ...setInnerHTML,
            set(this: Element, value: string) {
                setInnerHTML.set?.call(this, value);
                polyfillUpgrade(this);
            },
        });
    }
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
