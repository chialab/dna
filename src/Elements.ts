import { isBrowser } from './helpers';

export interface HTMLTagNameMap {
    a: HTMLAnchorElement;
    abbr: HTMLElement;
    address: HTMLElement;
    area: HTMLAreaElement;
    article: HTMLElement;
    aside: HTMLElement;
    audio: HTMLAudioElement;
    b: HTMLElement;
    base: HTMLBaseElement;
    bdi: HTMLElement;
    bdo: HTMLElement;
    blockquote: HTMLQuoteElement;
    body: HTMLBodyElement;
    br: HTMLBRElement;
    button: HTMLButtonElement;
    canvas: HTMLCanvasElement;
    caption: HTMLTableCaptionElement;
    cite: HTMLElement;
    code: HTMLElement;
    col: HTMLTableColElement;
    colgroup: HTMLTableColElement;
    data: HTMLDataElement;
    datalist: HTMLDataListElement;
    dd: HTMLElement;
    del: HTMLModElement;
    details: HTMLDetailsElement;
    dfn: HTMLElement;
    dialog: HTMLDialogElement;
    dir: HTMLDirectoryElement;
    div: HTMLDivElement;
    dl: HTMLDListElement;
    dt: HTMLElement;
    em: HTMLElement;
    embed: HTMLEmbedElement;
    fieldset: HTMLFieldSetElement;
    figcaption: HTMLElement;
    figure: HTMLElement;
    font: HTMLFontElement;
    footer: HTMLElement;
    form: HTMLFormElement;
    frame: HTMLFrameElement;
    frameset: HTMLFrameSetElement;
    h1: HTMLHeadingElement;
    h2: HTMLHeadingElement;
    h3: HTMLHeadingElement;
    h4: HTMLHeadingElement;
    h5: HTMLHeadingElement;
    h6: HTMLHeadingElement;
    head: HTMLHeadElement;
    header: HTMLElement;
    hgroup: HTMLElement;
    hr: HTMLHRElement;
    html: HTMLHtmlElement;
    i: HTMLElement;
    iframe: HTMLIFrameElement;
    img: HTMLImageElement;
    input: HTMLInputElement;
    ins: HTMLModElement;
    kbd: HTMLElement;
    label: HTMLLabelElement;
    legend: HTMLLegendElement;
    li: HTMLLIElement;
    link: HTMLLinkElement;
    main: HTMLElement;
    map: HTMLMapElement;
    mark: HTMLElement;
    marquee: HTMLMarqueeElement;
    menu: HTMLMenuElement;
    meta: HTMLMetaElement;
    meter: HTMLMeterElement;
    nav: HTMLElement;
    noscript: HTMLElement;
    object: HTMLObjectElement;
    ol: HTMLOListElement;
    optgroup: HTMLOptGroupElement;
    option: HTMLOptionElement;
    output: HTMLOutputElement;
    p: HTMLParagraphElement;
    param: HTMLParamElement;
    picture: HTMLPictureElement;
    pre: HTMLPreElement;
    progress: HTMLProgressElement;
    q: HTMLQuoteElement;
    rp: HTMLElement;
    rt: HTMLElement;
    ruby: HTMLElement;
    s: HTMLElement;
    samp: HTMLElement;
    script: HTMLScriptElement;
    section: HTMLElement;
    select: HTMLSelectElement;
    slot: HTMLSlotElement;
    small: HTMLElement;
    source: HTMLSourceElement;
    span: HTMLSpanElement;
    strong: HTMLElement;
    style: HTMLStyleElement;
    sub: HTMLElement;
    summary: HTMLElement;
    sup: HTMLElement;
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    td: HTMLTableCellElement;
    template: HTMLTemplateElement;
    textarea: HTMLTextAreaElement;
    tfoot: HTMLTableSectionElement;
    th: HTMLTableCellElement;
    thead: HTMLTableSectionElement;
    time: HTMLTimeElement;
    title: HTMLTitleElement;
    tr: HTMLTableRowElement;
    track: HTMLTrackElement;
    u: HTMLElement;
    ul: HTMLUListElement;
    var: HTMLElement;
    video: HTMLVideoElement;
    wbr: HTMLElement;
    big: HTMLElement;
    keygen: HTMLElement;
    menuitem: HTMLElement;
    noindex: HTMLElement;
}

