/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import { type Observable } from './Observable';
import { type FunctionComponent } from './FunctionComponent';
import { customElements, type CustomElement } from './CustomElementRegistry';
import { type HTMLTagNameMap, type SVGTagNameMap } from './Elements';
import { type SVGAttributes, type HTMLAttributes, type IntrinsicElementAttributes } from './Attributes';
import { type Props } from './property';
import { isArray, isNode } from './helpers';
import { isComponentConstructor, type ComponentConstructor, type ComponentInstance } from './Component';

/**
 * Identify virtual dom objects.
 */
export const V_SYM: unique symbol = Symbol();

/**
 * A constructor alias used for JSX fragments </>.
 */
export const Fragment: unique symbol = Symbol();

/**
 * Classes dictionary.
 */
export type VClasses = string | Record<string, boolean | undefined>;

/**
 * Styles dictionary.
 */
export type VStyle = string | Record<string, string | undefined>;

/**
 * Get all the property keys that extends a builtin element.
 */
export type GetCustomElementsProps<T extends keyof HTMLTagNameMap> = Exclude<{
    [K in keyof JSXInternal.CustomElements]:
        'extends' extends keyof JSXInternal.CustomElements[K] ?
            JSXInternal.CustomElements[K]['extends'] extends T ?
                { is: K } & (Props<JSXInternal.CustomElements[K]>) :
                never :
            never;
}[keyof JSXInternal.CustomElements], never>;

/**
 * Get prototype properties that can be assigned to the node.
 */
export type VProps<
    T extends typeof Fragment | FunctionComponent | ComponentConstructor | Element | keyof HTMLTagNameMap | keyof SVGTagNameMap
> = T extends keyof JSXInternal.CustomElements ? (JSXInternal.CustomElements[T] extends CustomElement ? Props<JSXInternal.CustomElements[T]> : never) :
    T extends FunctionComponent ? Parameters<T>[0] :
    T extends ComponentInstance ? Props<T> :
    T extends ComponentConstructor ? Props<InstanceType<T>> :
    T extends keyof HTMLTagNameMap ? ({ is?: never } | GetCustomElementsProps<T>) :
    {};

/**
 * Get HTML attributes by prototype.
 */
type GetHTMLAttrs<
    T extends HTMLElement
> = {
    [K in keyof HTMLTagNameMap]: HTMLTagNameMap[K] extends T ? IntrinsicElementAttributes[K] : HTMLAttributes;
}[keyof HTMLTagNameMap];

/**
 * Get SVG attributes by prototype.
 */
type GetSVGAttrs<
    T extends SVGElement
> = {
    [K in keyof SVGTagNameMap]: SVGTagNameMap[K] extends T ? IntrinsicElementAttributes[K] : SVGAttributes;
}[keyof SVGTagNameMap];

/**
 * Get a list of html attributes that can be assigned to the node.
 */
export type VAttrs<
    T extends typeof Fragment | FunctionComponent | ComponentConstructor | Element | keyof HTMLTagNameMap | keyof SVGTagNameMap,
> = T extends keyof HTMLTagNameMap ? IntrinsicElementAttributes[T] :
    T extends keyof SVGTagNameMap ? IntrinsicElementAttributes[T] :
    T extends HTMLElement ? GetHTMLAttrs<T> :
    T extends SVGElement ? GetSVGAttrs<T> :
    T extends Element ? HTMLAttributes :
    T extends ComponentConstructor ? HTMLAttributes :
    {};

/**
 * Special virtual properties.
 */
export type VRender = {
    slot?: string;
    key?: unknown;
    xmlns?: string;
    ref?: Element;
    children?: Template | Template[];
    class?: VClasses;
    style?: VStyle;
    [listener: `on${string}`]: EventListener | undefined;
};

/**
 * Properties that can be assigned to a node through the render engine.
 */
export type VProperties<
    T extends typeof Fragment | FunctionComponent | ComponentConstructor | Element | keyof HTMLTagNameMap | keyof SVGTagNameMap = Element,
> = VProps<T> & VAttrs<T> & VRender;

/**
 * The interface of a JSX fragment node.
 */
