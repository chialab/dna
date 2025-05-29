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
 * Get the values of a type.
 */
type Values<T> = T[keyof T] extends never ? {} : T[keyof T];

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
    | 'updatedCallback'
    | 'requestUpdate'
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
export type Props<T extends HTMLElement, InvalidKeys = ReservedKeys | KnownKeys<BaseClass<T>>> = T extends HTML.Element
    ? {
          [K in keyof T as K extends InvalidKeys ? never : IfMethod<T, K, never, K>]?: T[K];
      }
    : {};

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
 * Get base properties for an element.
 */
type RenderAttributes<T extends HTMLElement | string = HTMLElement> = Omit<
    T extends HTMLElement
        ? ElementAttributes<T>
        : T extends keyof IntrinsicElementAttributes
          ? IntrinsicElementAttributes[T]
          : HTMLAttributes,
    'style' | 'class'
>;

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
 * Get render properties for a functional component.
 */
type VFunctionRenderProperties<T extends FunctionComponent> = Parameters<T>[0] & KeyedProperties & TreeProperties;

/**
 * The interface of a functional component.
 */
export type VFunction<T extends FunctionComponent> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: VFunctionRenderProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Get render properties for an element instance.
 */
type VElementRenderProperties<T extends HTMLElement> = Props<T> &
    RenderAttributes<T> &
    KeyedProperties &
    TreeProperties &
    EventProperties &
    ElementProperties;

/**
 * The interface of an HTML node used as JSX tag.
 */
export type VElement<T extends HTMLElement = HTMLElement> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: VElementRenderProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Get render properties for a slot tag.
 */
type VSlotRenderProperties = RenderAttributes<'slot'> & KeyedProperties & TreeProperties & EventProperties;

/**
 * The interface of slot element.
 */
export type VSlot = {
    type: 'slot';
    key: unknown;
    properties: VSlotRenderProperties;
    children: Template[];
    [V_SYM]: true;
};

/**
 * Get base render properties for a tag.
 */
type VTagBaseRenderProperties<T extends string> = RenderAttributes<T> &
    KeyedProperties &
    TreeProperties &
    EventProperties &
    ElementProperties;

/**
 * Get full render properties for a tag.
 */
type VTagRenderProperties<T extends string> = (T extends keyof JSXInternal.CustomElements
    ? Props<JSXInternal.CustomElements[T]>
    : {}) &
    VTagBaseRenderProperties<T>;

/**
 * The interface of a generic JSX tag.
 */
export type VTag<T extends string> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: VTagRenderProperties<T>;
    children: Template[];
    [V_SYM]: true;
};

/**
 * A literal value.
 */
export type VLiteral = {
    type: string;
};

/**
 * A virtual DOM object properties.
 */
type VObjectProperties<T extends typeof Fragment | FunctionComponent | HTMLElement | 'slot' | string> =
    T extends typeof Fragment
        ? null
        : T extends FunctionComponent
          ? VFunctionRenderProperties<T>
          : T extends HTMLElement
            ? VElementRenderProperties<T>
            : T extends 'slot'
              ? VSlotRenderProperties
              : T extends string
                ? VTagRenderProperties<T>
                : never;

/**
 * A distinct virtual object type.
 */
type DistinctVObject<T extends FunctionComponent | HTMLElement | 'slot' | string> = T extends FunctionComponent
    ? VFunction<T>
    : T extends HTMLElement
      ? VElement<T>
      : T extends 'slot'
        ? VSlot
        : T extends string
          ? VTag<T>
          : never;

/**
 * Generic virtual dom object.
 */
export type VObject =
    | VFunction<FunctionComponent>
    | VElement
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
export const isVNode = (target: VObject): target is VElement => target.type instanceof Node;

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
function h<T extends typeof Fragment | FunctionComponent | HTMLElement | 'slot' | string>(
    type: T,
    properties: VObjectProperties<T> | null = null,
    ...children: Template[]
) {
    return {
        type: (properties as ElementProperties)?.ref || type,
        key: (properties as KeyedProperties)?.key,
        children: children.length ? children : null,
        properties,
        namespace:
            (properties as ElementProperties)?.xmlns ||
            ((type as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : undefined),
        [V_SYM]: true,
    } as DistinctVObject<T>;
}

/**
 * Function factory to use as JSX pragma.
 *
 * @param type The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param key The Node key reference.
 * @returns The virtual DOM object.
 */
function jsx<T extends FunctionComponent | HTMLElement | 'slot' | string>(
    type: T,
    properties: VObjectProperties<T> | null = null,
    key?: unknown
) {
    return {
        type: (properties as ElementProperties)?.ref || type,
        key,
        children: (properties as TreeProperties)?.children,
        properties,
        namespace:
            (properties as ElementProperties)?.xmlns ||
            ((type as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : undefined),
        [V_SYM]: true,
    } as DistinctVObject<T>;
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
 * The internal JSX namespace.
 */
export namespace JSXInternal {
    // biome-ignore lint/suspicious/noEmptyInterface: We need an empty interface to extend it later.
    export interface CustomElements {}

    export type Element = Template;

    export interface ElementClass extends HTMLElement {}

    export type AutonomousElements = {
        [K in keyof CustomElements as CustomElements[K] extends { extends: string } ? never : K]: Props<
            CustomElements[K]
        >;
    };

    export type CustomizedElements = {
        [K in keyof HTMLTagNameMap]: Values<{
            [P in keyof CustomElements as CustomElements[P] extends { extends: K } ? P : never]: Props<
                CustomElements[P]
            > & { is: P };
        }>;
    };

    export type BuiltinElements = {
        [K in keyof HTMLTagNameMap]: Partial<Record<Exclude<keyof CustomizedElements[K], 'is'>, never>> & {
            is?: string | null | undefined;
        };
    };

    export type IntrinsicElements = {
        [key: string]: VElementRenderProperties<HTMLElement>;
    } & {
        [K in keyof AutonomousElements]: AutonomousElements[K] & VTagBaseRenderProperties<K>;
    } & {
        [K in keyof CustomizedElements]: (BuiltinElements[K] | CustomizedElements[K]) & VTagBaseRenderProperties<K>;
    } & {
        [K in keyof SVGTagNameMap]: VTagRenderProperties<K>;
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
