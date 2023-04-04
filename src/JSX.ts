/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import { type Observable } from './Observable';
import { type FunctionComponent } from './FunctionComponent';
import { type CustomElementConstructor, customElements, isCustomElementConstructor } from './CustomElementRegistry';
import { type HTMLTagNameMap, type SVGTagNameMap } from './Elements';
import { type HTMLAttributes, type SVGAttributes, type IntrinsicElementAttributes } from './Attributes';
import { type Props } from './Component';
import { isArray, isNode } from './helpers';

/**
 * Identify virtual dom objects.
 */
export const V_SYM: unique symbol = Symbol();

/**
 * A constructor alias used for JSX fragments </>.
 */
export const Fragment: unique symbol = Symbol();

/**
 * Get all the property keys that extends a builtin element.
 */
export type ExtractCustomElementsKeys<T extends keyof HTMLTagNameMap> = Exclude<{
    [K in keyof JSXInternal.CustomElements]:
        'extends' extends keyof JSXInternal.CustomElements[K] ?
            JSXInternal.CustomElements[K]['extends'] extends T ?
                (keyof Props<JSXInternal.CustomElements[K]>) :
                never :
            never;
}[keyof JSXInternal.CustomElements], never | keyof VRenderProperties | 'extends' | keyof Props<HTMLTagNameMap[T]>>;

/**
 * Classes dictionary.
 */
export type VClasses = string
    | { [key: string]: boolean | undefined };

/**
 * Styles dictionary.
 */
export type VStyle = string
    | { [key: string]: string | undefined };

/**
 * Special virtual properties.
 */
