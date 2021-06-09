import type { TemplateFunction } from './Template';
import type { IterableNodeList } from './NodeList';
import type { ComponentInterface } from './Interfaces';
import { isElement, isText } from './helpers';
import { createSymbolKey } from './symbols';

/**
 * A symbol for node context.
 */
const CONTEXT_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * A map of properties for each context.
 */
export type PropertiesMap = WeakMap<Context, { [key: string]: unknown }>;

/**
 * The node context interface.
 */
export type Context = {
    isElement?: boolean;
    isText?: boolean;
    tagName?: string;
    is?: string;
    key?: unknown;
    props: [PropertiesMap, PropertiesMap];
    state: Map<string, unknown>;
    childNodes?: IterableNodeList;
    slotChildNodes?: IterableNodeList;
    first?: Node;
    last?: Node;
    function?: TemplateFunction;
    isAlive?: () => boolean;
    requestUpdate?: () => boolean;
    fragments: Context[];
    parent?: Context;
    root?: Context;
};

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
    let is = (node as ComponentInterface<HTMLElement>).is;
    return setContext(node, {
        isElement: isElementNode,
        isText: isTextNode,
        tagName: isElementNode ? (node as HTMLElement).tagName.toLowerCase() : undefined,
        childNodes: isElementNode ? node.childNodes as unknown as IterableNodeList : undefined,
        is,
        props: [new WeakMap(), new WeakMap()],
        state: new Map(),
        fragments: [],
    });
};

/**
 * Get the context attached to an object.
 * @param target The scope of the context.
 * @return The context object (if it exists).
 */
export const getContext = (target: any): Context => target[CONTEXT_SYMBOL] || createContext(target);

/**
 * Cleanup child fragments of a context.
 * @param context The fragment to empty.
 */
export const emptyFragments = (context: Context) => {
    let fragments = context.fragments;
    let len = fragments.length;
    while (len--) {
        let frag = fragments.pop() as Context;
        emptyFragments(frag);
    }
    return fragments;
};
