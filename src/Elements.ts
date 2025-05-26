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

const global = (isBrowser ? window : {}) as unknown as typeof window;

export const HTMLElement: (typeof globalThis)['HTMLElement'] = global.HTMLElement ?? class {};
export const HTMLAnchorElement: (typeof globalThis)['HTMLAnchorElement'] = global.HTMLAnchorElement ?? HTMLElement;
export const HTMLAreaElement: (typeof globalThis)['HTMLAreaElement'] = global.HTMLAreaElement ?? HTMLElement;
export const HTMLAudioElement: (typeof globalThis)['HTMLAudioElement'] = global.HTMLAudioElement ?? HTMLElement;
export const HTMLBaseElement: (typeof globalThis)['HTMLBaseElement'] = global.HTMLBaseElement ?? HTMLElement;
export const HTMLQuoteElement: (typeof globalThis)['HTMLQuoteElement'] = global.HTMLQuoteElement ?? HTMLElement;
export const HTMLBodyElement: (typeof globalThis)['HTMLBodyElement'] = global.HTMLBodyElement ?? HTMLElement;
export const HTMLBRElement: (typeof globalThis)['HTMLBRElement'] = global.HTMLBRElement ?? HTMLElement;
export const HTMLButtonElement: (typeof globalThis)['HTMLButtonElement'] = global.HTMLButtonElement ?? HTMLElement;
export const HTMLCanvasElement: (typeof globalThis)['HTMLCanvasElement'] = global.HTMLCanvasElement ?? HTMLElement;
export const HTMLTableCaptionElement: (typeof globalThis)['HTMLTableCaptionElement'] =
    global.HTMLTableCaptionElement ?? HTMLElement;
export const HTMLTableColElement: (typeof globalThis)['HTMLTableColElement'] =
    global.HTMLTableColElement ?? HTMLElement;
export const HTMLDataElement: (typeof globalThis)['HTMLDataElement'] = global.HTMLDataElement ?? HTMLElement;
export const HTMLDataListElement: (typeof globalThis)['HTMLDataListElement'] =
    global.HTMLDataListElement ?? HTMLElement;
export const HTMLModElement: (typeof globalThis)['HTMLModElement'] = global.HTMLModElement ?? HTMLElement;
export const HTMLDetailsElement: (typeof globalThis)['HTMLDetailsElement'] = global.HTMLDetailsElement ?? HTMLElement;
export const HTMLDialogElement: (typeof globalThis)['HTMLDialogElement'] = global.HTMLDialogElement ?? HTMLElement;
export const HTMLDirectoryElement: (typeof globalThis)['HTMLDirectoryElement'] =
    global.HTMLDirectoryElement ?? HTMLElement;
export const HTMLDivElement: (typeof globalThis)['HTMLDivElement'] = global.HTMLDivElement ?? HTMLElement;
export const HTMLDListElement: (typeof globalThis)['HTMLDListElement'] = global.HTMLDListElement ?? HTMLElement;
export const HTMLEmbedElement: (typeof globalThis)['HTMLEmbedElement'] = global.HTMLEmbedElement ?? HTMLElement;
export const HTMLFieldSetElement: (typeof globalThis)['HTMLFieldSetElement'] =
    global.HTMLFieldSetElement ?? HTMLElement;
export const HTMLFontElement: (typeof globalThis)['HTMLFontElement'] = global.HTMLFontElement ?? HTMLElement;
export const HTMLFormElement: (typeof globalThis)['HTMLFormElement'] = global.HTMLFormElement ?? HTMLElement;
export const HTMLFrameElement: (typeof globalThis)['HTMLFrameElement'] = global.HTMLFrameElement ?? HTMLElement;
export const HTMLFrameSetElement: (typeof globalThis)['HTMLFrameSetElement'] =
    global.HTMLFrameSetElement ?? HTMLElement;