export type VRenderProperties = {
    is?: string;
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
 * Get prototype properties that can be assigned to the node.
 */
export type VProps<T> = Omit<
    T extends keyof HTMLTagNameMap ? Props<HTMLTagNameMap[T]> :
    T extends keyof SVGTagNameMap ? Props<SVGTagNameMap[T]> :
    T extends Element ? Props<T> :
    T extends FunctionComponent ? Parameters<T>[0] :
    T extends string ? Props<HTMLElement> :
    T,
    keyof VRenderProperties
> & (
    T extends keyof HTMLTagNameMap ? { is?: never } & {
        [K in ExtractCustomElementsKeys<T>]?: never;
    } :
    T extends keyof SVGTagNameMap ? { is?: never } :
    T extends Element ? { is?: never } :
    { is?: unknown }
);

/**
 * Get a list of html attributes that can be assigned to the node.
 */
export type VAttrs<T, E> = Omit<
    E extends keyof HTMLTagNameMap ? IntrinsicElementAttributes[E] :
    E extends keyof SVGTagNameMap ? IntrinsicElementAttributes[E] :
    T extends keyof HTMLTagNameMap ? IntrinsicElementAttributes[T] :
    T extends keyof SVGTagNameMap ? IntrinsicElementAttributes[T] :
    T extends SVGElement ? SVGAttributes :
    T extends Element ? HTMLAttributes :
    T extends string ? HTMLAttributes :
    {},
    keyof VRenderProperties
>;

/**
 * Get all valid prototypes properties that extends a builtin element.
 */
export type VExtends<T> =
    Exclude<
        {
            [K in keyof JSXInternal.CustomElements]:
                'extends' extends keyof JSXInternal.CustomElements[K] ?
                    JSXInternal.CustomElements[K]['extends'] extends T ?
                        (
                            { is: K }
                            & Omit<Props<JSXInternal.CustomElements[K]>, keyof VRenderProperties | 'extends'>
                            & VAttrs<JSXInternal.CustomElements[K], JSXInternal.CustomElements[K]['extends']>
                            & VRenderProperties
                        ) :
                        never :
                    never;
        }[keyof JSXInternal.CustomElements],
        never
    >;

/**
 * Properties that can be assigned to a node through the render engine.
 */
export type VProperties<
    TagOrFunctionOrProps = { [key: string]: unknown },
    Extends extends string | null = null
> = TagOrFunctionOrProps extends string ?
        (
            (VProps<TagOrFunctionOrProps>
            & VAttrs<TagOrFunctionOrProps, Extends>
            & VRenderProperties)
            | VExtends<TagOrFunctionOrProps>
        ) : (
            VProps<TagOrFunctionOrProps>
            & VAttrs<TagOrFunctionOrProps, Extends>
            & VRenderProperties
        );

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
export type VComponent<T extends CustomElementConstructor> = {
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
export type VTag<T extends string> = {
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
    | VComponent<CustomElementConstructor>
    | VElement<Element>
    | VSlot
    | VTag<string>
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
    | VComponent<CustomElementConstructor>
    | VElement<Element>
    | VSlot
    | VTag<string>
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
export const isVFunction = (target: VObject): target is VFunction<FunctionComponent> => typeof target.type === 'function' && !isCustomElementConstructor(target.type);

/**
 * Check if the current virtual node is a Component.
 * @param target The node to check.
 * @returns True if the target is a Component node.
 */
export const isVComponent = (target: VObject): target is VComponent<CustomElementConstructor> => typeof target.type === 'function' && isCustomElementConstructor(target.type);

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
export const isVTag = (target: VObject): target is VTag<string> => typeof target.type === 'string';

function h(tagOrComponent: typeof Fragment): VFragment;
function h(tagOrComponent: typeof Fragment, properties: null, ...children: Template[]): VFragment;
function h<T extends FunctionComponent>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VFunction<T>;
function h<T extends CustomElementConstructor>(tagOrComponent: T, properties?: VProperties<InstanceType<T>> | null, ...children: Template[]): VComponent<T>;
/**
 * @deprecated Use the `ref` property instead.
 */
function h<T extends Element>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VElement<T>;
function h(tagOrComponent: 'slot', properties?: VProperties<'slot'> | null, ...children: Template[]): VSlot;
function h<T extends string>(tagOrComponent: T, properties?: VProperties<T> | null, ...children: Template[]): VTag<T>;
/**
 * Function factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 * @returns The virtual DOM object.
 */
function h(
    tagOrComponent: typeof Fragment | FunctionComponent | CustomElementConstructor | Element | string,
    properties: VProperties | null = null,
    ...children: Template[]
) {
    const { children: propertiesChildren } = (properties || {});
    children = propertiesChildren as Template[] || children;

    const normalizedProperties: { [key: string]: unknown } = {};

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
            normalizedProperties[k] = properties[k];
        }
    }

    if (is) {
        tagOrComponent = customElements.get(is) || tagOrComponent;
    } else if (typeof tagOrComponent === 'string') {
        tagOrComponent = customElements.get(tagOrComponent) || tagOrComponent;
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
    tagOrComponent: typeof Fragment | FunctionComponent | CustomElementConstructor | Element | string,
    properties: VProperties | null = null,
    key?: unknown
) {
    properties = properties || {};
    if (key) {
        properties.key = key;
    }
    return h(tagOrComponent as string, properties as VProperties<string>);
}

const jsxs = jsx;
const jsxDEV = jsx;

export { h, jsx, jsxs, jsxDEV };

/**
 * The internal JSX namespace.
 */
export namespace JSXInternal {
    export interface CustomElements { }

    export type Element = Template;

    export type IntrinsicElements = {
        [K in keyof CustomElements]:
            'extends' extends keyof JSXInternal.CustomElements[K] ?
                never :
                VProperties<CustomElements[K]>;
    } & {
        [K in keyof HTMLTagNameMap]: VProperties<K>;
    } & {
        [K in keyof SVGTagNameMap]: VProperties<SVGTagNameMap[K]>
    };
}

/**
 * Configure JSX support.
 */
declare global {
    namespace JSX {
        type Element = JSXInternal.Element;
        type IntrinsicElements = JSXInternal.IntrinsicElements;
    }

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements { }
}