export interface SVGTagNameMap {
    animate: SVGElement;
    animateMotion: SVGElement;
    animateTransform: SVGElement;
    circle: SVGCircleElement;
    clipPath: SVGClipPathElement;
    defs: SVGDefsElement;
    desc: SVGDescElement;
    ellipse: SVGEllipseElement;
    feBlend: SVGFEBlendElement;
    feColorMatrix: SVGFEColorMatrixElement;
    feComponentTransfer: SVGFEComponentTransferElement;
    feComposite: SVGFECompositeElement;
    feConvolveMatrix: SVGFEConvolveMatrixElement;
    feDiffuseLighting: SVGFEDiffuseLightingElement;
    feDisplacementMap: SVGFEDisplacementMapElement;
    feDistantLight: SVGFEDistantLightElement;
    feDropShadow: SVGElement;
    feFlood: SVGFEFloodElement;
    feFuncA: SVGFEFuncAElement;
    feFuncB: SVGFEFuncBElement;
    feFuncG: SVGFEFuncGElement;
    feFuncR: SVGFEFuncRElement;
    feGaussianBlur: SVGFEGaussianBlurElement;
    feImage: SVGFEImageElement;
    feMerge: SVGFEMergeElement;
    feMergeNode: SVGFEMergeNodeElement;
    feMorphology: SVGFEMorphologyElement;
    feOffset: SVGFEOffsetElement;
    fePointLight: SVGFEPointLightElement;
    feSpecularLighting: SVGFESpecularLightingElement;
    feSpotLight: SVGFESpotLightElement;
    feTile: SVGFETileElement;
    feTurbulence: SVGFETurbulenceElement;
    filter: SVGFilterElement;
    foreignObject: SVGForeignObjectElement;
    g: SVGGElement;
    image: SVGImageElement;
    line: SVGLineElement;
    linearGradient: SVGLinearGradientElement;
    marker: SVGMarkerElement;
    mask: SVGMaskElement;
    metadata: SVGMetadataElement;
    mpath: SVGElement;
    path: SVGPathElement;
    pattern: SVGPatternElement;
    polygon: SVGPolygonElement;
    polyline: SVGPolylineElement;
    radialGradient: SVGRadialGradientElement;
    rect: SVGRectElement;
    stop: SVGStopElement;
    svg: SVGElement;
    switch: SVGSwitchElement;
    symbol: SVGSymbolElement;
    text: SVGTextElement;
    textPath: SVGTextPathElement;
    tspan: SVGTSpanElement;
    use: SVGUseElement;
    view: SVGViewElement;
}

