/**
 * Decorator class element descriptor.
 */
export interface ClassElement {
    /**
     * The kind of the class element.
     */
    kind: 'field' | 'method';
    /**
     * The name of the element.
     */
    key: PropertyKey;
    /**
     * The type of the element.
     */
    placement: 'static' | 'prototype' | 'own';
    /**
     * An initializer function.
     */
    initializer?: Function;
    /**
     * The element property descriptor.
     */
    descriptor?: PropertyDescriptor;
    /**
     * The descriptor finisher method.
     */
    finisher?: (constructor: Function) => void;
}

/**
 * The class descriptor interface.
 */
export type ClassDescriptor = {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(constructor: { new(): T }) => void | { new(): T };
};

/**
 * Constructor type helper.
 */
export type Constructor<T> = {
    new(...args: any[]): T;
    prototype: T;
};

/**
 * A list of valid tag names.
 */
export type ElementTagNameMap = HTMLElementTagNameMap & {
    'big': HTMLElement;
    'keygen': HTMLElement;
    'menuitem': HTMLElement;
    'noindex': HTMLElement;

    'animate': SVGElement;
    'animateMotion': SVGElement;
    'animateTransform': SVGElement;
    'circle': SVGCircleElement;
    'clipPath': SVGClipPathElement;
    'defs': SVGDefsElement;
    'desc': SVGDescElement;
    'ellipse': SVGEllipseElement;
    'feBlend': SVGFEBlendElement;
    'feColorMatrix': SVGFEColorMatrixElement;
    'feComponentTransfer': SVGFEComponentTransferElement;
    'feComposite': SVGFECompositeElement;
    'feConvolveMatrix': SVGFEConvolveMatrixElement;
    'feDiffuseLighting': SVGFEDiffuseLightingElement;
    'feDisplacementMap': SVGFEDisplacementMapElement;
    'feDistantLight': SVGFEDistantLightElement;
    'feDropShadow': SVGElement;
    'feFlood': SVGFEFloodElement;
    'feFuncA': SVGFEFuncAElement;
    'feFuncB': SVGFEFuncBElement;
    'feFuncG': SVGFEFuncGElement;
    'feFuncR': SVGFEFuncRElement;
    'feGaussianBlur': SVGFEGaussianBlurElement;
    'feImage': SVGFEImageElement;
    'feMerge': SVGFEMergeElement;
    'feMergeNode': SVGFEMergeNodeElement;
    'feMorphology': SVGFEMorphologyElement;
    'feOffset': SVGFEOffsetElement;
    'fePointLight': SVGFEPointLightElement;
    'feSpecularLighting': SVGFESpecularLightingElement;
    'feSpotLight': SVGFESpotLightElement;
    'feTile': SVGFETileElement;
    'feTurbulence': SVGFETurbulenceElement;
    'filter': SVGFilterElement;
    'foreignObject': SVGForeignObjectElement;
    'g': SVGGElement;
    'image': SVGImageElement;
    'line': SVGLineElement;
    'linearGradient': SVGLinearGradientElement;
    'marker': SVGMarkerElement;
    'mask': SVGMaskElement;
    'metadata': SVGMetadataElement;
    'mpath': SVGElement;
    'path': SVGPathElement;
    'pattern': SVGPatternElement;
    'polygon': SVGPolygonElement;
    'polyline': SVGPolylineElement;
    'radialGradient': SVGRadialGradientElement;
    'rect': SVGRectElement;
    'stop': SVGStopElement;
    'svg': SVGElement;
    'switch': SVGSwitchElement;
    'symbol': SVGSymbolElement;
    'text': SVGTextElement;
    'textPath': SVGTextPathElement;
    'tspan': SVGTSpanElement;
    'use': SVGUseElement;
    'view': SVGViewElement;
};

/**
 * A Node.prototype.childNodes like interface.
 */
export type IterableNodeList = Node[] & {
    item(index: number): Node | null;
};
