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

const ns = (isBrowser ? window : {}) as unknown as typeof window;
const FallbackElement = class FallbackElement {};
const _HTMLElement = (ns.HTMLElement ?? FallbackElement) as typeof HTMLElement;
const _HTMLAnchorElement = (ns.HTMLAnchorElement ?? FallbackElement) as typeof HTMLAnchorElement;
const _HTMLAreaElement = (ns.HTMLAreaElement ?? FallbackElement) as typeof HTMLAreaElement;
const _HTMLAudioElement = (ns.HTMLAudioElement ?? FallbackElement) as typeof HTMLAudioElement;
const _HTMLBaseElement = (ns.HTMLBaseElement ?? FallbackElement) as typeof HTMLBaseElement;
const _HTMLQuoteElement = (ns.HTMLQuoteElement ?? FallbackElement) as typeof HTMLQuoteElement;
const _HTMLBodyElement = (ns.HTMLBodyElement ?? FallbackElement) as typeof HTMLBodyElement;
const _HTMLBRElement = (ns.HTMLBRElement ?? FallbackElement) as typeof HTMLBRElement;
const _HTMLButtonElement = (ns.HTMLButtonElement ?? FallbackElement) as typeof HTMLButtonElement;
const _HTMLCanvasElement = (ns.HTMLCanvasElement ?? FallbackElement) as typeof HTMLCanvasElement;
const _HTMLTableCaptionElement = (ns.HTMLTableCaptionElement ?? FallbackElement) as typeof HTMLTableCaptionElement;
const _HTMLTableColElement = (ns.HTMLTableColElement ?? FallbackElement) as typeof HTMLTableColElement;
const _HTMLDataElement = (ns.HTMLDataElement ?? FallbackElement) as typeof HTMLDataElement;
const _HTMLDataListElement = (ns.HTMLDataListElement ?? FallbackElement) as typeof HTMLDataListElement;
const _HTMLModElement = (ns.HTMLModElement ?? FallbackElement) as typeof HTMLModElement;
const _HTMLDetailsElement = (ns.HTMLDetailsElement ?? FallbackElement) as typeof HTMLDetailsElement;
const _HTMLDialogElement = (ns.HTMLDialogElement ?? FallbackElement) as typeof HTMLDialogElement;
const _HTMLDirectoryElement = (ns.HTMLDirectoryElement ?? FallbackElement) as typeof HTMLDirectoryElement;
const _HTMLDivElement = (ns.HTMLDivElement ?? FallbackElement) as typeof HTMLDivElement;
const _HTMLDListElement = (ns.HTMLDListElement ?? FallbackElement) as typeof HTMLDListElement;
const _HTMLEmbedElement = (ns.HTMLEmbedElement ?? FallbackElement) as typeof HTMLEmbedElement;
const _HTMLFieldSetElement = (ns.HTMLFieldSetElement ?? FallbackElement) as typeof HTMLFieldSetElement;
const _HTMLFontElement = (ns.HTMLFontElement ?? FallbackElement) as typeof HTMLFontElement;
const _HTMLFormElement = (ns.HTMLFormElement ?? FallbackElement) as typeof HTMLFormElement;
const _HTMLFrameElement = (ns.HTMLFrameElement ?? FallbackElement) as typeof HTMLFrameElement;
const _HTMLFrameSetElement = (ns.HTMLFrameSetElement ?? FallbackElement) as typeof HTMLFrameSetElement;
const _HTMLHeadingElement = (ns.HTMLHeadingElement ?? FallbackElement) as typeof HTMLHeadingElement;
const _HTMLHeadElement = (ns.HTMLHeadElement ?? FallbackElement) as typeof HTMLHeadElement;
const _HTMLHRElement = (ns.HTMLHRElement ?? FallbackElement) as typeof HTMLHRElement;
const _HTMLIFrameElement = (ns.HTMLIFrameElement ?? FallbackElement) as typeof HTMLIFrameElement;
const _HTMLImageElement = (ns.HTMLImageElement ?? FallbackElement) as typeof HTMLImageElement;
const _HTMLInputElement = (ns.HTMLInputElement ?? FallbackElement) as typeof HTMLInputElement;
const _HTMLLabelElement = (ns.HTMLLabelElement ?? FallbackElement) as typeof HTMLLabelElement;
const _HTMLLegendElement = (ns.HTMLLegendElement ?? FallbackElement) as typeof HTMLLegendElement;
const _HTMLLIElement = (ns.HTMLLIElement ?? FallbackElement) as typeof HTMLLIElement;
const _HTMLLinkElement = (ns.HTMLLinkElement ?? FallbackElement) as typeof HTMLLinkElement;
const _HTMLMapElement = (ns.HTMLMapElement ?? FallbackElement) as typeof HTMLMapElement;
const _HTMLMarqueeElement = (ns.HTMLMarqueeElement ?? FallbackElement) as typeof HTMLMarqueeElement;
const _HTMLMenuElement = (ns.HTMLMenuElement ?? FallbackElement) as typeof HTMLMenuElement;
const _HTMLMetaElement = (ns.HTMLMetaElement ?? FallbackElement) as typeof HTMLMetaElement;
const _HTMLMeterElement = (ns.HTMLMeterElement ?? FallbackElement) as typeof HTMLMeterElement;
const _HTMLObjectElement = (ns.HTMLObjectElement ?? FallbackElement) as typeof HTMLObjectElement;
const _HTMLOListElement = (ns.HTMLOListElement ?? FallbackElement) as typeof HTMLOListElement;
const _HTMLOptGroupElement = (ns.HTMLOptGroupElement ?? FallbackElement) as typeof HTMLOptGroupElement;
const _HTMLOptionElement = (ns.HTMLOptionElement ?? FallbackElement) as typeof HTMLOptionElement;
const _HTMLOutputElement = (ns.HTMLOutputElement ?? FallbackElement) as typeof HTMLOutputElement;
const _HTMLParagraphElement = (ns.HTMLParagraphElement ?? FallbackElement) as typeof HTMLParagraphElement;
const _HTMLParamElement = (ns.HTMLParamElement ?? FallbackElement) as typeof HTMLParamElement;
const _HTMLPictureElement = (ns.HTMLPictureElement ?? FallbackElement) as typeof HTMLPictureElement;
const _HTMLPreElement = (ns.HTMLPreElement ?? FallbackElement) as typeof HTMLPreElement;
const _HTMLProgressElement = (ns.HTMLProgressElement ?? FallbackElement) as typeof HTMLProgressElement;
const _HTMLScriptElement = (ns.HTMLScriptElement ?? FallbackElement) as typeof HTMLScriptElement;
const _HTMLSelectElement = (ns.HTMLSelectElement ?? FallbackElement) as typeof HTMLSelectElement;
const _HTMLSlotElement = (ns.HTMLSlotElement ?? FallbackElement) as typeof HTMLSlotElement;
const _HTMLSourceElement = (ns.HTMLSourceElement ?? FallbackElement) as typeof HTMLSourceElement;
const _HTMLSpanElement = (ns.HTMLSpanElement ?? FallbackElement) as typeof HTMLSpanElement;
const _HTMLStyleElement = (ns.HTMLStyleElement ?? FallbackElement) as typeof HTMLStyleElement;
const _HTMLTableElement = (ns.HTMLTableElement ?? FallbackElement) as typeof HTMLTableElement;
const _HTMLTableSectionElement = (ns.HTMLTableSectionElement ?? FallbackElement) as typeof HTMLTableSectionElement;
const _HTMLTableCellElement = (ns.HTMLTableCellElement ?? FallbackElement) as typeof HTMLTableCellElement;
const _HTMLTemplateElement = (ns.HTMLTemplateElement ?? FallbackElement) as typeof HTMLTemplateElement;
const _HTMLTextAreaElement = (ns.HTMLTextAreaElement ?? FallbackElement) as typeof HTMLTextAreaElement;
const _HTMLTimeElement = (ns.HTMLTimeElement ?? FallbackElement) as typeof HTMLTimeElement;
const _HTMLTitleElement = (ns.HTMLTitleElement ?? FallbackElement) as typeof HTMLTitleElement;
const _HTMLTableRowElement = (ns.HTMLTableRowElement ?? FallbackElement) as typeof HTMLTableRowElement;
const _HTMLTrackElement = (ns.HTMLTrackElement ?? FallbackElement) as typeof HTMLTrackElement;
const _HTMLUListElement = (ns.HTMLUListElement ?? FallbackElement) as typeof HTMLUListElement;
const _HTMLVideoElement = (ns.HTMLVideoElement ?? FallbackElement) as typeof HTMLVideoElement;

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