const Element = class {};
const _HTMLElement = (isBrowser ? HTMLElement : Element) as typeof HTMLElement;
const _HTMLAnchorElement = (isBrowser ? HTMLAnchorElement : Element) as typeof HTMLAnchorElement;
const _HTMLAreaElement = (isBrowser ? HTMLAreaElement : Element) as typeof HTMLAreaElement;
const _HTMLAudioElement = (isBrowser ? HTMLAudioElement : Element) as typeof HTMLAudioElement;
const _HTMLBaseElement = (isBrowser ? HTMLBaseElement : Element) as typeof HTMLBaseElement;
const _HTMLQuoteElement = (isBrowser ? HTMLQuoteElement : Element) as typeof HTMLQuoteElement;
const _HTMLBodyElement = (isBrowser ? HTMLBodyElement : Element) as typeof HTMLBodyElement;
const _HTMLBRElement = (isBrowser ? HTMLBRElement : Element) as typeof HTMLBRElement;
const _HTMLButtonElement = (isBrowser ? HTMLButtonElement : Element) as typeof HTMLButtonElement;
const _HTMLCanvasElement = (isBrowser ? HTMLCanvasElement : Element) as typeof HTMLCanvasElement;
const _HTMLTableCaptionElement = (isBrowser ? HTMLTableCaptionElement : Element) as typeof HTMLTableCaptionElement;
const _HTMLTableColElement = (isBrowser ? HTMLTableColElement : Element) as typeof HTMLTableColElement;
const _HTMLDataElement = (isBrowser ? HTMLDataElement : Element) as typeof HTMLDataElement;
const _HTMLDataListElement = (isBrowser ? HTMLDataListElement : Element) as typeof HTMLDataListElement;
const _HTMLModElement = (isBrowser ? HTMLModElement : Element) as typeof HTMLModElement;
const _HTMLDetailsElement = (isBrowser ? HTMLDetailsElement : Element) as typeof HTMLDetailsElement;
const _HTMLDialogElement = (isBrowser ? HTMLDialogElement : Element) as typeof HTMLDialogElement;
const _HTMLDirectoryElement = (isBrowser ? HTMLDirectoryElement : Element) as typeof HTMLDirectoryElement;
const _HTMLDivElement = (isBrowser ? HTMLDivElement : Element) as typeof HTMLDivElement;
const _HTMLDListElement = (isBrowser ? HTMLDListElement : Element) as typeof HTMLDListElement;
const _HTMLEmbedElement = (isBrowser ? HTMLEmbedElement : Element) as typeof HTMLEmbedElement;
const _HTMLFieldSetElement = (isBrowser ? HTMLFieldSetElement : Element) as typeof HTMLFieldSetElement;
const _HTMLFontElement = (isBrowser ? HTMLFontElement : Element) as typeof HTMLFontElement;
const _HTMLFormElement = (isBrowser ? HTMLFormElement : Element) as typeof HTMLFormElement;
const _HTMLFrameElement = (isBrowser ? HTMLFrameElement : Element) as typeof HTMLFrameElement;
const _HTMLFrameSetElement = (isBrowser ? HTMLFrameSetElement : Element) as typeof HTMLFrameSetElement;
const _HTMLHeadingElement = (isBrowser ? HTMLHeadingElement : Element) as typeof HTMLHeadingElement;
const _HTMLHeadElement = (isBrowser ? HTMLHeadElement : Element) as typeof HTMLHeadElement;
const _HTMLHRElement = (isBrowser ? HTMLHRElement : Element) as typeof HTMLHRElement;
const _HTMLIFrameElement = (isBrowser ? HTMLIFrameElement : Element) as typeof HTMLIFrameElement;
const _HTMLImageElement = (isBrowser ? HTMLImageElement : Element) as typeof HTMLImageElement;
const _HTMLInputElement = (isBrowser ? HTMLInputElement : Element) as typeof HTMLInputElement;
const _HTMLLabelElement = (isBrowser ? HTMLLabelElement : Element) as typeof HTMLLabelElement;
const _HTMLLegendElement = (isBrowser ? HTMLLegendElement : Element) as typeof HTMLLegendElement;
const _HTMLLIElement = (isBrowser ? HTMLLIElement : Element) as typeof HTMLLIElement;
const _HTMLLinkElement = (isBrowser ? HTMLLinkElement : Element) as typeof HTMLLinkElement;
const _HTMLMapElement = (isBrowser ? HTMLMapElement : Element) as typeof HTMLMapElement;
const _HTMLMarqueeElement = (isBrowser ? HTMLMarqueeElement : Element) as typeof HTMLMarqueeElement;
const _HTMLMenuElement = (isBrowser ? HTMLMenuElement : Element) as typeof HTMLMenuElement;
const _HTMLMetaElement = (isBrowser ? HTMLMetaElement : Element) as typeof HTMLMetaElement;
const _HTMLMeterElement = (isBrowser ? HTMLMeterElement : Element) as typeof HTMLMeterElement;
const _HTMLObjectElement = (isBrowser ? HTMLObjectElement : Element) as typeof HTMLObjectElement;
const _HTMLOListElement = (isBrowser ? HTMLOListElement : Element) as typeof HTMLOListElement;
const _HTMLOptGroupElement = (isBrowser ? HTMLOptGroupElement : Element) as typeof HTMLOptGroupElement;
const _HTMLOptionElement = (isBrowser ? HTMLOptionElement : Element) as typeof HTMLOptionElement;
const _HTMLOutputElement = (isBrowser ? HTMLOutputElement : Element) as typeof HTMLOutputElement;
const _HTMLParagraphElement = (isBrowser ? HTMLParagraphElement : Element) as typeof HTMLParagraphElement;
const _HTMLParamElement = (isBrowser ? HTMLParamElement : Element) as typeof HTMLParamElement;
const _HTMLPictureElement = (isBrowser ? HTMLPictureElement : Element) as typeof HTMLPictureElement;
const _HTMLPreElement = (isBrowser ? HTMLPreElement : Element) as typeof HTMLPreElement;
const _HTMLProgressElement = (isBrowser ? HTMLProgressElement : Element) as typeof HTMLProgressElement;
const _HTMLScriptElement = (isBrowser ? HTMLScriptElement : Element) as typeof HTMLScriptElement;
const _HTMLSelectElement = (isBrowser ? HTMLSelectElement : Element) as typeof HTMLSelectElement;
const _HTMLSlotElement = (isBrowser ? HTMLSlotElement : Element) as typeof HTMLSlotElement;
const _HTMLSourceElement = (isBrowser ? HTMLSourceElement : Element) as typeof HTMLSourceElement;
const _HTMLSpanElement = (isBrowser ? HTMLSpanElement : Element) as typeof HTMLSpanElement;
const _HTMLStyleElement = (isBrowser ? HTMLStyleElement : Element) as typeof HTMLStyleElement;
const _HTMLTableElement = (isBrowser ? HTMLTableElement : Element) as typeof HTMLTableElement;
const _HTMLTableSectionElement = (isBrowser ? HTMLTableSectionElement : Element) as typeof HTMLTableSectionElement;
const _HTMLTableCellElement = (isBrowser ? HTMLTableCellElement : Element) as typeof HTMLTableCellElement;
const _HTMLTemplateElement = (isBrowser ? HTMLTemplateElement : Element) as typeof HTMLTemplateElement;
const _HTMLTextAreaElement = (isBrowser ? HTMLTextAreaElement : Element) as typeof HTMLTextAreaElement;
const _HTMLTimeElement = (isBrowser ? HTMLTimeElement : Element) as typeof HTMLTimeElement;
const _HTMLTitleElement = (isBrowser ? HTMLTitleElement : Element) as typeof HTMLTitleElement;
const _HTMLTableRowElement = (isBrowser ? HTMLTableRowElement : Element) as typeof HTMLTableRowElement;
const _HTMLTrackElement = (isBrowser ? HTMLTrackElement : Element) as typeof HTMLTrackElement;
const _HTMLUListElement = (isBrowser ? HTMLUListElement : Element) as typeof HTMLUListElement;
const _HTMLVideoElement = (isBrowser ? HTMLVideoElement : Element) as typeof HTMLVideoElement;

