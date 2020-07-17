import { Subscription } from './Observable';
import { IterableNodeList } from './NodeList';

/**
 * A ontext interface.
 */
export type Context = {
    tag: string,
    key?: any,
    childNodes: IterableNodeList,
    props: { [key: string]: any; },
    keys: any[];
    promises: Promise<unknown>[];
    subscriptions: Subscription[];
    is?: string;
    slotChildNodes?: IterableNodeList,
    [key: string]: any;
};

/**
 * Get the context attached to an object.
 * @param target The context object.
 * @return The context object (if it exists).
 */
export const getContext = (target: any): Context => target['__dnaContext'];

/**
 * Attach a context to an object.
 * @param target The object to context.
 * @param context The context to set.
 */
export const setContext = (target: any, context: Context): Context => target['__dnaContext'] = context;

/**
 * Create a node context.
 * @param node The node scope of the context.
 * @return A context object for the node.
 */
export const createContext = (node: HTMLElement) => setContext(node, {
    tag: node.localName,
    childNodes: node.childNodes as unknown as IterableNodeList,
    props: {},
    keys: [],
    promises: [],
    subscriptions: [],
});
