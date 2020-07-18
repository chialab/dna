import { Subscription } from './Observable';
import { IterableNodeList } from './NodeList';
import { isElement, isText } from './DOM';
import { createSymbolKey } from './symbols';

/**
 * A symbol for node context.
 */
const CONTEXT_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * A ontext interface.
 */
export type Context = {
    isElement: boolean,
    isText: boolean,
    tagName?: string,
    key?: any,
    childNodes?: IterableNodeList,
    props?: { [key: string]: any; },
    keys?: any[];
    promises?: Promise<unknown>[];
    subscriptions?: Subscription[];
    is?: string;
    slotChildNodes?: IterableNodeList,
    [key: string]: any,
};

/**
 * Get the context attached to an object.
 * @param target The context object.
 * @return The context object (if it exists).
 */
export const getContext = (target: any): Context => target[CONTEXT_SYMBOL];

/**
 * Attach a context to an object.
 * @param target The object to context.
 * @param context The context to set.
 */
export const setContext = (target: any, context: Context): Context => target[CONTEXT_SYMBOL] = context;

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @return A context object for the node.
 */
export const createContext = (node: Node) => {
    let isElementNode = isElement(node);
    let isTextNode = !isElementNode && isText(node);
    return setContext(node, {
        isElement: isElementNode,
        isText: isTextNode,
        tagName: isElementNode ? (node as HTMLElement).tagName.toLowerCase() : undefined,
        childNodes: isElementNode ? node.childNodes as unknown as IterableNodeList : undefined,
    });
};