export const HTMLHeadingElement: (typeof globalThis)['HTMLHeadingElement'] = global.HTMLHeadingElement ?? HTMLElement;
export const HTMLHeadElement: (typeof globalThis)['HTMLHeadElement'] = global.HTMLHeadElement ?? HTMLElement;
export const HTMLHRElement: (typeof globalThis)['HTMLHRElement'] = global.HTMLHRElement ?? HTMLElement;
export const HTMLIFrameElement: (typeof globalThis)['HTMLIFrameElement'] = global.HTMLIFrameElement ?? HTMLElement;
export const HTMLImageElement: (typeof globalThis)['HTMLImageElement'] = global.HTMLImageElement ?? HTMLElement;
export const HTMLInputElement: (typeof globalThis)['HTMLInputElement'] = global.HTMLInputElement ?? HTMLElement;
export const HTMLLabelElement: (typeof globalThis)['HTMLLabelElement'] = global.HTMLLabelElement ?? HTMLElement;
export const HTMLLegendElement: (typeof globalThis)['HTMLLegendElement'] = global.HTMLLegendElement ?? HTMLElement;
export const HTMLLIElement: (typeof globalThis)['HTMLLIElement'] = global.HTMLLIElement ?? HTMLElement;
export const HTMLLinkElement: (typeof globalThis)['HTMLLinkElement'] = global.HTMLLinkElement ?? HTMLElement;
export const HTMLMapElement: (typeof globalThis)['HTMLMapElement'] = global.HTMLMapElement ?? HTMLElement;
export const HTMLMarqueeElement: (typeof globalThis)['HTMLMarqueeElement'] = global.HTMLMarqueeElement ?? HTMLElement;
export const HTMLMenuElement: (typeof globalThis)['HTMLMenuElement'] = global.HTMLMenuElement ?? HTMLElement;
export const HTMLMetaElement: (typeof globalThis)['HTMLMetaElement'] = global.HTMLMetaElement ?? HTMLElement;
export const HTMLMeterElement: (typeof globalThis)['HTMLMeterElement'] = global.HTMLMeterElement ?? HTMLElement;
export const HTMLObjectElement: (typeof globalThis)['HTMLObjectElement'] = global.HTMLObjectElement ?? HTMLElement;
export const HTMLOListElement: (typeof globalThis)['HTMLOListElement'] = global.HTMLOListElement ?? HTMLElement;
export const HTMLOptGroupElement: (typeof globalThis)['HTMLOptGroupElement'] =
    global.HTMLOptGroupElement ?? HTMLElement;
export const HTMLOptionElement: (typeof globalThis)['HTMLOptionElement'] = global.HTMLOptionElement ?? HTMLElement;
export const HTMLOutputElement: (typeof globalThis)['HTMLOutputElement'] = global.HTMLOutputElement ?? HTMLElement;
export const HTMLParagraphElement: (typeof globalThis)['HTMLParagraphElement'] =
    global.HTMLParagraphElement ?? HTMLElement;
export const HTMLParamElement: (typeof globalThis)['HTMLParamElement'] = global.HTMLParamElement ?? HTMLElement;
export const HTMLPictureElement: (typeof globalThis)['HTMLPictureElement'] = global.HTMLPictureElement ?? HTMLElement;
export const HTMLPreElement: (typeof globalThis)['HTMLPreElement'] = global.HTMLPreElement ?? HTMLElement;
export const HTMLProgressElement: (typeof globalThis)['HTMLProgressElement'] =
    global.HTMLProgressElement ?? HTMLElement;
export const HTMLScriptElement: (typeof globalThis)['HTMLScriptElement'] = global.HTMLScriptElement ?? HTMLElement;
export const HTMLSelectElement: (typeof globalThis)['HTMLSelectElement'] = global.HTMLSelectElement ?? HTMLElement;
export const HTMLSlotElement: (typeof globalThis)['HTMLSlotElement'] = global.HTMLSlotElement ?? HTMLElement;
export const HTMLSourceElement: (typeof globalThis)['HTMLSourceElement'] = global.HTMLSourceElement ?? HTMLElement;
export const HTMLSpanElement: (typeof globalThis)['HTMLSpanElement'] = global.HTMLSpanElement ?? HTMLElement;
export const HTMLStyleElement: (typeof globalThis)['HTMLStyleElement'] = global.HTMLStyleElement ?? HTMLElement;
export const HTMLTableElement: (typeof globalThis)['HTMLTableElement'] = global.HTMLTableElement ?? HTMLElement;
export const HTMLTableSectionElement: (typeof globalThis)['HTMLTableSectionElement'] =
    global.HTMLTableSectionElement ?? HTMLElement;
