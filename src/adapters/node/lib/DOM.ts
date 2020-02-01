import { DOM } from '../../../lib/DOM';
import { get } from '../../../lib/registry';
import { isCustomElement } from '../../../lib/CustomElement';

const JSDOM = require('js' + 'dom').JSDOM;
const {
    document,
    Document,
    Node,
    Text,
    Element,
    Event,
    CustomEvent,
    HTMLAnchorElement,
    HTMLAreaElement,
    HTMLAudioElement,
    HTMLBRElement,
    HTMLBaseElement,
    HTMLBodyElement,
    HTMLButtonElement,
    HTMLCanvasElement,
    HTMLContentElement,
    HTMLDListElement,
    HTMLDataElement,
    HTMLDataListElement,
    HTMLDetailsElement,
    HTMLDialogElement,
    HTMLDirectoryElement,
    HTMLDivElement,
    HTMLElement,
    HTMLEmbedElement,
    HTMLFieldSetElement,
    HTMLFontElement,
    HTMLFormElement,
    HTMLFrameElement,
    HTMLFrameSetElement,
    HTMLHRElement,
    HTMLHeadElement,
    HTMLHeadingElement,
    HTMLHtmlElement,
    HTMLIFrameElement,
    HTMLImageElement,
    HTMLInputElement,
    HTMLLIElement,
    HTMLLabelElement,
    HTMLLegendElement,
    HTMLLinkElement,
    HTMLMapElement,
    HTMLMarqueeElement,
    HTMLMediaElement,
    HTMLMenuElement,
    HTMLMetaElement,
    HTMLMeterElement,
    HTMLModElement,
    HTMLOListElement,
    HTMLObjectElement,
    HTMLOptGroupElement,
    HTMLOptionElement,
    HTMLOutputElement,
    HTMLParagraphElement,
    HTMLParamElement,
    HTMLPictureElement,
    HTMLPreElement,
    HTMLProgressElement,
    HTMLQuoteElement,
    HTMLScriptElement,
    HTMLSelectElement,
    HTMLShadowElement,
    HTMLSlotElement,
    HTMLSourceElement,
    HTMLSpanElement,
    HTMLStyleElement,
    HTMLTableCaptionElement,
    HTMLTableCellElement,
    HTMLTableColElement,
    HTMLTableElement,
    HTMLTableRowElement,
    HTMLTableSectionElement,
    HTMLTemplateElement,
    HTMLTextAreaElement,
    HTMLTimeElement,
    HTMLTitleElement,
    HTMLTrackElement,
    HTMLUListElement,
    HTMLUnknownElement,
    HTMLVideoElement,
} = new JSDOM().window;

