/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import htm from 'htm';
import { type ElementAttributes, type HTMLAttributes, type IntrinsicElementAttributes } from './Attributes';
import { isComponentConstructor, type ComponentConstructor } from './Component';
import { type HTMLTagNameMap, type SVGTagNameMap } from './Elements';
import { type Context } from './render';

/**
 * Identify virtual dom objects.
 */
const V_SYM: unique symbol = Symbol();

/**
 * Checks types equality.
 */
type IfEquals<X, Y, A, B> = (<G>() => G extends X ? 1 : 2) extends <G>() => G extends Y ? 1 : 2 ? A : B;

/**
 * Check if a property is writable.
 */
type IfWritable<T, K extends keyof T, A, B> = IfEquals<{ [Q in K]: T[K] }, { -readonly [Q in K]: T[K] }, A, B>;

/**
 * Check if a property is a method.
 */
type IfMethod<T, K extends keyof T, A, B> = T[K] extends Function ? A : B;

/**
 * Exclude component mixin properties.
 */
type ReservedKeys =
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
 * Pick defined properties of a component.
 */
export type Props<T> = {
    [K in keyof T as K extends ReservedKeys ? never : IfMethod<T, K, never, IfWritable<T, K, K, never>>]?: T[K];
};

/**
 * Pick methods of a class.
 */
export type Methods<T> = {
    [K in keyof T as K extends ReservedKeys ? never : IfMethod<T, K, K, never>]: T[K];
};

/**
 * A constructor alias used for JSX fragments </>.
 */
export const Fragment: unique symbol = Symbol();

/**
 * Get all the property keys that extends a builtin element.
 */
type GetCustomElementsProps<T extends keyof HTMLTagNameMap> = Exclude<
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
 * A re-render function.
 */
export type UpdateRequest = () => boolean;

/**
 * Function component store.
 */
export type Store = Map<string, unknown>;

/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param context The current render context.
 * @returns A template.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionComponent<P = any> = (
    props: P & { key?: unknown; children?: Template[] },
    context: Context & {
        store: Store;
        requestUpdate: UpdateRequest;
    }
) => Template;

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
export type VElement<T extends Node> = {
    type: T;
    key: unknown;
    namespace: string;
    properties: AttributeProperties<Props<T>, T extends Element ? ElementAttributes<T> : {}> &
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

export type VLiteral = {
    type: string;
};

/**
 * Generic virtual dom object.
 */
export type VObject =
    | VFunction<FunctionComponent>
    | VComponent<ComponentConstructor>
    | VElement<Node>
    | VSlot
    | VTag<keyof HTMLTagNameMap | keyof SVGTagNameMap>
    | VFragment;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Template = any;

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
function h<
    T extends
        | typeof Fragment
        | FunctionComponent
        | ComponentConstructor
        | Node
        | keyof SVGTagNameMap
        | keyof HTMLTagNameMap,
>(
    type: T,
    properties:
        | (T extends typeof Fragment
              ? null
              : T extends FunctionComponent
                ? Parameters<T>[0] & KeyedProperties & TreeProperties
                : T extends ComponentConstructor
                  ? AttributeProperties<Props<InstanceType<T>>, HTMLAttributes> &
                        KeyedProperties &
                        TreeProperties &
                        EventProperties &
                        ElementProperties
                  : T extends Node
                    ? AttributeProperties<Props<T>, T extends Element ? ElementAttributes<T> : {}> &
                          KeyedProperties &
                          TreeProperties &
                          EventProperties &
                          ElementProperties
                    : T extends keyof SVGTagNameMap
                      ? AttributeProperties<Props<SVGTagNameMap[T]>, IntrinsicElementAttributes[T]> &
                            KeyedProperties &
                            TreeProperties &
                            EventProperties &
                            ElementProperties
                      : T extends keyof HTMLTagNameMap
                        ? AttributeProperties<Props<HTMLTagNameMap[T]>, IntrinsicElementAttributes[T]> &
                              KeyedProperties &
                              TreeProperties &
                              EventProperties &
                              ElementProperties
                        : never)
        | null = null,
    ...children: Template[]
) {
    return {
        type: properties?.ref || (properties?.is && (customElements.get(properties.is as string) as T)) || type,
        key: properties?.key,
        children: children.length ? children : null,
        properties,
        namespace:
            properties?.xmlns || ((type as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : undefined),
        [V_SYM]: true,
    } as T extends typeof Fragment
        ? VFragment
        : T extends FunctionComponent
          ? VFunction<T>
          : T extends ComponentConstructor
            ? VComponent<T>
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
function jsx<T extends FunctionComponent | ComponentConstructor | Node | keyof SVGTagNameMap | keyof HTMLTagNameMap>(
    type: T,
    properties:
        | (T extends typeof Fragment
              ? null
              : T extends FunctionComponent
                ? Parameters<T>[0] & KeyedProperties & TreeProperties
                : T extends ComponentConstructor
                  ? AttributeProperties<Props<InstanceType<T>>, HTMLAttributes> &
                        KeyedProperties &
                        TreeProperties &
                        EventProperties &
                        ElementProperties
                  : T extends Node
                    ? AttributeProperties<Props<T>, T extends Element ? ElementAttributes<T> : {}> &
                          KeyedProperties &
                          TreeProperties &
                          EventProperties &
                          ElementProperties
                    : T extends keyof SVGTagNameMap
                      ? AttributeProperties<Props<SVGTagNameMap[T]>, IntrinsicElementAttributes[T]> &
                            KeyedProperties &
                            TreeProperties &
                            EventProperties &
                            ElementProperties
                      : T extends keyof HTMLTagNameMap
                        ? AttributeProperties<Props<HTMLTagNameMap[T]>, IntrinsicElementAttributes[T]> &
                              KeyedProperties &
                              TreeProperties &
                              EventProperties &
                              ElementProperties
                        : never)
        | null = null,
    key?: unknown
) {
    return {
        type: properties?.ref || (properties?.is && (customElements.get(properties.is as string) as T)) || type,
        key,
        children: properties?.children,
        properties,
        namespace:
            properties?.xmlns || ((type as unknown as string) === 'svg' ? 'http://www.w3.org/2000/svg' : undefined),
        [V_SYM]: true,
    } as T extends FunctionComponent
        ? VFunction<T>
        : T extends ComponentConstructor
          ? VComponent<T>
          : T extends Element
            ? VElement<T>
            : T extends keyof SVGTagNameMap
              ? VTag<T>
              : T extends keyof HTMLTagNameMap
                ? VTag<T>
                : never;
}

const jsxs = jsx;
const jsxDEV = jsx;

export { h, jsx, jsxs, jsxDEV };

/**
 * Compile a template string into virtual DOM template.
 * @param string The string to compile.
 * @param values Values to interpolate.
 * @returns The virtual DOM template.
 */
export const html = htm.bind(h);

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
    export interface CustomElements {}

    export type Element = Template;

    export interface ElementClass extends HTMLElement {}

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
    }

    interface HTMLElementTagNameMap extends JSXInternal.CustomElements {}
}
