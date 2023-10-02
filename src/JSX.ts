/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import { type HTMLAttributes, type IntrinsicElementAttributes } from './Attributes';
import { isComponentConstructor, type ComponentConstructor } from './Component';
import { type HTMLTagNameMap, type SVGTagNameMap } from './Elements';
import { type FunctionComponent } from './FunctionComponent';
import { isArray, isNode } from './helpers';
import { type Observable } from './Observable';
import { type Props } from './property';

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
export type GetCustomElementsProps<T extends keyof HTMLTagNameMap> = Exclude<
    {
        [K in keyof JSXInternal.CustomElements]: 'extends' extends keyof JSXInternal.CustomElements[K]
            ? JSXInternal.CustomElements[K]['extends'] extends T
                ? { is: K } & Props<JSXInternal.CustomElements[K]>
                : never
            : never;
    }[keyof JSXInternal.CustomElements],
    never
>;

/**
 * Get HTML attributes by prototype.
 */
type ElementAttributes<T extends Element> = {
    [K in keyof HTMLTagNameMap]: HTMLTagNameMap[K] extends T ? IntrinsicElementAttributes[K] : HTMLAttributes;
}[keyof HTMLTagNameMap];

/**
 * Get render attributes set.
 */
export type AttributeProperties<T, A> = T & Omit<A, 'style' | 'class' | keyof T>;

/**
 * Get render properties for keyed nodes.
 */
export type KeyedProperties = {
    key?: unknown;
};

/**
 * Get render properties for tree nodes.
 */
export type TreeProperties = {
    children?: Template | Template[];
};

/**
 * Get render properties for event listeners.
 */
export type EventProperties = {
    [listener: `on${string}`]: EventListener | undefined;
};

/**
 * Get render properties for dom nodes.
 */
export type ElementProperties = {
    slot?: string;
    class?: string | Record<string, boolean | undefined>;
    style?: string | Record<string, string | undefined>;
    xmlns?: string;
    ref?: Element;
};

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
    properties: Parameters<T>[0] & KeyedProperties & TreeProperties;
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
    properties: AttributeProperties<Props<T>, ElementAttributes<T>> &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties;
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
    properties: AttributeProperties<Props<InstanceType<T>>, HTMLAttributes> &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties;
    children: Template[];
    [V_SYM]: true;
};

/**
 * The interface of slot element.
 */
export type VSlot = {
    type: 'slot';
    key: unknown;
    properties: AttributeProperties<Props<HTMLSlotElement>, IntrinsicElementAttributes['slot']> &
        KeyedProperties &
        TreeProperties &
        EventProperties;
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
    properties: AttributeProperties<
        T extends keyof HTMLTagNameMap
            ? Props<HTMLTagNameMap[T]>
            : T extends keyof SVGTagNameMap
            ? Props<SVGTagNameMap[T]>
            : Props<HTMLElement>,
        IntrinsicElementAttributes[T]
    > &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Generic virtual dom object.
 */
export type VObject =
    | VFunction<FunctionComponent>
    | VComponent<ComponentConstructor>
    | VElement<Element>
    | VSlot
    | VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap>
    | VFragment;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export type Template =
    | Element
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
export const isVFunction = (target: VObject): target is VFunction<FunctionComponent> =>
    typeof target.type === 'function' && !isComponentConstructor(target.type);

/**
 * Check if the current virtual node is a Component.
 * @param target The node to check.
 * @returns True if the target is a Component node.
 */
export const isVComponent = (target: VObject): target is VComponent<ComponentConstructor> =>
    typeof target.type === 'function' && isComponentConstructor(target.type);

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
export const isVTag = (target: VObject): target is VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap> =>
    typeof target.type === 'string';

function h(tagOrComponent: typeof Fragment, properties?: null, ...children: Template[]): VFragment;
function h<T extends FunctionComponent>(
    tagOrComponent: T,
    properties: Parameters<T>[0] & KeyedProperties & TreeProperties,
    ...children: Template[]
): VFunction<T>;
function h<T extends ComponentConstructor>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<InstanceType<T>>, HTMLAttributes> &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties,
    ...children: Template[]
): VComponent<T>;
function h<T extends Element>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<T>, ElementAttributes<T>> &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties,
    ...children: Template[]
): VElement<T>;
function h<T extends keyof SVGTagNameMap>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<SVGTagNameMap[T]>, IntrinsicElementAttributes[T]> &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties,
    ...children: Template[]
): VTag<T>;
function h<T extends keyof HTMLTagNameMap>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<HTMLTagNameMap[T]>, IntrinsicElementAttributes[T]> &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties,
    ...children: Template[]
): VTag<T>;
/**
 * Function factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 * @returns The virtual DOM object.
 */
