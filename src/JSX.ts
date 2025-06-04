import htm from 'htm';
import type { ElementAttributes, HTMLAttributes, IntrinsicElementAttributes } from './Attributes';
import type { BaseClass, HTMLTagNameMap, SVGTagNameMap } from './Elements';
import type { HTML } from './HTML';
import type { Effect } from './Hooks';
import type { Context } from './render';

/**
 * Identify virtual dom objects.
 */
const V_SYM: unique symbol = Symbol();

/**
 * Check if a property is a method.
 */
// biome-ignore lint/suspicious/noExplicitAny: We really check any kind of function here.
type IfMethod<T, K extends keyof T, A, B> = T[K] extends (...args: any[]) => any ? A : B;

/**
 * Check if a property is any.
 */
type IfAny<T, K extends keyof T, A, B> = 0 extends 1 & T[K] ? A : B;

/**
 * Exclude component mixin properties.
 */
type ReservedKeys =
    | 'extends'
    | 'realm'
    | 'collectingUpdates'
    | 'updateScheduled'
    | 'is'
    | 'slotChildNodes'
    | 'initialize'
    | 'connectedCallback'
    | 'disconnectedCallback'
    | 'attributeChangedCallback'
    | 'stateChangedCallback'
    | 'propertyChangedCallback'
    | 'getInnerPropertyValue'
    | 'setInnerPropertyValue'
    | 'observe'
    | 'unobserve'
    | 'dispatchEvent'
    | 'dispatchAsyncEvent'
    | 'delegateEventListener'
    | 'undelegateEventListener'
    | 'render'
    | 'forceUpdate'
    | 'collectUpdatesStart'
    | 'collectUpdatesEnd'
    | 'assign'
    | Exclude<keyof Element, 'id' | 'className'>
    | keyof ElementCSSInlineStyle;

/**
 * Extract known keys of an Element class.
 */
type KnownKeys<T> = keyof {
    [K in keyof T as K extends string ? IfAny<T, K, never, K> : never]: unknown;
};

/**
 * Pick defined properties of a component.
 */
export type Props<
    T extends HTML.Element,
    InvalidKeys = ReservedKeys | KnownKeys<BaseClass<T>>,
> = ElementAttributes<T> & {
    [K in keyof T as K extends InvalidKeys ? never : IfMethod<T, K, never, K>]?: T[K];
};

/**
 * Pick methods of a class.
 */
export type Methods<T> = {
    [K in keyof T as K extends ReservedKeys ? never : IfMethod<T, K, K, never>]: T[K];
};

/**
 * A constructor alias used for JSX fragments </>.
 * @param props The properties of the fragment.
 * @returns The fragment children.
 */
export const Fragment: FunctionComponent<{
    [key: PropertyKey]: never;
}> = (props) => props.children;

/**
 * Get render attributes set.
 */
export type AttributeProperties<T> = Omit<T, 'style' | 'class'>;

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
    is?: string;
    slot?: string;
    class?: string | Record<string, boolean | undefined>;
    style?: string | Record<string, string | undefined>;
    xmlns?: string;
    ref?: Element;
};

/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param hooks Hooks methods.
 * @returns A template.
 */
// biome-ignore lint/suspicious/noExplicitAny: Function components can have any properties.
export type FunctionComponent<P = any> = (
    props: P & KeyedProperties & TreeProperties,
    hooks: {
        useState: <T = unknown>(initialValue: T) => [T, (value: T) => void];
        useMemo: <T = unknown>(factory: () => T, deps?: unknown[]) => T;
        useEffect: (effect: Effect, deps?: unknown[]) => void;
        useRenderContext: () => Context;
    }
) => Template;

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
export type VElement<T extends Node> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: AttributeProperties<
        T extends HTML.Element ? Props<T> : T extends Element ? ElementAttributes<T> : object
    > &
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
    properties: AttributeProperties<IntrinsicElementAttributes['slot']> &
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
            ? HTMLTagNameMap[T] extends HTML.Element
                ? Props<HTMLTagNameMap[T]>
                : IntrinsicElementAttributes[T]
            : IntrinsicElementAttributes[T]
    > &
        KeyedProperties &
        TreeProperties &
        EventProperties &
        ElementProperties;
    children: Template[];
    [V_SYM]: true;
};

export type VLiteral = {
    type: string;
};

/**
 * Generic virtual dom object.
 */
export type VObject =
    | VFunction<FunctionComponent>
    | VElement<Node>
    | VSlot
    | VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap>;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
// biome-ignore lint/suspicious/noExplicitAny: Anything can be a template.
export type Template = any;

/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 * @returns True if the target is a virtual DOM object.
 */
export const isVObject = (target: Template): target is VObject => !!target[V_SYM];

/**
 * Check if the current virtual node is a functional component.
 * @param target The node to check.
 * @returns True if the target is a functional component.
 */
export const isVFunction = (target: VObject): target is VFunction<FunctionComponent> =>
    typeof target.type === 'function';

/**
 * Check if the current virtual node is an HTML node instance.
 * @param target The node to check.
 * @returns True if the target is an HTML node instance.
 */
export const isVNode = (target: VObject): target is VElement<Node> => target.type instanceof Node;

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

/**
 * Function factory to use as JSX pragma.
 *
 * @param type The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 * @returns The virtual DOM object.
 */