Object.assign(DOM, {
    isDocument(node: any): node is Document {
        return node && node instanceof Document;
    },
    isNode(node: any): node is Node {
        return node && node instanceof Node;
    },
    isText(node: any): node is Text {
        return node && node instanceof Text;
    },
    isElement(node: any): node is Element {
        return node && node instanceof Element;
    },
    isEvent(event: any): event is Event {
        return event && event instanceof Event;
    },
    createElement(tagName: string, options?: ElementCreationOptions): Element {
        const constructor = get(options && options.is || tagName.toLowerCase());
        const node = document.createElement(tagName);
        if (!constructor || (options && (options as any).plain)) {
            return node;
        }
        return new constructor(node);
    },
    createElementNS(namespaceURI: string, tagName: string): Element {
        return document.createElementNS(namespaceURI, tagName);
    },
    createTextNode(data: string): Text {
        return document.createTextNode(data);
    },
    createEvent(typeArg: string, eventInitDict?: CustomEventInit<unknown>): CustomEvent<unknown> {
        return new CustomEvent(typeArg, eventInitDict);
    },
    appendChild<T extends Node>(parent: Element, newChild: T): T {
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
        }
        Node.prototype.appendChild.call(parent, newChild);
        (this as unknown as typeof DOM).connect(newChild);
        return newChild;
    },
    removeChild<T extends Node>(parent: Element, oldChild: T): T {
        Node.prototype.removeChild.call(parent, oldChild);
        (this as unknown as typeof DOM).disconnect(oldChild);
        return oldChild;
    },
    insertBefore<T extends Node>(parent: Element, newChild: T, refChild: Node | null): T {
        if (refChild && refChild.previousSibling === newChild) {
            return newChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
        }
        Node.prototype.insertBefore.call(parent, newChild, refChild);
        (this as unknown as typeof DOM).connect(newChild);
        return newChild;
    },
    replaceChild<T extends Node>(parent: Element, newChild: Node, oldChild: T): T {
        if (oldChild === newChild) {
            return oldChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
        }
        Node.prototype.replaceChild.call(parent, newChild, oldChild);
        (this as unknown as typeof DOM).disconnect(oldChild);
        (this as unknown as typeof DOM).connect(newChild);
        return oldChild;
    },
    getAttribute(element: Element, qualifiedName: string): string | null {
        return Element.prototype.getAttribute.call(element, qualifiedName);
    },
    hasAttribute(element: Element, qualifiedName: string): boolean {
        return Element.prototype.hasAttribute.call(element, qualifiedName);
    },
    setAttribute(element: Element, qualifiedName: string, value: string): void {
        let oldValue = this.getAttribute(element, qualifiedName);
        Element.prototype.setAttribute.call(element, qualifiedName, value);
        if (isCustomElement(element)) {
            element.attributeChangedCallback(qualifiedName, oldValue, value);
        }
    },
    removeAttribute(element: Element, qualifiedName: string) {
        let oldValue = this.getAttribute(element, qualifiedName);
        Element.prototype.removeAttribute.call(element, qualifiedName);
        if (isCustomElement(element)) {
            element.attributeChangedCallback(qualifiedName, oldValue, null);
        }
    },
    matches(element: Element, selectorString: string): boolean {
        const match = Element.prototype.matches || Element.prototype.webkitMatchesSelector || (Element.prototype as any).msMatchesSelector as typeof Element.prototype.matches;
        return match.call(element, selectorString);
    },
    dispatchEvent(element: Node, event: Event | string, detail?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed?: boolean): boolean {
        if (!this.isNode(element)) {
            throw new TypeError('The provided element must be a Node');
        }

        if (typeof event === 'string') {
            if (typeof bubbles !== 'boolean') {
                throw new TypeError('The provided bubbles option must be a boolean');
            }
            if (typeof cancelable !== 'boolean') {
                throw new TypeError('The provided cancelable option must be a boolean');
            }
            if (typeof composed !== 'undefined' && typeof composed !== 'boolean') {
                throw new TypeError('The provided composed option must be a boolean');
            }

            event = this.createEvent(event, {
                detail,
                bubbles,
                cancelable,
                composed,
            });
        } else if (!this.isEvent(event)) {
            throw new TypeError('The provided object must be an Event');
        }

        return Node.prototype.dispatchEvent.call(element, event);
    },
});

