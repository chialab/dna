import { Subscription } from './Observable';
import { IterableNodeList } from './NodeList';

/**
 * A ontext interface.
 */
export type Context = {
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
export const getContext = (target: any): Context => target['__CONTEXT_SYMBOL__'];

/**
 * Attach a context to an object.
 * @param target The object to context.
 * @param context The context to set.
 */
export const setContext = (target: any, context: Context): Context => target['__CONTEXT_SYMBOL__'] = context;

/**
 * Create a
 * @param root
 */
export const createContext = (root: HTMLElement) => setContext(root, {
    childNodes: root.childNodes as unknown as IterableNodeList,
    props: {},
    keys: [],
    promises: [],
    subscriptions: [],
});
