import type { Store, UpdateRequest, FunctionComponent } from './FunctionComponent';
import type { VProperties } from './JSX';
import type { ComponentInstance } from './Component';

/**
 * A symbol for node render context.
 */
const CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol for host component render context.
 */
const HOST_CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * Represent a Node with render context symbols.
 */
export type WithContext<T extends Node> = T & {
    [CONTEXT_SYMBOL]?: Context;
    [HOST_CONTEXT_SYMBOL]?: Context;
};

/**
 * The node context interface.
 */
export type Context = {
    children: Node[];
    properties: WeakMap<Context, VProperties>;
    host?: string;
    keys?: Map<unknown, Node>;
    fragment?: Context;
    oldKeys?: Map<unknown, Node>;
    oldKeyed?: Set<Node>;
    store?: Store;
    Function?: FunctionComponent<VProperties>;
    start?: Node;
    end?: Node;
    root?: Node;
    owner?: Context;
    currentIndex?: number;
    namespace?: string;
    requestUpdate?: UpdateRequest;
};

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @returns A context object for the node.
 */
export const createContext = (node: Node) => {
    const context: Context = {
        children: [],
        properties: new WeakMap(),
        host: (node as unknown as ComponentInstance).is,
    };

    return context;
};

/**
 * Get the context attached to a node.
 * @param node The scope of the context.
 * @returns The context object (if it exists).
 */
export const getContext = <T extends Node>(node: WithContext<T>) => node[CONTEXT_SYMBOL];

/**
 * Get (or create) the context attached to a node.
 * @param node The scope of the context.
 * @returns The context object (if it exists).
 */
export const getOrCreateContext = <T extends Node>(node: WithContext<T>) => (node[CONTEXT_SYMBOL] = node[CONTEXT_SYMBOL] || createContext(node));

/**
 * Get the host context attached to a component.
 * @param node The scope of the context.
 * @returns The context object (if it exists).
 */
export const getHostContext = <T extends Node>(node: WithContext<T>) => node[HOST_CONTEXT_SYMBOL];

/**
 * Get (or create) the host context attached to a component.
 * @param node The scope of the context.
 * @returns The context object (if it exists).
 */
export const getOrCreateHostContext = <T extends Node>(node: WithContext<T>) => (node[HOST_CONTEXT_SYMBOL] = node[HOST_CONTEXT_SYMBOL] || createContext(node));