HTMLAnchorElement && DOM.define('HTMLAnchorElement', HTMLAnchorElement);
HTMLAreaElement && DOM.define('HTMLAreaElement', HTMLAreaElement);
HTMLAudioElement && DOM.define('HTMLAudioElement', HTMLAudioElement);
HTMLBRElement && DOM.define('HTMLBRElement', HTMLBRElement);
HTMLBaseElement && DOM.define('HTMLBaseElement', HTMLBaseElement);
HTMLBodyElement && DOM.define('HTMLBodyElement', HTMLBodyElement);
HTMLButtonElement && DOM.define('HTMLButtonElement', HTMLButtonElement);
HTMLCanvasElement && DOM.define('HTMLCanvasElement', HTMLCanvasElement);
HTMLContentElement && DOM.define('HTMLContentElement', HTMLContentElement);
HTMLDListElement && DOM.define('HTMLDListElement', HTMLDListElement);
HTMLDataElement && DOM.define('HTMLDataElement', HTMLDataElement);
HTMLDataListElement && DOM.define('HTMLDataListElement', HTMLDataListElement);
HTMLDetailsElement && DOM.define('HTMLDetailsElement', HTMLDetailsElement);
HTMLDialogElement && DOM.define('HTMLDialogElement', HTMLDialogElement);
HTMLDirectoryElement && DOM.define('HTMLDirectoryElement', HTMLDirectoryElement);
HTMLDivElement && DOM.define('HTMLDivElement', HTMLDivElement);
HTMLElement && DOM.define('HTMLElement', HTMLElement);
HTMLEmbedElement && DOM.define('HTMLEmbedElement', HTMLEmbedElement);
HTMLFieldSetElement && DOM.define('HTMLFieldSetElement', HTMLFieldSetElement);
HTMLFontElement && DOM.define('HTMLFontElement', HTMLFontElement);
HTMLFormElement && DOM.define('HTMLFormElement', HTMLFormElement);
HTMLFrameElement && DOM.define('HTMLFrameElement', HTMLFrameElement);
HTMLFrameSetElement && DOM.define('HTMLFrameSetElement', HTMLFrameSetElement);
HTMLHRElement && DOM.define('HTMLHRElement', HTMLHRElement);
HTMLHeadElement && DOM.define('HTMLHeadElement', HTMLHeadElement);
HTMLHeadingElement && DOM.define('HTMLHeadingElement', HTMLHeadingElement);
HTMLHtmlElement && DOM.define('HTMLHtmlElement', HTMLHtmlElement);
HTMLIFrameElement && DOM.define('HTMLIFrameElement', HTMLIFrameElement);
HTMLImageElement && DOM.define('HTMLImageElement', HTMLImageElement);
HTMLInputElement && DOM.define('HTMLInputElement', HTMLInputElement);
HTMLLIElement && DOM.define('HTMLLIElement', HTMLLIElement);
HTMLLabelElement && DOM.define('HTMLLabelElement', HTMLLabelElement);
HTMLLegendElement && DOM.define('HTMLLegendElement', HTMLLegendElement);
HTMLLinkElement && DOM.define('HTMLLinkElement', HTMLLinkElement);
HTMLMapElement && DOM.define('HTMLMapElement', HTMLMapElement);
HTMLMarqueeElement && DOM.define('HTMLMarqueeElement', HTMLMarqueeElement);
HTMLMediaElement && DOM.define('HTMLMediaElement', HTMLMediaElement);
HTMLMenuElement && DOM.define('HTMLMenuElement', HTMLMenuElement);
HTMLMetaElement && DOM.define('HTMLMetaElement', HTMLMetaElement);
HTMLMeterElement && DOM.define('HTMLMeterElement', HTMLMeterElement);
HTMLModElement && DOM.define('HTMLModElement', HTMLModElement);
HTMLOListElement && DOM.define('HTMLOListElement', HTMLOListElement);
HTMLObjectElement && DOM.define('HTMLObjectElement', HTMLObjectElement);
HTMLOptGroupElement && DOM.define('HTMLOptGroupElement', HTMLOptGroupElement);
HTMLOptionElement && DOM.define('HTMLOptionElement', HTMLOptionElement);
HTMLOutputElement && DOM.define('HTMLOutputElement', HTMLOutputElement);
HTMLParagraphElement && DOM.define('HTMLParagraphElement', HTMLParagraphElement);
HTMLParamElement && DOM.define('HTMLParamElement', HTMLParamElement);
HTMLPictureElement && DOM.define('HTMLPictureElement', HTMLPictureElement);
HTMLPreElement && DOM.define('HTMLPreElement', HTMLPreElement);
HTMLProgressElement && DOM.define('HTMLProgressElement', HTMLProgressElement);
HTMLQuoteElement && DOM.define('HTMLQuoteElement', HTMLQuoteElement);
HTMLScriptElement && DOM.define('HTMLScriptElement', HTMLScriptElement);
HTMLSelectElement && DOM.define('HTMLSelectElement', HTMLSelectElement);
HTMLShadowElement && DOM.define('HTMLShadowElement', HTMLShadowElement);
HTMLSlotElement && DOM.define('HTMLSlotElement', HTMLSlotElement);
HTMLSourceElement && DOM.define('HTMLSourceElement', HTMLSourceElement);
HTMLSpanElement && DOM.define('HTMLSpanElement', HTMLSpanElement);
HTMLStyleElement && DOM.define('HTMLStyleElement', HTMLStyleElement);
HTMLTableCaptionElement && DOM.define('HTMLTableCaptionElement', HTMLTableCaptionElement);
HTMLTableCellElement && DOM.define('HTMLTableCellElement', HTMLTableCellElement);
HTMLTableColElement && DOM.define('HTMLTableColElement', HTMLTableColElement);
HTMLTableElement && DOM.define('HTMLTableElement', HTMLTableElement);
HTMLTableRowElement && DOM.define('HTMLTableRowElement', HTMLTableRowElement);
HTMLTableSectionElement && DOM.define('HTMLTableSectionElement', HTMLTableSectionElement);
HTMLTemplateElement && DOM.define('HTMLTemplateElement', HTMLTemplateElement);
HTMLTextAreaElement && DOM.define('HTMLTextAreaElement', HTMLTextAreaElement);
HTMLTimeElement && DOM.define('HTMLTimeElement', HTMLTimeElement);
HTMLTitleElement && DOM.define('HTMLTitleElement', HTMLTitleElement);
HTMLTrackElement && DOM.define('HTMLTrackElement', HTMLTrackElement);
HTMLUListElement && DOM.define('HTMLUListElement', HTMLUListElement);
HTMLUnknownElement && DOM.define('HTMLUnknownElement', HTMLUnknownElement);
HTMLVideoElement && DOM.define('HTMLVideoElement', HTMLVideoElement);
