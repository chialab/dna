import type { IterableNodeList } from './helpers';
import type { CustomElement } from './CustomElementRegistry';
import type { UpdateRequest, FunctionComponent } from './FunctionComponent';
import type { VProperties } from './JSX';
import { createSymbol, isElement, isText } from './helpers';

/**
 * A symbol for node context.
 */
const CONTEXT_SYMBOL: unique symbol = createSymbol();

export type WithContext<T extends Node> = T & {
    [CONTEXT_SYMBOL]?: Context<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Keyed = Map<any, Node>;

/**
 * The node context interface.
 */
export type Context<T extends Node = Node, P = VProperties<T>, S = Map<string, unknown>> = {
    node: T;
    isElement?: boolean;
    isText?: boolean;
    tagName?: string;
    is?: string;
    properties: WeakMap<Context, [P, P]>;
    store: S;
    childNodes?: IterableNodeList;
    slotChildNodes?: IterableNodeList;
    Function?: FunctionComponent<P>;
    start?: Node;
    end?: Node;
    fragments: Context[];
    root?: Context;
    keyed?: Keyed;
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
export const setContext = <T extends Node>(node: WithContext<T>, context: Context<T>): Context<T> => {
    node[CONTEXT_SYMBOL] = context;
    return context;
};

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @param parent The parent context.
 * @return A context object for the node.
 */
export const createContext = <T extends Node>(node: T) => {
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
        properties: new WeakMap(),
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
    }) as Context<T>;
};

/**
 * Get the context attached to an object.
 * @param node The scope of the context.
 * @param parent The parent context.
 * @return The context object (if it exists).
 */
export const getOrCreateContext = <T extends Node>(node: WithContext<T>): Context<T> => {
    const context = node[CONTEXT_SYMBOL];
    return context || createContext(node);
};

/**
 * Get context properties for a given render context.
 * @param context The node context.
 * @param renderContext The render context.
 * @param slot Should use slotted properties.
 * @return Cotnext properties.
 */
export function getContextProperties<T extends Node>(context: Context<T>, renderContext: Context, slot = false) {
    const properties = context.properties.get(renderContext);
    return properties ? properties[slot ? 1 : 0] : {} as VProperties<T>;
}

/**
 * Set context properties for a given render context.
 * @param context The node context.
 * @param renderContext The render context.
 * @param slot Should set slotted properties.
 * @param props Properties to set.
 */
export function setContextProperties<T extends Node>(context: Context<T>, renderContext: Context, slot = false, props: VProperties<T>) {
    const properties = context.properties.get(renderContext) || [{} as VProperties<T>, {} as VProperties<T>];
    properties[slot ? 1 : 0] = props;
    context.properties.set(renderContext, properties);
}