export type VFragment = {
    type: typeof Fragment;
    key: unknown;
    properties: {};
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a functional component.
 */
export type VFunction<T extends FunctionComponent> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of an HTML node used as JSX tag.
 */
export type VElement<T extends Element> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a Component constructor used as JSX tag.
 */
export type VComponent<T extends ComponentConstructor> = {
    type: T;
    key?: unknown;
    namespace?: string;
    properties: VProperties<InstanceType<T>>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of slot element.
 */
export type VSlot = {
    type: 'slot';
    key: unknown;
    properties: VProperties<'slot'>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of a generic JSX tag.
 */
export type VTag<T extends keyof HTMLTagNameMap | keyof SVGTagNameMap> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: VProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Generic virtual dom object.
 */
export type VObject = VFunction<FunctionComponent>
    | VComponent<ComponentConstructor>
    | VElement<Element>
    | VSlot
    | VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap>
    | VFragment;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export type Template =
    Element
    | Text
    | Node
    | VFragment
    | VFunction<FunctionComponent>
    | VComponent<ComponentConstructor>
    | VElement<Element>
    | VSlot
    | VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap>
    | Promise<unknown>
    | Observable<unknown>
    | string
    | number
    | boolean
    | undefined
    | null
    | Template[];

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 * @returns True if the target is a virtual DOM object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isVObject = (target: any): target is VObject => !!target[V_SYM];

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 * @returns True if the target is a fragment.
 */
export const isVFragment = (target: VObject): target is VFragment => target.type === Fragment;

/**
 * Check if the current virtual node is a functional component.
 * @param target The node to check.
 * @returns True if the target is a functional component.
 */
export const isVFunction = (target: VObject): target is VFunction<FunctionComponent> => typeof target.type === 'function' && !isComponentConstructor(target.type);

/**
 * Check if the current virtual node is a Component.
 * @param target The node to check.
 * @returns True if the target is a Component node.
 */
export const isVComponent = (target: VObject): target is VComponent<ComponentConstructor> => typeof target.type === 'function' && isComponentConstructor(target.type);

/**
 * Check if the current virtual node is an HTML node instance.
 * @param target The node to check.
 * @returns True if the target is an HTML node instance.
 */
export const isVNode = (target: VObject): target is VElement<Element> => isNode(target.type);

/**
 * Check if the current virtual node is a slot element.
 * @param target The node to check.
 * @returns True if the target is a slot element.
 */
export const isVSlot = (target: VObject): target is VSlot => target.type === 'slot';

/**
 * Check if the current virtual node is a generic tag to render.
 * @param target The node to check.
 * @returns True if the target is a generic tag to render.
 */
export const isVTag = (target: VObject): target is VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap> => typeof target.type === 'string';

/**
 * Function factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 * @returns The virtual DOM object.
 */
function h<T extends typeof Fragment | FunctionComponent | ComponentConstructor | Element | keyof HTMLTagNameMap | keyof SVGTagNameMap>(
    tagOrComponent: T,
    properties: VProperties<T> | null = null,
    ...children: Template[]
) {
    const { children: propertiesChildren } = (properties || {}) as VProperties<T>;
    children = propertiesChildren as Template[] || children;

    const normalizedProperties: Record<string, unknown> = {};

    let key: unknown;
    let is: string|undefined;
    let xmlns: string|undefined;
    let ref: Element|undefined;
    for (const k in properties) {
        if (k === 'is') {
            is = properties.is;
        } else if (k === 'xmlns') {
            xmlns = properties.xmlns;
        } else if (k === 'ref') {
            ref = properties.ref;
        } else if (k === 'key') {
            key = properties.key;
        } else if (k === 'children') {
            // ensure children is array (jsx automatic runtime flats children)
            children = isArray(properties.children) ? properties.children : [properties.children] as Template[];
        } else {
            normalizedProperties[k] = properties[k as keyof HTMLAttributes];
        }
    }

    if (is) {
        tagOrComponent = customElements.get(is) as T || tagOrComponent;
    } else if (typeof tagOrComponent === 'string') {
        tagOrComponent = customElements.get(tagOrComponent) as T || tagOrComponent;
    }

    const vnode = {
        type: ref || tagOrComponent,
        key,
        children,
        properties: normalizedProperties,
        namespace: (tagOrComponent as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : xmlns,
        [V_SYM]: true,
    } as (typeof tagOrComponent extends typeof Fragment ? VFragment : VObject);

    return vnode;
}

/**
 * Function factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param key The Node key reference.
 * @returns The virtual DOM object.
 */
function jsx(
    tagOrComponent: typeof Fragment | FunctionComponent | ComponentConstructor | Element | string,
    properties: VProperties | null = null,
    key?: unknown
) {
    properties = properties || {};
    if (key) {
        properties.key = key;
    }
    return h(tagOrComponent as 'div', properties as VProperties<'div'>);
}

const jsxs = jsx;
const jsxDEV = jsx;

export { h, jsx, jsxs, jsxDEV };

/**
 * The internal JSX namespace.
 */
export namespace JSXInternal {
    export interface CustomElements {}

    export type Element = Template;

    export interface ElementClass extends HTMLElement { }

    export interface ElementAttributesProperty { __jsx_properties__: {} }

    export type IntrinsicElements = {
        [K in keyof CustomElements]:
            'extends' extends keyof JSXInternal.CustomElements[K] ?
                never :
                VProperties<CustomElements[K]>;
    } & {
        [K in keyof HTMLTagNameMap]: VProperties<K>;
    } & {
        [K in keyof SVGTagNameMap]: VProperties<K>
    };
}

/**
 * Configure JSX support.
 */
declare global {
    namespace JSX {
        type Element = JSXInternal.Element;
        type IntrinsicElements = JSXInternal.IntrinsicElements;
        interface ElementClass extends JSXInternal.ElementClass {}
        interface ElementAttributesProperty extends JSXInternal.ElementAttributesProperty {}
    }

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements { }
}
