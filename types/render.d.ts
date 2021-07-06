import type { TagNameMap, IterableNodeList, Writable } from './types';
import type { CustomElementConstructor } from './CustomElementRegistry';
import type { Observable } from './Observable';
/**
 * Compile a string into virtual DOM template.
 *
 * @return The virtual DOM template.
 */
export declare const compile: (string: string) => Template;
/**
 * Compile a template string into virtual DOM template.
 *
 * @return The virtual DOM template.
 */
declare function html(string: TemplateStringsArray, ...values: unknown[]): Template;
/**
 * @deprecated use compile function instead.
 */
declare function html(string: string): Template;
export { html };
/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export declare type Template = Element | Text | Node | HyperFragment | HyperFunction | HyperComponent<CustomElementConstructor<HTMLElement>> | HyperNode<Node> | HyperSlot | HyperTag<keyof TagNameMap> | Promise<unknown> | Observable<unknown> | string | number | boolean | undefined | null | Template[];
/**
* A filter function signature for template items.
*
* @param item The template item to check.
* @return A truthy value for valid items, a falsy for value for invalid ones.
*/
export declare type Filter = (item: Node) => boolean;
/**
 * A re-render function.
 */
export declare type UpdateRequest = () => boolean;
/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param context The current render context.
 * @return A template.
 */
export declare type FunctionComponent<P = any> = (props: P, context: Context<Node, UpdateRequest, P>, 
/**
 * @deprecated Use context.requestUpdate method.
 */
requestUpdate: UpdateRequest, 
/**
 * @deprecated Use the returned value of the context.requestUpdate method.
 */
isAttached: () => boolean, 
/**
 * @deprecated Use context.
 */
sameContext: Context<Node, UpdateRequest, P>) => Template;
/**
 * Identify hyper objects.
 */
export declare const HYPER_OBJECT_SYM: unique symbol;
/**
 * A constructor alias used for JSX fragments </>.
 */
export declare const Fragment: unique symbol;
/**
 * Classes dictionary.
 */
export declare type HyperClasses = string | {
    [key: string]: boolean;
};
/**
 * Styles dictionary.
 */
export declare type HyperStyle = string | {
    [key: string]: string;
};
/**
 * Properties used by the render engine.
 * They can be assigned to a node but they are not part of the node prototype.
 */
export declare type HyperProperties = {
    is?: string;
    slot?: string;
    key?: unknown;
    xmlns?: string;
    children?: Template[];
    class?: HyperClasses;
    style?: HyperStyle;
};
/**
 * The interface of a JSX fragment node.
 */
export declare type HyperFragment = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag?: undefined;
    isFragment: true;
    isSlot?: false;
    key?: unknown;
    properties?: {};
    children: Template[];
    [HYPER_OBJECT_SYM]: true;
};
/**
 * The interface of a functional component.
 */
export declare type HyperFunction = {
    Function: FunctionComponent;
    Component?: undefined;
    node?: undefined;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: HyperProperties;
    children: Template[];
    [HYPER_OBJECT_SYM]: true;
};
/**
 * The interface of an HTML node used as JSX tag.
 */
export declare type HyperNode<T extends Node> = {
    Function?: undefined;
    Component?: undefined;
    node: T;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: Writable<T> & HyperProperties;
    children: Template[];
    [HYPER_OBJECT_SYM]: true;
};
/**
 * The interface of a Component constructor used as JSX tag.
 */
export declare type HyperComponent<T extends CustomElementConstructor<HTMLElement>> = {
    Function?: undefined;
    Component: T;
    node?: undefined;
    tag?: undefined;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: Writable<InstanceType<T>> & HyperProperties;
    children: Template[];
    [HYPER_OBJECT_SYM]: true;
};
/**
 * The interface of slot element.
 */
export declare type HyperSlot = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag: 'slot';
    isFragment?: false;
    isSlot: true;
    key?: unknown;
    properties: Writable<HTMLElementTagNameMap['slot']> & HyperProperties;
    children: Template[];
    [HYPER_OBJECT_SYM]: true;
};
/**
 * The interface of a generic JSX tag.
 */
export declare type HyperTag<T extends keyof TagNameMap> = {
    Function?: undefined;
    Component?: undefined;
    node?: undefined;
    tag: T;
    isFragment?: false;
    isSlot?: false;
    key?: unknown;
    namespaceURI?: string;
    properties: Writable<TagNameMap[T]> & HyperProperties;
    children: Template[];
    [HYPER_OBJECT_SYM]: true;
};
/**
 * Generic hyper object.
 */
export declare type HyperObject = HyperFragment | HyperFunction | HyperComponent<CustomElementConstructor<HTMLElement>> | HyperNode<Node> | HyperSlot | HyperTag<keyof TagNameMap>;
/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 */
export declare const isHyperObject: (target: any) => target is HyperObject;
/**
 * Check if the current virtual node is a fragment.
 * @param target The node to check.
 */
export declare const isHyperFragment: (target: HyperObject) => target is HyperFragment;
/**
 * Check if the current virtual node is a functional component.
 * @param target The node to check.
 */
export declare const isHyperFunction: (target: HyperObject) => target is HyperFunction;
/**
 * Check if the current virtual node is a Component.
 * @param target The node to check.
 */
export declare const isHyperComponent: (target: HyperObject) => target is HyperComponent<CustomElementConstructor<HTMLElement>>;
/**
 * Check if the current virtual node is an HTML node instance.
 * @param target The node to check.
 */
