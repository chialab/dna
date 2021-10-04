import type { IterableNodeList } from './helpers';
import type { CustomElement } from './CustomElementRegistry';
import type { Members } from './Component';
import type { UpdateRequest, FunctionComponent } from './FunctionComponent';
import { createSymbol, isElement, isText } from './helpers';

/**
 * A symbol for node context.
 */
const CONTEXT_SYMBOL: unique symbol = createSymbol();

export type WithContext<T extends Node> = T & {
    [CONTEXT_SYMBOL]?: WeakMap<Context | T, Context<T>>;
};

/**
 * The node context interface.
 */
export type Context<T extends Node = Node, P = T extends Element ? Members<T> : {}, S = Map<string, unknown>> = {
    node: T;
    isElement?: boolean;
    isText?: boolean;
    tagName?: string;
    is?: string;
    key?: unknown;
    properties: [P, P];
    store: S;
    childNodes?: IterableNodeList;
    slotChildNodes?: IterableNodeList;
    Function?: FunctionComponent<P>;
    start?: Node;
    end?: Node;
    fragments: Context[];
    root?: Context;
    requestUpdate?: UpdateRequest;
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
 * @param node The object to context.
 * @param context The context to set.
 * @param parent The parent context.
 */
export const setContext = <T extends Node>(node: WithContext<T>, context: Context<T>, parent?: Context): Context<T> => {
    const map = node[CONTEXT_SYMBOL] = node[CONTEXT_SYMBOL] || new WeakMap();
    map.set(parent || node, context);
    return context;
};

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @param parent The parent context.
 * @return A context object for the node.
 */
export const createContext = <T extends Node>(node: T, parent?: Context) => {
    const isElementNode = isElement(node);
    const isTextNode = !isElementNode && isText(node);
    const is = (node as unknown as CustomElement).is;
    const store = new Map() as Map<string, unknown>;
    return setContext(node, {
        node,
        isElement: isElementNode,
        isText: isTextNode,
        tagName: isElementNode ? (node as unknown as HTMLElement).tagName.toLowerCase() : undefined,
        childNodes: isElementNode ? node.childNodes as unknown as IterableNodeList : undefined,
        is,
        properties: [{}, {}],
        store,
        fragments: [],
        __proto__: {
            get size() {
                return store.size;
            },
            has: store.has.bind(store),
            get: store.get.bind(store),
            set: store.set.bind(store),
            delete: store.delete.bind(store),
            clear: store.clear.bind(store),
            forEach: store.forEach.bind(store),
        },
    }, parent) as Context<T>;
};

/**
 * Get the context attached to an object.
 * @param node The scope of the context.
 * @param parent The parent context.
 * @return The context object (if it exists).
 */
export const getOrCreateContext = <T extends Node>(node: WithContext<T>, parent?: Context): Context<T> => {
    const map = node[CONTEXT_SYMBOL];
    if (!map) {
        return createContext(node, parent);
    }

    return map.get(parent || node) || createContext(node, parent);
};