export const HTMLTableCellElement: (typeof globalThis)['HTMLTableCellElement'] =
    global.HTMLTableCellElement ?? HTMLElement;
export const HTMLTemplateElement: (typeof globalThis)['HTMLTemplateElement'] =
    global.HTMLTemplateElement ?? HTMLElement;
export const HTMLTextAreaElement: (typeof globalThis)['HTMLTextAreaElement'] =
    global.HTMLTextAreaElement ?? HTMLElement;
export const HTMLTimeElement: (typeof globalThis)['HTMLTimeElement'] = global.HTMLTimeElement ?? HTMLElement;
export const HTMLTitleElement: (typeof globalThis)['HTMLTitleElement'] = global.HTMLTitleElement ?? HTMLElement;
export const HTMLTableRowElement: (typeof globalThis)['HTMLTableRowElement'] =
    global.HTMLTableRowElement ?? HTMLElement;
export const HTMLTrackElement: (typeof globalThis)['HTMLTrackElement'] = global.HTMLTrackElement ?? HTMLElement;
export const HTMLUListElement: (typeof globalThis)['HTMLUListElement'] = global.HTMLUListElement ?? HTMLElement;
export const HTMLVideoElement: (typeof globalThis)['HTMLVideoElement'] = global.HTMLVideoElement ?? HTMLElement;

/**
 * Extract the base class from a given element type.
 */
