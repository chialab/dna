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

const FallbackElement = class FallbackElement {};

export const {
    HTMLElement = FallbackElement as (typeof globalThis)['HTMLElement'],
    HTMLAnchorElement = HTMLElement as (typeof globalThis)['HTMLAnchorElement'],
    HTMLAreaElement = HTMLElement as (typeof globalThis)['HTMLAreaElement'],
    HTMLAudioElement = HTMLElement as (typeof globalThis)['HTMLAudioElement'],
    HTMLBaseElement = HTMLElement as (typeof globalThis)['HTMLBaseElement'],
    HTMLQuoteElement = HTMLElement as (typeof globalThis)['HTMLQuoteElement'],
    HTMLBodyElement = HTMLElement as (typeof globalThis)['HTMLBodyElement'],
    HTMLBRElement = HTMLElement as (typeof globalThis)['HTMLBRElement'],
    HTMLButtonElement = HTMLElement as (typeof globalThis)['HTMLButtonElement'],
    HTMLCanvasElement = HTMLElement as (typeof globalThis)['HTMLCanvasElement'],
    HTMLTableCaptionElement = HTMLElement as (typeof globalThis)['HTMLTableCaptionElement'],
    HTMLTableColElement = HTMLElement as (typeof globalThis)['HTMLTableColElement'],
    HTMLDataElement = HTMLElement as (typeof globalThis)['HTMLDataElement'],
    HTMLDataListElement = HTMLElement as (typeof globalThis)['HTMLDataListElement'],
    HTMLModElement = HTMLElement as (typeof globalThis)['HTMLModElement'],
    HTMLDetailsElement = HTMLElement as (typeof globalThis)['HTMLDetailsElement'],
    HTMLDialogElement = HTMLElement as (typeof globalThis)['HTMLDialogElement'],
    HTMLDirectoryElement = HTMLElement as (typeof globalThis)['HTMLDirectoryElement'],
    HTMLDivElement = HTMLElement as (typeof globalThis)['HTMLDivElement'],
    HTMLDListElement = HTMLElement as (typeof globalThis)['HTMLDListElement'],
    HTMLEmbedElement = HTMLElement as (typeof globalThis)['HTMLEmbedElement'],
    HTMLFieldSetElement = HTMLElement as (typeof globalThis)['HTMLFieldSetElement'],
    HTMLFontElement = HTMLElement as (typeof globalThis)['HTMLFontElement'],
    HTMLFormElement = HTMLElement as (typeof globalThis)['HTMLFormElement'],
    HTMLFrameElement = HTMLElement as (typeof globalThis)['HTMLFrameElement'],
    HTMLFrameSetElement = HTMLElement as (typeof globalThis)['HTMLFrameSetElement'],
    HTMLHeadingElement = HTMLElement as (typeof globalThis)['HTMLHeadingElement'],
    HTMLHeadElement = HTMLElement as (typeof globalThis)['HTMLHeadElement'],
    HTMLHRElement = HTMLElement as (typeof globalThis)['HTMLHRElement'],
    HTMLIFrameElement = HTMLElement as (typeof globalThis)['HTMLIFrameElement'],
    HTMLImageElement = HTMLElement as (typeof globalThis)['HTMLImageElement'],
    HTMLInputElement = HTMLElement as (typeof globalThis)['HTMLInputElement'],
    HTMLLabelElement = HTMLElement as (typeof globalThis)['HTMLLabelElement'],
    HTMLLegendElement = HTMLElement as (typeof globalThis)['HTMLLegendElement'],
    HTMLLIElement = HTMLElement as (typeof globalThis)['HTMLLIElement'],
    HTMLLinkElement = HTMLElement as (typeof globalThis)['HTMLLinkElement'],
    HTMLMapElement = HTMLElement as (typeof globalThis)['HTMLMapElement'],
    HTMLMarqueeElement = HTMLElement as (typeof globalThis)['HTMLMarqueeElement'],
    HTMLMenuElement = HTMLElement as (typeof globalThis)['HTMLMenuElement'],
    HTMLMetaElement = HTMLElement as (typeof globalThis)['HTMLMetaElement'],
    HTMLMeterElement = HTMLElement as (typeof globalThis)['HTMLMeterElement'],
    HTMLObjectElement = HTMLElement as (typeof globalThis)['HTMLObjectElement'],
    HTMLOListElement = HTMLElement as (typeof globalThis)['HTMLOListElement'],
    HTMLOptGroupElement = HTMLElement as (typeof globalThis)['HTMLOptGroupElement'],
    HTMLOptionElement = HTMLElement as (typeof globalThis)['HTMLOptionElement'],
    HTMLOutputElement = HTMLElement as (typeof globalThis)['HTMLOutputElement'],
    HTMLParagraphElement = HTMLElement as (typeof globalThis)['HTMLParagraphElement'],
    HTMLParamElement = HTMLElement as (typeof globalThis)['HTMLParamElement'],
    HTMLPictureElement = HTMLElement as (typeof globalThis)['HTMLPictureElement'],
    HTMLPreElement = HTMLElement as (typeof globalThis)['HTMLPreElement'],
    HTMLProgressElement = HTMLElement as (typeof globalThis)['HTMLProgressElement'],
    HTMLScriptElement = HTMLElement as (typeof globalThis)['HTMLScriptElement'],
    HTMLSelectElement = HTMLElement as (typeof globalThis)['HTMLSelectElement'],
    HTMLSlotElement = HTMLElement as (typeof globalThis)['HTMLSlotElement'],
    HTMLSourceElement = HTMLElement as (typeof globalThis)['HTMLSourceElement'],
    HTMLSpanElement = HTMLElement as (typeof globalThis)['HTMLSpanElement'],
    HTMLStyleElement = HTMLElement as (typeof globalThis)['HTMLStyleElement'],
    HTMLTableElement = HTMLElement as (typeof globalThis)['HTMLTableElement'],
    HTMLTableSectionElement = HTMLElement as (typeof globalThis)['HTMLTableSectionElement'],
    HTMLTableCellElement = HTMLElement as (typeof globalThis)['HTMLTableCellElement'],
    HTMLTemplateElement = HTMLElement as (typeof globalThis)['HTMLTemplateElement'],
    HTMLTextAreaElement = HTMLElement as (typeof globalThis)['HTMLTextAreaElement'],
    HTMLTimeElement = HTMLElement as (typeof globalThis)['HTMLTimeElement'],
    HTMLTitleElement = HTMLElement as (typeof globalThis)['HTMLTitleElement'],
    HTMLTableRowElement = HTMLElement as (typeof globalThis)['HTMLTableRowElement'],
    HTMLTrackElement = HTMLElement as (typeof globalThis)['HTMLTrackElement'],
    HTMLUListElement = HTMLElement as (typeof globalThis)['HTMLUListElement'],
    HTMLVideoElement = HTMLElement as (typeof globalThis)['HTMLVideoElement'],
} = (isBrowser ? window : {}) as unknown as typeof window;