export {
    _HTMLElement as HTMLElement,
    _HTMLAnchorElement as HTMLAnchorElement,
    _HTMLAreaElement as HTMLAreaElement,
    _HTMLAudioElement as HTMLAudioElement,
    _HTMLBaseElement as HTMLBaseElement,
    _HTMLQuoteElement as HTMLQuoteElement,
    _HTMLBodyElement as HTMLBodyElement,
    _HTMLBRElement as HTMLBRElement,
    _HTMLButtonElement as HTMLButtonElement,
    _HTMLCanvasElement as HTMLCanvasElement,
    _HTMLTableCaptionElement as HTMLTableCaptionElement,
    _HTMLTableColElement as HTMLTableColElement,
    _HTMLDataElement as HTMLDataElement,
    _HTMLDataListElement as HTMLDataListElement,
    _HTMLModElement as HTMLModElement,
    _HTMLDetailsElement as HTMLDetailsElement,
    _HTMLDialogElement as HTMLDialogElement,
    _HTMLDirectoryElement as HTMLDirectoryElement,
    _HTMLDivElement as HTMLDivElement,
    _HTMLDListElement as HTMLDListElement,
    _HTMLEmbedElement as HTMLEmbedElement,
    _HTMLFieldSetElement as HTMLFieldSetElement,
    _HTMLFontElement as HTMLFontElement,
    _HTMLFormElement as HTMLFormElement,
    _HTMLFrameElement as HTMLFrameElement,
    _HTMLFrameSetElement as HTMLFrameSetElement,
    _HTMLHeadingElement as HTMLHeadingElement,
    _HTMLHeadElement as HTMLHeadElement,
    _HTMLHRElement as HTMLHRElement,
    _HTMLIFrameElement as HTMLIFrameElement,
    _HTMLImageElement as HTMLImageElement,
    _HTMLInputElement as HTMLInputElement,
    _HTMLLabelElement as HTMLLabelElement,
    _HTMLLegendElement as HTMLLegendElement,
    _HTMLLIElement as HTMLLIElement,
    _HTMLLinkElement as HTMLLinkElement,
    _HTMLMapElement as HTMLMapElement,
    _HTMLMarqueeElement as HTMLMarqueeElement,
    _HTMLMenuElement as HTMLMenuElement,
    _HTMLMetaElement as HTMLMetaElement,
    _HTMLMeterElement as HTMLMeterElement,
    _HTMLObjectElement as HTMLObjectElement,
    _HTMLOListElement as HTMLOListElement,
    _HTMLOptGroupElement as HTMLOptGroupElement,
    _HTMLOptionElement as HTMLOptionElement,
    _HTMLOutputElement as HTMLOutputElement,
    _HTMLParagraphElement as HTMLParagraphElement,
    _HTMLParamElement as HTMLParamElement,
    _HTMLPictureElement as HTMLPictureElement,
    _HTMLPreElement as HTMLPreElement,
    _HTMLProgressElement as HTMLProgressElement,
    _HTMLScriptElement as HTMLScriptElement,
    _HTMLSelectElement as HTMLSelectElement,
    _HTMLSlotElement as HTMLSlotElement,
    _HTMLSourceElement as HTMLSourceElement,
    _HTMLSpanElement as HTMLSpanElement,
    _HTMLStyleElement as HTMLStyleElement,
    _HTMLTableElement as HTMLTableElement,
    _HTMLTableSectionElement as HTMLTableSectionElement,
    _HTMLTableCellElement as HTMLTableCellElement,
    _HTMLTemplateElement as HTMLTemplateElement,
    _HTMLTextAreaElement as HTMLTextAreaElement,
    _HTMLTimeElement as HTMLTimeElement,
    _HTMLTitleElement as HTMLTitleElement,
    _HTMLTableRowElement as HTMLTableRowElement,
    _HTMLTrackElement as HTMLTrackElement,
    _HTMLUListElement as HTMLUListElement,
    _HTMLVideoElement as HTMLVideoElement,
};