export type BaseClass<T extends HTMLElement> = T extends HTMLAnchorElement
    ? HTMLAnchorElement
    : T extends HTMLAreaElement
      ? HTMLAreaElement
      : T extends HTMLAudioElement
        ? HTMLAudioElement
        : T extends HTMLBaseElement
          ? HTMLBaseElement
          : T extends HTMLQuoteElement
            ? HTMLQuoteElement
            : T extends HTMLBodyElement
              ? HTMLBodyElement
              : T extends HTMLBRElement
                ? HTMLBRElement
                : T extends HTMLButtonElement
                  ? HTMLButtonElement
                  : T extends HTMLCanvasElement
                    ? HTMLCanvasElement
                    : T extends HTMLTableCaptionElement
                      ? HTMLTableCaptionElement
                      : T extends HTMLTableColElement
                        ? HTMLTableColElement
                        : T extends HTMLDataElement
                          ? HTMLDataElement
                          : T extends HTMLDataListElement
                            ? HTMLDataListElement
                            : T extends HTMLModElement
                              ? HTMLModElement
                              : T extends HTMLDetailsElement
                                ? HTMLDetailsElement
                                : T extends HTMLDialogElement
                                  ? HTMLDialogElement
                                  : T extends HTMLDirectoryElement
                                    ? HTMLDirectoryElement
                                    : T extends HTMLDivElement
                                      ? HTMLDivElement
                                      : T extends HTMLDListElement
                                        ? HTMLDListElement
                                        : T extends HTMLEmbedElement
                                          ? HTMLEmbedElement
                                          : T extends HTMLFieldSetElement
                                            ? HTMLFieldSetElement
                                            : T extends HTMLFontElement
                                              ? HTMLFontElement
                                              : T extends HTMLFormElement
                                                ? HTMLFormElement
                                                : T extends HTMLFrameElement
                                                  ? HTMLFrameElement
                                                  : T extends HTMLFrameSetElement
                                                    ? HTMLFrameSetElement
                                                    : T extends HTMLHeadingElement
                                                      ? HTMLHeadingElement
                                                      : T extends HTMLHeadElement
                                                        ? HTMLHeadElement
                                                        : T extends HTMLHRElement
                                                          ? HTMLHRElement
                                                          : T extends HTMLIFrameElement
                                                            ? HTMLIFrameElement
                                                            : T extends HTMLImageElement
                                                              ? HTMLImageElement
                                                              : T extends HTMLInputElement
                                                                ? HTMLInputElement
                                                                : T extends HTMLLabelElement
                                                                  ? HTMLLabelElement
                                                                  : T extends HTMLLegendElement
                                                                    ? HTMLLegendElement
                                                                    : T extends HTMLLIElement
                                                                      ? HTMLLIElement
                                                                      : T extends HTMLLinkElement
                                                                        ? HTMLLinkElement
                                                                        : T extends HTMLMapElement
                                                                          ? HTMLMapElement
                                                                          : T extends HTMLMarqueeElement
                                                                            ? HTMLMarqueeElement
                                                                            : T extends HTMLMenuElement
                                                                              ? HTMLMenuElement
                                                                              : T extends HTMLMetaElement
                                                                                ? HTMLMetaElement
                                                                                : T extends HTMLMeterElement
                                                                                  ? HTMLMeterElement
                                                                                  : T extends HTMLObjectElement
                                                                                    ? HTMLObjectElement
                                                                                    : T extends HTMLOListElement
                                                                                      ? HTMLOListElement
                                                                                      : T extends HTMLOptGroupElement
                                                                                        ? HTMLOptGroupElement
                                                                                        : T extends HTMLOptionElement
                                                                                          ? HTMLOptionElement
                                                                                          : T extends HTMLOutputElement
                                                                                            ? HTMLOutputElement
                                                                                            : T extends HTMLParagraphElement
                                                                                              ? HTMLParagraphElement
                                                                                              : T extends HTMLParamElement
                                                                                                ? HTMLParamElement
                                                                                                : T extends HTMLPictureElement
                                                                                                  ? HTMLPictureElement
                                                                                                  : T extends HTMLPreElement
                                                                                                    ? HTMLPreElement
                                                                                                    : T extends HTMLProgressElement
                                                                                                      ? HTMLProgressElement
                                                                                                      : T extends HTMLScriptElement
                                                                                                        ? HTMLScriptElement
                                                                                                        : T extends HTMLSelectElement
                                                                                                          ? HTMLSelectElement
                                                                                                          : T extends HTMLSlotElement
                                                                                                            ? HTMLSlotElement
                                                                                                            : T extends HTMLSourceElement
                                                                                                              ? HTMLSourceElement
                                                                                                              : T extends HTMLSpanElement
                                                                                                                ? HTMLSpanElement
                                                                                                                : T extends HTMLStyleElement
                                                                                                                  ? HTMLStyleElement
                                                                                                                  : T extends HTMLTableElement
                                                                                                                    ? HTMLTableElement
                                                                                                                    : T extends HTMLTableSectionElement
                                                                                                                      ? HTMLTableSectionElement
                                                                                                                      : T extends HTMLTableCellElement
                                                                                                                        ? HTMLTableCellElement
                                                                                                                        : T extends HTMLTemplateElement
                                                                                                                          ? HTMLTemplateElement
                                                                                                                          : T extends HTMLTextAreaElement
                                                                                                                            ? HTMLTextAreaElement
                                                                                                                            : T extends HTMLTimeElement
                                                                                                                              ? HTMLTimeElement
                                                                                                                              : T extends HTMLTitleElement
                                                                                                                                ? HTMLTitleElement
                                                                                                                                : T extends HTMLTableRowElement
                                                                                                                                  ? HTMLTableRowElement
                                                                                                                                  : T extends HTMLTrackElement
                                                                                                                                    ? HTMLTrackElement
                                                                                                                                    : T extends HTMLUListElement
                                                                                                                                      ? HTMLUListElement
                                                                                                                                      : T extends HTMLVideoElement
                                                                                                                                        ? HTMLVideoElement
                                                                                                                                        : HTMLElement;