function h<
    T extends
        | typeof Fragment
        | FunctionComponent
        | ComponentConstructor
        | Element
        | keyof HTMLTagNameMap
        | keyof SVGTagNameMap,
>(
    tagOrComponent: T,
    properties:
        | (AttributeProperties<Props<HTMLElement>, HTMLAttributes> &
              KeyedProperties &
              TreeProperties &
              ElementProperties)
        | null = null,
    ...children: Template[]
) {
    const { children: propertiesChildren } = (properties || {}) as TreeProperties;
    children = (propertiesChildren as Template[]) || children;

    const normalizedProperties: Record<string, unknown> = {};

    let key: unknown;
    let is: string | undefined;
    let xmlns: string | undefined;
    let ref: Element | undefined;
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
            children = isArray(properties.children) ? properties.children : ([properties.children] as Template[]);
        } else {
            normalizedProperties[k] = properties[k as keyof typeof properties];
        }
    }

    if (is) {
        tagOrComponent = (customElements.get(is) as T) || tagOrComponent;
    } else if (typeof tagOrComponent === 'string') {
        tagOrComponent = (customElements.get(tagOrComponent) as T) || tagOrComponent;
    }

    const vnode = {
        type: ref || tagOrComponent,
        key,
        children,
        properties: normalizedProperties,
        namespace: (tagOrComponent as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : xmlns,
        [V_SYM]: true,
    } as typeof tagOrComponent extends typeof Fragment ? VFragment : VObject;

    return vnode;
}

function jsx<T extends FunctionComponent>(
    tagOrComponent: T,
    properties: Parameters<T>[0] & TreeProperties,
    key?: unknown
): VFunction<T>;
function jsx<T extends ComponentConstructor>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<InstanceType<T>>, HTMLAttributes> &
        TreeProperties &
        EventProperties &
        ElementProperties,
    key?: unknown
): VComponent<T>;
function jsx<T extends Element>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<T>, ElementAttributes<T>> &
        TreeProperties &
        EventProperties &
        ElementProperties,
    key?: unknown
): VElement<T>;
function jsx<T extends keyof SVGTagNameMap>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<SVGTagNameMap[T]>, IntrinsicElementAttributes[T]> &
        TreeProperties &
        EventProperties &
        ElementProperties,
    key?: unknown
): VTag<T>;
function jsx<T extends keyof HTMLTagNameMap>(
    tagOrComponent: T,
    properties: AttributeProperties<Props<HTMLTagNameMap[T]>, IntrinsicElementAttributes[T]> &
        TreeProperties &
        EventProperties &
        ElementProperties,
    key?: unknown
): VTag<T>;
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
    properties: (KeyedProperties & TreeProperties) | null = null,
    key?: unknown
) {
    properties = properties || {};
    if (key) {
        properties.key = key;
    }
    return h(tagOrComponent as 'div', properties);
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

    export interface ElementClass extends HTMLElement {}

    export interface ElementAttributesProperty {
        __jsxProperties__: {};
    }

    export type IntrinsicElements = {
        [key: string]: HTMLAttributes & KeyedProperties & TreeProperties & EventProperties & ElementProperties;
    } & {
        [K in keyof CustomElements]: 'extends' extends keyof JSXInternal.CustomElements[K]
            ? never
            : AttributeProperties<Props<CustomElements[K]>, HTMLAttributes> &
                  KeyedProperties &
                  TreeProperties &
                  EventProperties &
                  ElementProperties;
    } & {
        [K in keyof HTMLTagNameMap]: AttributeProperties<
            ({ is?: never } & Props<HTMLTagNameMap[K]>) | GetCustomElementsProps<K>,
            IntrinsicElementAttributes[K]
        > &
            KeyedProperties &
            TreeProperties &
            EventProperties &
            ElementProperties;
    } & {
        [K in keyof SVGTagNameMap]: AttributeProperties<Props<SVGTagNameMap[K]>, IntrinsicElementAttributes[K]> &
            KeyedProperties &
            TreeProperties &
            EventProperties &
            ElementProperties;
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

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements {}
}
