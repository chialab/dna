import { isElement, isText } from './helpers';
import { createSymbolKey } from './symbols';
import { TemplateFunction } from './Template';
import { IterableNodeList } from './NodeList';
import { ComponentInterface } from './Interfaces';

/**
 * A symbol for node context.
 */
const CONTEXT_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * The node context interface.
 */
export type Context = {
    isElement?: boolean,
    isText?: boolean,
    tagName?: string,
    is?: string;
    key?: any,
    props: { [key: string]: any },
    state: Map<string, any>,
    childNodes?: IterableNodeList,
    slotChildNodes?: IterableNodeList,
    first?: Node,
    last?: Node,
    function?: TemplateFunction,
    fragments: Context[],
    empty?: boolean,
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
    let is = (node as ComponentInterface<HTMLElement>).is;
    return setContext(node, {
        isElement: isElementNode,
        isText: isTextNode,
        tagName: isElementNode ? (node as HTMLElement).tagName.toLowerCase() : undefined,
        childNodes: isElementNode ? node.childNodes as unknown as IterableNodeList : undefined,
        is,
        props: {},
        state: new Map(),
        fragments: [],
        empty: true,
    });
};

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
