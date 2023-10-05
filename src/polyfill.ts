import type { CustomElement, CustomElementConstructor } from './CustomElement';

const win = window;
const setPrototypeOf = Object.setPrototypeOf;
const tagNames: Record<string, string> = {};
const CE_SYMBOL = Symbol();
const nativeCreateElement = document.createElement.bind(document);
const BUILTIN_HTML_CONSTRUCTORS = [
    win.HTMLElement,
    win.HTMLAnchorElement,
    win.HTMLAreaElement,
    win.HTMLAudioElement,
    win.HTMLBaseElement,
    win.HTMLQuoteElement,
    win.HTMLBodyElement,
    win.HTMLBRElement,
    win.HTMLButtonElement,
    win.HTMLCanvasElement,
    win.HTMLTableCaptionElement,
    win.HTMLTableColElement,
    win.HTMLDataElement,
    win.HTMLDataListElement,
    win.HTMLModElement,
    win.HTMLDetailsElement,
    win.HTMLDialogElement,
    win.HTMLDirectoryElement,
    win.HTMLDivElement,
    win.HTMLDListElement,
    win.HTMLEmbedElement,
    win.HTMLFieldSetElement,
    win.HTMLFontElement,
    win.HTMLFormElement,
    win.HTMLFrameElement,
    win.HTMLFrameSetElement,
    win.HTMLHeadingElement,
    win.HTMLHeadElement,
    win.HTMLHRElement,
    win.HTMLIFrameElement,
    win.HTMLImageElement,
    win.HTMLInputElement,
    win.HTMLLabelElement,
    win.HTMLLegendElement,
    win.HTMLLIElement,
    win.HTMLLinkElement,
    win.HTMLMapElement,
    win.HTMLMarqueeElement,
    win.HTMLMenuElement,
    win.HTMLMetaElement,
    win.HTMLMeterElement,
    win.HTMLObjectElement,
    win.HTMLOListElement,
    win.HTMLOptGroupElement,
    win.HTMLOptionElement,
    win.HTMLOutputElement,
    win.HTMLParagraphElement,
    win.HTMLParamElement,
    win.HTMLPictureElement,
    win.HTMLPreElement,
    win.HTMLProgressElement,
    win.HTMLScriptElement,
    win.HTMLSelectElement,
    win.HTMLSlotElement,
    win.HTMLSourceElement,
    win.HTMLSpanElement,
    win.HTMLStyleElement,
    win.HTMLTableElement,
    win.HTMLTableSectionElement,
    win.HTMLTableCellElement,
    win.HTMLTemplateElement,
    win.HTMLTextAreaElement,
    win.HTMLTimeElement,
    win.HTMLTitleElement,
    win.HTMLTableRowElement,
    win.HTMLTrackElement,
    win.HTMLUListElement,
    win.HTMLVideoElement,
];

let childListObserver: MutationObserver;

/**
 * Create a MutationObserver to observe childList changes.
 * @returns A MutationObserver instance.
 */
function createChildListObserver() {
    if (childListObserver) {
        return childListObserver;
    }

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
}

/**
 * Shim a Custom Element constructor.
 * @param constructor The Custom Element constructor.
 */
function shimConstructor(constructor: CustomElementConstructor & { __shim?: boolean }) {
    createChildListObserver();

    let CurrentConstructor = constructor;
    let ParentCostructor = Object.getPrototypeOf(CurrentConstructor) as CustomElementConstructor;
    while (BUILTIN_HTML_CONSTRUCTORS.indexOf(ParentCostructor) === -1) {
        CurrentConstructor = ParentCostructor;
        if (Object.hasOwnProperty.call(CurrentConstructor, '__shim')) {
            return;
        }
        ParentCostructor = Object.getPrototypeOf(CurrentConstructor) as CustomElementConstructor;
    }

    if (Object.hasOwnProperty.call(CurrentConstructor, '__shim')) {
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
                if (observedAttributes.indexOf(attributeName) === -1) {
                    return;
                }

                element.attributeChangedCallback(attributeName, mutation.oldValue, element.getAttribute(attributeName));
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
}

/**
 * Register a polyfill for Customized built-in elements.
 */
function polyfillBuiltin() {
    const customElements = win.customElements;
    const define = customElements.define.bind(customElements);
    const upgrade = customElements.upgrade.bind(customElements);

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
            if (observed.indexOf(attr.name) !== -1) {
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

if (!checkBuiltin()) {
    polyfillBuiltin();
}