export declare const isHyperNode: (target: HyperObject) => target is HyperNode<Node>;
/**
 * Check if the current virtual node is a slot element.
 * @param target The node to check.
 */
export declare const isHyperSlot: (target: HyperObject) => target is HyperSlot;
/**
 * Check if the current virtual node is a generic tag to render.
 * @param target The node to check.
 */
export declare const isHyperTag: (target: HyperObject) => target is HyperTag<"div">;
/**
 * HyperFunction factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 */
declare function h(tagOrComponent: typeof Fragment, properties: null, ...children: Template[]): HyperFragment;
declare function h<T extends FunctionComponent>(tagOrComponent: T, properties: HyperProperties | null, ...children: Template[]): HyperFunction;
declare function h<T extends CustomElementConstructor<HTMLElement>>(tagOrComponent: T, properties: Writable<InstanceType<T>> & HyperProperties | null, ...children: Template[]): HyperComponent<T>;
declare function h<T extends Node>(tagOrComponent: T, properties: Writable<T> & HyperProperties | null, ...children: Template[]): HyperNode<T>;
declare function h(tagOrComponent: 'slot', properties: Writable<HTMLSlotElement> & HyperProperties | null, ...children: Template[]): HyperSlot;
declare function h<T extends keyof TagNameMap>(tagOrComponent: T, properties: Writable<TagNameMap[T]> & HyperProperties | null, ...children: Template[]): HyperTag<T>;
export { h };
/**
 * A symbol for node context.
 */
declare const CONTEXT_SYMBOL: unique symbol;
export declare type WithContext<T extends Node, F extends UpdateRequest | undefined> = T & {
    [CONTEXT_SYMBOL]?: Context<T, F>;
};
/**
 * The node context interface.
 */
export declare type Context<T extends Node = Node, F extends UpdateRequest | undefined = UpdateRequest | undefined, P = Writable<T>, S = Map<string, unknown>> = {
    node: T;
    isElement?: boolean;
    isText?: boolean;
    tagName?: string;
    is?: string;
    key?: unknown;
    properties: [
        WeakMap<Context<T, UpdateRequest | undefined, P>, P & HyperProperties>,
        WeakMap<Context<T, UpdateRequest | undefined, P>, P & HyperProperties>
    ];
    store: S;
    childNodes?: IterableNodeList;
    slotChildNodes?: IterableNodeList;
    Function?: FunctionComponent<P>;
    start?: Node;
    end?: Node;
    fragments: Context[];
    parent?: Context;
    root?: Context;
    requestUpdate: F;
    __proto__: {
        readonly size: number;
        has: Map<string, unknown>['has'];
        get: Map<string, unknown>['get'];
        set: Map<string, unknown>['set'];
        delete: Map<string, unknown>['delete'];
        clear: Map<string, unknown>['clear'];
        forEach: Map<string, unknown>['forEach'];
    };
};
/**
 * Attach a context to an object.
 * @param target The object to context.
 * @param context The context to set.
 */
export declare const setContext: <T extends Node, F extends UpdateRequest | undefined = undefined>(target: WithContext<T, F>, context: Context<T, F, Writable<T>, Map<string, unknown>>) => Context<T, F, Writable<T>, Map<string, unknown>>;
/**
 * Create a node context.
 * @param node The node scope of the context.
 * @return A context object for the node.
 */
export declare const createContext: <T extends Node, F extends UpdateRequest | undefined>(node: T, requestUpdate?: F | undefined) => Context<T, F extends UpdateRequest ? UpdateRequest : undefined, Writable<T>, Map<string, unknown>>;
/**
 * Get the context attached to an object.
 * @param target The scope of the context.
 * @return The context object (if it exists).
 */
export declare const getOrCreateContext: <T extends Node, F extends UpdateRequest | undefined>(target: WithContext<T, F>, requestUpdate?: F | undefined) => Context<T, F extends UpdateRequest ? UpdateRequest : undefined, Writable<T>, Map<string, unknown>>;
/**
 * Cleanup child fragments of a context.
 * @param context The fragment to empty.
 */
export declare const emptyFragments: <T extends Node>(context: Context<T, UpdateRequest | undefined, Writable<T>, Map<string, unknown>>) => Context<Node, UpdateRequest | undefined, Writable<Node>, Map<string, unknown>>[];
/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param root The root Node for the render.
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param slot Should handle slot children.
 * @param context The render context of the root.
 * @param namespace The current namespace uri of the render.
 * @param rootContext The current custom element context of the render.
 * @param refContext The main context of the render.
 * @param fragment The fragment context to update.
 * @return The resulting child nodes list.
 */
export declare const internalRender: (root: Node, input: Template, slot?: boolean, context?: Context<Node, UpdateRequest | undefined, Writable<Node>, Map<string, unknown>> | undefined, namespace?: string, rootContext?: Context<Node, UpdateRequest | undefined, Writable<Node>, Map<string, unknown>> | undefined, mainContext?: Context<Node, UpdateRequest | undefined, Writable<Node>, Map<string, unknown>> | undefined, fragment?: Context<Node, UpdateRequest | undefined, Writable<Node>, Map<string, unknown>> | undefined) => IterableNodeList;
/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param root The root Node for the render.
 * @param slot Should render to slot children.
 * @return The resulting child Nodes.
 */
export declare const render: (input: Template, root?: Node, slot?: boolean) => Node | Node[] | void;