function h<T extends typeof Fragment | FunctionComponent | Node | keyof SVGTagNameMap | keyof HTMLTagNameMap | string>(
    type: T,
    properties:
        | (T extends typeof Fragment
              ? null
              : T extends FunctionComponent<infer Props>
                ? Props & KeyedProperties & TreeProperties
                : T extends Node
                  ? AttributeProperties<
                        T extends HTML.Element ? Props<T> : T extends Element ? ElementAttributes<T> : object
                    > &
                        KeyedProperties &
                        TreeProperties &
                        EventProperties &
                        ElementProperties
                  : T extends keyof JSXInternal.IntrinsicElements
                    ? JSXInternal.IntrinsicElements[T]
                    : never)
        | null = null,
    ...children: Template[]
) {
    return {
        type: properties?.ref || type,
        key: properties?.key,
        children: children.length ? children : null,
        properties,
        namespace:
            properties?.xmlns || ((type as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : undefined),
        [V_SYM]: true,
    } as T extends FunctionComponent
        ? VFunction<T>
        : T extends Element
          ? VElement<T>
          : T extends keyof SVGTagNameMap
            ? VTag<T>
            : T extends keyof HTMLTagNameMap
              ? VTag<T>
              : never;
}

/**
 * Function factory to use as JSX pragma.
 *
 * @param type The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param key The Node key reference.
 * @returns The virtual DOM object.
 */
function jsx<T extends FunctionComponent | Node | keyof SVGTagNameMap | keyof HTMLTagNameMap | string>(
    type: T,
    properties:
        | (T extends typeof Fragment
              ? null
              : T extends FunctionComponent
                ? Parameters<T>[0] & KeyedProperties & TreeProperties
                : T extends Node
                  ? AttributeProperties<
                        T extends HTML.Element ? Props<T> : T extends Element ? ElementAttributes<T> : object
                    > &
                        KeyedProperties &
                        TreeProperties &
                        EventProperties &
                        ElementProperties
                  : T extends keyof JSXInternal.IntrinsicElements
                    ? JSXInternal.IntrinsicElements[T]
                    : never)
        | null = null,
    key?: unknown
) {
    return {
        type: properties?.ref || type,
        key,
        children: properties?.children,
        properties,
        namespace:
            properties?.xmlns || ((type as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : undefined),
        [V_SYM]: true,
    } as T extends FunctionComponent
        ? VFunction<T>
        : T extends Element
          ? VElement<T>
          : T extends keyof SVGTagNameMap
            ? VTag<T>
            : T extends keyof HTMLTagNameMap
              ? VTag<T>
              : never;
}

const jsxs: typeof jsx = jsx;
const jsxDEV: typeof jsx = jsx;

export { h, jsx, jsxs, jsxDEV };

/**
 * Compile a template string into virtual DOM template.
 * @param string The string to compile.
 * @param values Values to interpolate.
 * @returns The virtual DOM template.
 */
export const html: (
    strings: TemplateStringsArray,
    ...values: Template[]
) => ReturnType<typeof h> | ReturnType<typeof h>[] = htm.bind(h);

/**
 * Compile a string into virtual DOM template.
 * @param string The string to compile.
 * @returns The virtual DOM template.
 */
export const compile = (string: string): Template => {
    const array = [string] as string[] & { raw?: string[] };
    array.raw = [string];
    return html(array as unknown as TemplateStringsArray);
};

/**
 * Get all the property keys that extends a builtin element.
 */
type InstrinsicCustomElementsProps<T extends keyof HTMLTagNameMap> = Exclude<
    {
        [K in keyof JSXInternal.CustomElements]: 'extends' extends keyof JSXInternal.CustomElements[K]
            ? JSXInternal.CustomElements[K]['extends'] extends T
                ? AttributeProperties<{ is: K } & Props<JSXInternal.CustomElements[K]>> &
                      KeyedProperties &
                      TreeProperties &
                      EventProperties &
                      ElementProperties
                : never
            : never;
    }[keyof JSXInternal.CustomElements],
    never
>;

/**
 * The internal JSX namespace.
 */
export namespace JSXInternal {
    // biome-ignore lint/suspicious/noEmptyInterface: We need an empty interface to extend it later.
    export interface CustomElements {}

    export type Element = Template;

    export interface ElementClass extends HTMLElement {}

    export type IntrinsicElements = {
        [key: string]: Record<string, unknown> &
            HTMLAttributes &
            KeyedProperties &
            TreeProperties &
            EventProperties &
            ElementProperties;
    } & {
        [K in keyof CustomElements]: 'extends' extends keyof JSXInternal.CustomElements[K]
            ? never
            : AttributeProperties<Props<CustomElements[K]>> &
                  KeyedProperties &
                  TreeProperties &
                  EventProperties &
                  ElementProperties;
    } & {
        [K in keyof HTMLTagNameMap]:
            | ({ is?: never } & AttributeProperties<Omit<IntrinsicElementAttributes[K], 'is'>> &
                  KeyedProperties &
                  TreeProperties &
                  EventProperties &
                  ElementProperties)
            | InstrinsicCustomElementsProps<K>;
    } & {
        [K in keyof SVGTagNameMap]: AttributeProperties<IntrinsicElementAttributes[K]> &
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
    }

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements {}
}
