import { DOM } from '../dna';

const JSDOM = require('js' + 'dom').JSDOM;
const {
    document,
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

DOM.document = document;
DOM.Node = Node;
DOM.Text = Text;
DOM.Element = Element;
DOM.Event = Event;
DOM.CustomEvent = CustomEvent;

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

export * from '../dna';
