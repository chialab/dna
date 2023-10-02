import { type Store, type UpdateRequest, type FunctionComponent } from './FunctionComponent';
import { type KeyedProperties, type TreeProperties } from './JSX';

/**
 * A symbol for node render context.
 */
const CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * Represent a Node with render context symbols.
 */
export type WithContext<T extends Node> = T & {
    [CONTEXT_SYMBOL]?: Context;
};

/**
 * The node context interface.
 */
export type Context = {
    node: Node;
    root?: Context;
    owner?: Context;
    children: Context[];
    properties?: KeyedProperties & TreeProperties;
    fragment?: Context;
    namespace?: string;
    requestUpdate?: UpdateRequest;
    keys?: Map<unknown, Context>;
    store?: Store;
    end?: Context;
    Function?: FunctionComponent<KeyedProperties & TreeProperties>;
    _keys?: Map<unknown, Context>;
    _keyed?: Set<Context>;
    _pos: number;
};

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @param root The render root context.
 * @param owner The render owner context.
 * @returns A context object for the node.
 */
export const createContext = (node: Node, root?: Context, owner?: Context): Context => ({
    node,
    root,
    owner,
    children: [],
    _pos: 0,
});

export const getChildNodeContext = (parent: Context, node: Node) => parent.children.find((child) => child.node === node);

/**
 * Get (or create) the root context attached to a node.
 * @param node The scope of the context.
 * @returns The context object (if it exists).
 */
export const getRootContext = <T extends Node>(node: WithContext<T>) => node[CONTEXT_SYMBOL] = node[CONTEXT_SYMBOL] || createContext(node);
