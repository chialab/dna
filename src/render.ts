import { type ComponentConstructor, type ComponentInstance, isComponent } from './Component';
import { css } from './css';
import { $signal } from './directives';
import { type Effect, HooksManager, type HooksState, type StateAction } from './Hooks';
import { getOwnPropertyDescriptor, getPropertyDescriptor, getPrototypeOf, isArray } from './helpers';
import {
    type ElementProperties,
    type EventProperties,
    Fragment,
    type FunctionComponent,
    isVFunction,
    isVNode,
    isVObject,
    isVSlot,
    isVTag,
    type KeyedProperties,
    type Template,
    type TreeProperties,
} from './JSX';
import { getProperty } from './property';
import { effect, get, isSignal, type SignalLike, untrack } from './signals';

/* -------------------------------------------------------------------------------------------------
 * Render contexts
 * ---------------------------------------------------------------------------------------------- */

/**
 * A symbol for node render context.
 */
const CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol for shadow context.
 */
const SHADOW_CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * The kind of node a context describes.
 * - `LITERAL` is a text node generated from an interpolated value.
 * - `VNODE` is an element the renderer created from a virtual node, and owns entirely.
 * - `REF` is a node the renderer does not own: a render root, a node passed in the template
 *   or the comment that marks the position of a function component.
 */
const ContextKind = {
    LITERAL: 0,
    VNODE: 1,
    REF: 2,
};
type ContextKind = (typeof ContextKind)[keyof typeof ContextKind];

/**
 * A signal bound to a node property.
 */
type SignalBinding = {
    /**
     * The bound signal.
     */
    signal: SignalLike<unknown>;
    /**
     * Stop the binding.
     */
    dispose(): void;
    /**
     * The last value applied to the node.
     */
    value: unknown;
};

/**
 * The node context interface.
 */
export type Context = {
    node: Node;
    kind: ContextKind;
    type: FunctionComponent | string | null;
    root?: Context;
    owner?: Context;
    parent?: Context;
    children: Context[];
    contexts: WeakMap<Node, Context>;
    properties?: KeyedProperties & TreeProperties & Record<string, unknown>;
    state?: HooksState;
    bindings?: Map<string, SignalBinding>;
    end?: Context;
    key?: unknown;
    keys?: Map<unknown, Context>;
    refs?: Map<Node, Context>;
    shadow: boolean;
    _pos: number;
    _moved: number;
};

/**
 * Create a node context.
 * @param kind The kind of the context.
 * @param type The type of the context.
 * @param node The node scope of the context.
 * @param shadow If the context renders the shadow content of a component.
 * @param root The render root context.
 * @param owner The render owner context.
 * @returns A context object for the node.
 */
export const createContext = (
    kind: ContextKind,
    type: Context['type'],
    node: Node,
    shadow = false,
    root?: Context,
    owner?: Context
): Context => ({
    node,
    kind,
    type,
    root,
    owner,
    children: [],
    // the node -> context map belongs to the render root and is shared with the whole tree:
    // a map of its own for each context would mean an allocation for every rendered node,
    // while only the one of the root is ever read
    contexts: root ? root.contexts : new WeakMap(),
    shadow,
    _pos: 0,
    _moved: 0,
});

/**
 * Get (or create) the root context attached to a node.
 * @param node The scope of the context.
 * @param shadowRoot If the context is a shadow root.
 * @returns The context object (if it exists).
 */
export const getRootContext = <T extends Node>(
    node: T & {
        [CONTEXT_SYMBOL]?: Context;
        [SHADOW_CONTEXT_SYMBOL]?: Context;
    },
    shadowRoot?: boolean
): Context => {
    // a node hosts two independent renders: its own content and, when it is a component,
    // the content its template generates
    if (shadowRoot) {
        let context = node[SHADOW_CONTEXT_SYMBOL];
        if (!context) {
            context = createContext(ContextKind.REF, null, node, true);
            node[SHADOW_CONTEXT_SYMBOL] = context;
        }
        return context;
    }

    let context = node[CONTEXT_SYMBOL];
    if (!context) {
        context = createContext(ContextKind.REF, null, node, false);
        node[CONTEXT_SYMBOL] = context;
    }
    return context;
};

/* -------------------------------------------------------------------------------------------------
 * Class and style values
 * ---------------------------------------------------------------------------------------------- */

/**
 * The notations accepted by the `class` property of a template.
 */
type ClassValue = string | Record<string, boolean | undefined> | null | undefined;

/**
 * The notations accepted by the `style` property of a template.
 */
type StyleValue = string | Record<string, string | undefined> | null | undefined;

/**
 * The hyphenated form of the style property names already converted.
 * Style maps are usually written in camel case and are converted again on every update,
 * so the result of the replacement is memoized instead of being computed over and over.
 */
const hyphenatedProperties = new Map<string, string>();

/**
 * Convert a camel case style property name to its hyphenated form.
 * @param propertyKey The property name to convert.
 * @returns The hyphenated property name.
 */
const hyphenate = (propertyKey: string) => {
    let hyphenated = hyphenatedProperties.get(propertyKey);
    if (hyphenated === undefined) {
        hyphenated = propertyKey.replace(/[A-Z]/g, (match: string) => `-${match.toLowerCase()}`);
        hyphenatedProperties.set(propertyKey, hyphenated);
    }
    return hyphenated;
};

/**
 * Convert strings or classes map to a list of classes.
 * @param value The value to convert.
 * @returns A list of classes.
 */
const convertClasses = (value: ClassValue): Record<string, boolean | undefined> => {
    if (!value) {
        return {};
    }
    if (typeof value === 'object') {
        return value;
    }

    const classes: Record<string, boolean | undefined> = {};
    // any run of whitespace separates two class names, and empty tokens are dropped
    // because `classList` refuses them
    for (const className of value.split(/\s+/)) {
        if (className) {
            classes[className] = true;
        }
    }
    return classes;
};

/**
 * Convert strings or styles map to a list of styles.
 * Property names are always hyphenated, so that the two notations can be diffed against each other.
 * @param value The value to convert.
 * @returns A set of styles.
 */
const convertStyles = (value: StyleValue): Record<string, string> => {
    const styles: Record<string, string> = {};
    if (!value) {
        return styles;
    }

    if (typeof value === 'object') {
        for (const propertyKey in value) {
            const propertyValue = value[propertyKey];
            if (propertyValue != null) {
                styles[hyphenate(propertyKey)] = propertyValue;
            }
        }
        return styles;
    }

    for (const rule of value.split(';')) {
        const separator = rule.indexOf(':');
        if (separator === -1) {
            continue;
        }
        // only the first colon separates the two sides: the value may contain more of them,
        // as in `background: url(http://…)`
        styles[rule.slice(0, separator).trim()] = rule.slice(separator + 1).trim();
    }
    return styles;
};

/**
 * Apply the `class` property of a template to a node.
 *
 * As long as the class attribute still is what the renderer wrote last, nothing else has
 * touched it and it can be replaced in a single assignment. Once the two diverge — because
 * the page edited `classList`, or because the template switched notation — class names are
 * diffed one by one, so that only the ones the template used to declare are removed and
 * everything else is left alone.
 * @param node The node to update.
 * @param value The new value.
 * @param oldValue The value the renderer applied last.
 */
const setClasses = (node: HTMLElement, value: ClassValue, oldValue: ClassValue) => {
    if (value == null) {
        node.removeAttribute('class');
        return;
    }
    if (typeof value === 'string' && node.className === (oldValue || '')) {
        node.className = value;
        return;
    }

    const classes = convertClasses(value);
    const oldClasses = convertClasses(oldValue);
    const classList = node.classList;
    for (const className in oldClasses) {
        if (!classes[className]) {
            classList.remove(className);
        }
    }
    for (const className in classes) {
        if (classes[className] && !classList.contains(className)) {
            classList.add(className);
        }
    }
};

/**
 * Apply the `style` property of a template to a node.
 * It mirrors {@link setClasses}: a wholesale write while the renderer is the only writer of
 * the style attribute, a declaration by declaration diff as soon as it is not.
 * @param node The node to update.
 * @param value The new value.
 * @param oldValue The value the renderer applied last.
 */
const setStyle = (node: HTMLElement, value: StyleValue, oldValue: StyleValue) => {
    if (value == null) {
        node.removeAttribute('style');
        return;
    }
    if (typeof value === 'string' && node.getAttribute('style') === oldValue) {
        node.setAttribute('style', value);
        return;
    }

    const styles = convertStyles(value);
    const oldStyles = convertStyles(oldValue);
    const style = node.style;
    for (const propertyKey in oldStyles) {
        if (!(propertyKey in styles)) {
            style.removeProperty(propertyKey);
        }
    }
    for (const propertyKey in styles) {
        style.setProperty(propertyKey, styles[propertyKey]);
    }
};

/* -------------------------------------------------------------------------------------------------
 * Node properties
 * ---------------------------------------------------------------------------------------------- */

/**
 * Check if a property should be ignored.
 * @param node The node to check.
 * @param propertyKey The property key to check.
 * @returns `true` if the property should be ignored.
 */
const shouldIgnoreProperty = (node: Node, propertyKey: string) => {
    if (propertyKey === 'children' || propertyKey === 'key' || propertyKey === 'xmlns') {
        return true;
    }
    if (propertyKey === 'is') {
        // `is` picks the class of the element and cannot be changed afterwards,
        // unless the node exposes it as a real property
        return 'is' in node;
    }
    return false;
};

/**
 * The writability of the properties of a prototype, by property key.
 * Walking a prototype chain allocates a descriptor at every step, and the very same
 * properties are looked up again for each node of a class on every render.
 */
const writableProperties = new WeakMap<object, Map<string, boolean>>();

/**
 * Check if a property is writable.
 * @param element The element to check.
 * @param propertyKey The property to check.
 * @returns True if writable, false otherwise.
 */
const isWritableProperty = (element: Node, propertyKey: string) => {
    // an own property shadows the whole chain, so it is always looked up
    const ownDescriptor = getOwnPropertyDescriptor(element, propertyKey);
    if (ownDescriptor) {
        return !ownDescriptor.get || !!ownDescriptor.set;
    }

    const prototype = getPrototypeOf(element);
    if (!prototype) {
        return false;
    }

    let cache = writableProperties.get(prototype);
    if (!cache) {
        cache = new Map();
        writableProperties.set(prototype, cache);
    }

    let writable = cache.get(propertyKey);
    if (writable === undefined) {
        const descriptor = getPropertyDescriptor(prototype, propertyKey);
        writable = !!descriptor && (!descriptor.get || !!descriptor.set);
        cache.set(propertyKey, writable);
    }
    return writable;
};

/**
 * Set property value to a node.
 * @param node The node to update.
 * @param propertyKey The property key to update.
 * @param value The new value.
 * @param oldValue The old value.
 * @param ctr The constructor of the node.
 */
const setProperty = <T extends Node | HTMLElement, P extends string & keyof T>(
    node: T,
    propertyKey: P,
    value: T[P] | undefined,
    oldValue?: T[P],
    ctr?: ComponentConstructor
) => {
    // the state of a form field belongs to the user as much as to the template: it is written
    // again even when the template did not change, in order to restore what it declares
    const isInputValue =
        (propertyKey === 'checked' || propertyKey === 'value') &&
        ((node as HTMLElement).tagName === 'INPUT' || (node as HTMLElement).tagName === 'TEXTAREA');

    if (oldValue === value && !isInputValue) {
        return;
    }

    // `class` and `style` accept both a string and a map, and are merged rather than replaced
    if (propertyKey === 'class') {
        setClasses(node as HTMLElement, value as ClassValue, oldValue as ClassValue);
        return;
    }
    if (propertyKey === 'style') {
        setStyle(node as HTMLElement, value as StyleValue, oldValue as StyleValue);
        return;
    }

    // `onclick` and friends are real properties of the node and are assigned as such, while
    // `onClick` and `on:click` exist only in the template and become event listeners
    if (propertyKey[0] === 'o' && propertyKey[1] === 'n' && !(propertyKey in node.constructor.prototype)) {
        const eventName = propertyKey[2] === ':' ? propertyKey.substring(3) : propertyKey.substring(2);
        if (oldValue) {
            (node as HTMLElement).removeEventListener(eventName, oldValue as EventListener);
        }
        if (value) {
            (node as HTMLElement).addEventListener(eventName, value as EventListener);
        }
        return;
    }

    const type = typeof value;

    // objects and functions have no attribute representation: they can only be assigned to
    // the node, and there is nothing left to reflect
    if ((value && type === 'object') || type === 'function') {
        (node as unknown as Record<string, unknown>)[propertyKey] = value;
        return;
    }

    const wasType = typeof oldValue;
    // a string is an attribute unless the node declares a writable property with that name:
    // this is what tells `<input value="x" />` from `<x-item count={2} />`
    let shouldSetAttribute = type === 'string' || !(propertyKey in node && isWritableProperty(node, propertyKey));

    if ((oldValue && wasType === 'object') || wasType === 'function' || isInputValue || !shouldSetAttribute) {
        (node as unknown as Record<string, unknown>)[propertyKey] = value;
    } else if (type === 'string' && ctr) {
        // a component declares how its attributes are parsed: when the property is declared,
        // the parsed value is assigned and the attribute is left to the property reflection
        const property = getProperty(node as ComponentInstance, propertyKey as keyof ComponentInstance);
        if (property) {
            (node as unknown as Record<string, unknown>)[propertyKey] = property.fromAttribute
                ? property.fromAttribute.call(node, value as string)
                : value;
            shouldSetAttribute = false;
        }
    }

    if (!shouldSetAttribute) {
        return;
    }

    // an empty value removes the attribute, while `true` renders it as a boolean attribute
    if (value == null || value === false) {
        if ((node as HTMLElement).hasAttribute(propertyKey)) {
            (node as HTMLElement).removeAttribute(propertyKey);
        }
        return;
    }

    const attrValue = value === true ? '' : (value as string).toString();
    if ((node as HTMLElement).getAttribute(propertyKey) !== attrValue) {
        (node as HTMLElement).setAttribute(propertyKey, attrValue);
    }
};

/* -------------------------------------------------------------------------------------------------
 * Signal bindings
 * ---------------------------------------------------------------------------------------------- */

/**
 * Set a property value to a node, binding it to the render context when it is a signal.
 * @param context The context of the node.
 * @param node The node to update.
 * @param propertyKey The property key to update.
 * @param value The new value.
 * @param oldValue The old value.
 * @param ctr The constructor of the node.
 */
const updateProperty = <T extends Node | HTMLElement, P extends string & keyof T>(
    context: Context,
    node: T,
    propertyKey: P,
    value: T[P] | undefined,
    oldValue?: T[P],
    ctr?: ComponentConstructor
) => {
    let previousValue = oldValue;

    const binding = context.bindings?.get(propertyKey);
    if (binding) {
        if (binding.signal === value) {
            // still bound to the same signal: the effect already keeps the node up to date
            return;
        }
        // a signal was bound to this property: the old value is the last one it applied,
        // not the signal object stored in the previous properties
        binding.dispose();
        context.bindings?.delete(propertyKey);
        previousValue = binding.value as T[P];
    }

    if (!isSignal(value)) {
        setProperty(node, propertyKey, value, previousValue, ctr);
        return;
    }

    const signal = value as SignalLike<T[P]>;
    const newBinding: SignalBinding = {
        signal,
        value: previousValue,
        dispose: () => {},
    };
    newBinding.dispose = effect(() => {
        const newValue = get(signal);
        // the node update must not become a dependency of this effect
        untrack(() => {
            setProperty(node, propertyKey, newValue, newBinding.value as T[P], ctr);
            newBinding.value = newValue;
        });
    });

    context.bindings = (context.bindings || new Map()).set(propertyKey, newBinding);
};

/**
 * Stop all the signal bindings of a context.
 * @param context The context to release.
 */
const disposeBindings = (context: Context) => {
    if (!context.bindings) {
        return;
    }
    for (const binding of context.bindings.values()) {
        binding.dispose();
    }
    context.bindings = undefined;
};

/* -------------------------------------------------------------------------------------------------
 * Context lifecycle
 * ---------------------------------------------------------------------------------------------- */

/**
 * Release the resources held by a context and its subtree: signal bindings, hooks and effects.
 * The content of a node the renderer does not own is emptied, because the renderer is the one
 * that put it there; a node the renderer created keeps its own content instead, since the
 * subtree is discarded as a whole and emptying it node by node would be visible work with no
 * effect.
 * It is idempotent, since a context can be released both inline and by the deferred pass.
 * @param context The context to release.
 * @param rootContext The root context the subtree belonged to.
 */
const releaseContext = (context: Context, rootContext: Context) => {
    disposeBindings(context);
    if (context.state) {
        new HooksManager(context.state).cleanup();
    }

    const children = context.children;
    const owned = context.kind === ContextKind.REF;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (rootContext.contexts.get(child.node) === child) {
            rootContext.contexts.delete(child.node);
        }
        if (owned && child.node.parentNode === context.node) {
            context.node.removeChild(child.node);
        }
        releaseContext(child, rootContext);
    }
    if (owned) {
        context.children = [];
    }
};

/**
 * Contexts detached during the current render, paired with their root context.
 * A detached context cannot be released right away: keyed nodes are removed from their
 * parent before being re-inserted at another position, so a context is known to be gone
 * only once the whole render has settled.
 */
const detachedContexts: [Context, Context][] = [];

/**
 * The nesting level of the current render.
 */
let renderDepth = 0;

/**
 * Whether detached contexts are being released.
 */
let releasing = false;

/**
 * Release the contexts that have been detached and never re-attached during the render.
 */
const releaseDetachedContexts = () => {
    if (releasing) {
        return;
    }
    releasing = true;
    try {
        // releasing a context runs user code — disconnected callbacks, effect cleanups — which
        // can detach further contexts: the queue is walked with a cursor rather than drained
        // from its head, so that what is appended while it runs is picked up by the same pass
        for (let i = 0; i < detachedContexts.length; i++) {
            const [context, rootContext] = detachedContexts[i];
            if (rootContext.contexts.get(context.node) === context) {
                // the context has been re-attached during the render
                continue;
            }
            releaseContext(context, rootContext);
        }
        detachedContexts.length = 0;
    } finally {
        releasing = false;
    }
};

/* -------------------------------------------------------------------------------------------------
 * Children list
 * ---------------------------------------------------------------------------------------------- */

/**
 * Detach the node of a context from the document and queue the context for release.
 * The context is not removed from the children of its parent: the caller either did it
 * already or is dropping a whole range at once, and looking it up again would turn the
 * removal of a long list into quadratic work.
 * @param parentContext The parent context.
 * @param childContext The child context to detach.
 * @param rootContext The root context.
 */
const detachNode = (parentContext: Context, childContext: Context, rootContext: Context) => {
    const parentNode = parentContext.node;
    const childNode = childContext.node;
    if (isComponent(parentNode) && !parentContext.shadow) {
        // the light children of a component are kept by its realm: only the ones it actually
        // holds can be removed from it
        if (parentNode.slotChildNodes.includes(childNode)) {
            parentNode.removeChild(childNode);
        }
    } else if (childNode.parentNode === parentNode) {
        parentNode.removeChild(childNode);
    }
    rootContext.contexts.delete(childNode);
    detachedContexts.push([childContext, rootContext]);
};

/**
 * Remove a node from the render tree.
 * @param parentContext The parent context.
 * @param childContext The child context to remove.
 * @param rootContext The root context.
 */
const removeNode = (parentContext: Context, childContext: Context, rootContext: Context) => {
    detachNode(parentContext, childContext, rootContext);
    const io = parentContext.children.indexOf(childContext);
    if (io !== -1) {
        parentContext.children.splice(io, 1);
    }
};

/**
 * Insert a node into the render tree.
 * @param parentContext The parent context.
 * @param childContext The child context.
 * @param rootContext The root context.
 */
const insertNode = (parentContext: Context, childContext: Context, rootContext: Context) => {
    const { node: parentNode, _pos: pos } = parentContext;
    const currentChildren = parentContext.children;

    // already where the template wants it: this is the common case of an update that did
    // not reorder anything, and it costs a single comparison
    if (currentChildren[pos] === childContext) {
        parentContext._pos++;
        return;
    }

    const from = currentChildren.indexOf(childContext);
    if (from > pos) {
        // the context is further down the list: move it up to the cursor, together with the
        // range of a fragment, which is contiguous and ends at `end`. The document is left
        // alone here and rearranged once by `reconcileNodes`, which needs the whole picture
        // to move the smallest possible number of nodes
        const endContext = childContext.end;
        const to = endContext && endContext !== childContext ? currentChildren.indexOf(endContext) : from;
        const range = currentChildren.splice(from, (to > from ? to : from) - from + 1);
        currentChildren.splice(pos, 0, ...range);
        parentContext._moved += range.length;
    } else if (from !== -1) {
        // the context is the one at the cursor, once the contexts in between are dropped:
        // they are stale children that the template did not render again
        let currentContext = currentChildren[pos];
        while (currentContext && childContext !== currentContext) {
            removeNode(parentContext, currentContext, rootContext);
            currentContext = currentChildren[pos];
        }
    } else {
        // brand new to this parent: it may still belong to another one, when a keyed node
        // moves across parents, and has to be removed from it first
        const currentChildContext = rootContext.contexts.get(childContext.node);
        if (currentChildContext?.parent && currentChildContext.parent !== parentContext) {
            removeNode(currentChildContext.parent, currentChildContext, rootContext);
        }
        parentNode.insertBefore(childContext.node, currentChildren[pos]?.node);
        currentChildren.splice(pos, 0, childContext);
        childContext.parent = parentContext;
        rootContext.contexts.set(childContext.node, childContext);
    }
    parentContext._pos++;
};

/**
 * Compute the longest increasing subsequence of a list of positions.
 * Entries equal to `-1` mark nodes without a previous position and never take part in it.
 * @param positions The previous position of each node, in the order the template wants them.
 * @returns The indexes of `positions` that form the subsequence, ascending.
 */
const getSequence = (positions: number[]): number[] => {
    const len = positions.length;
    // `previous[i]` is the index that comes before `i` in the subsequence ending at `i`, while
    // `tails[l]` is the index that ends the subsequence of length `l + 1` with the smallest tail
    const previous = new Array<number>(len);
    const tails: number[] = [];
    for (let i = 0; i < len; i++) {
        const position = positions[i];
        if (position === -1) {
            continue;
        }

        // extending the longest subsequence found so far is the common case, and the only
        // one when nothing moved: it is checked before searching
        const last = tails[tails.length - 1];
        if (!tails.length || positions[last] < position) {
            previous[i] = tails.length ? last : -1;
            tails.push(i);
            continue;
        }

        // otherwise this position ends some shorter subsequence with a smaller tail than the
        // one recorded: find it and replace its tail, which can only help the ones to come
        let low = 0;
        let high = tails.length - 1;
        while (low < high) {
            const middle = (low + high) >> 1;
            if (positions[tails[middle]] < position) {
                low = middle + 1;
            } else {
                high = middle;
            }
        }
        if (position < positions[tails[low]]) {
            previous[i] = low > 0 ? tails[low - 1] : -1;
            tails[low] = i;
        }
    }

    // `tails` only holds the end of each length: walking `previous` back from the longest one
    // turns it into the subsequence itself, which is written over `tails` in place
    let cursor = tails.length;
    let index = tails[cursor - 1];
    while (cursor-- > 0) {
        tails[cursor] = index;
        index = previous[index];
    }
    return tails;
};

/**
 * Move the nodes of a range of children so that the document matches the context list.
 * The nodes that already appear in a growing order are left alone: they are the longest
 * increasing subsequence of the current arrangement, and moving anything else around
 * them is the smallest number of insertions that can produce the requested order.
 *
 * Where every node sits is read from the document rather than from a copy of the list
 * taken before the render: a nested render of the same parent, which an effect can start
 * while this one is still walking, would leave such a copy describing an order that is
 * no longer the one on screen.
 * @param parentContext The parent context.
 * @param start The first index of the rendered range.
 * @param end The index after the last one of the rendered range.
 */
const reconcileNodes = (parentContext: Context, start: number, end: number) => {
    const parentNode = parentContext.node;
    const currentChildren = parentContext.children;
    const count = end - start;
    if (count <= 0) {
        return;
    }

    const currentPositions = new Map<Node, number>();
    const childNodes = parentNode.childNodes;
    for (let i = 0, len = childNodes.length; i < len; i++) {
        currentPositions.set(childNodes[i], i);
    }

    // where each rendered node currently sits, in the order the template wants them:
    // a node that is not in the document yet has no position worth keeping
    const positions = new Array<number>(count);
    for (let i = 0; i < count; i++) {
        const currentPosition = currentPositions.get(currentChildren[start + i].node);
        positions[i] = currentPosition === undefined ? -1 : currentPosition;
    }

    // the range is walked backwards, so that the node that follows the one being placed is
    // already in its final position and can be used as the anchor of the insertion
    const sequence = getSequence(positions);
    let cursor = sequence.length - 1;
    let anchor = currentChildren[end]?.node ?? null;
    for (let i = count - 1; i >= 0; i--) {
        const childContext = currentChildren[start + i];
        if (cursor >= 0 && sequence[cursor] === i) {
            cursor--;
        } else {
            parentNode.insertBefore(childContext.node, anchor);
        }
        anchor = childContext.node;
    }
};

/* -------------------------------------------------------------------------------------------------
 * Template rendering
 * ---------------------------------------------------------------------------------------------- */

/**
 * The properties of a template that declares none.
 * It is shared and never written to, so that an element without properties does not pay for
 * an object of its own on each and every render.
 */
const EMPTY_PROPERTIES: KeyedProperties & TreeProperties & EventProperties & ElementProperties = {};

/**
 * Render a a template into the root.
 * @param context The render context of the root.
 * @param rootContext The render root context.
 * @param template The template to render in Virtual DOM format.
 * @param namespace The current namespace uri of the render.
 * @param keys The current keys map of the render.
 * @param refs The current refs map of the render.
 * @param fragment The fragment context to update.
 */
const renderTemplate = (
    context: Context,
    rootContext: Context,
    template: Template,
    namespace: string,
    keys: Map<unknown, Context> | undefined,
    refs: Map<Node, Context> | undefined,
    fragment: Context = context
) => {
    // `null`, `undefined` and `false` are how a template says "nothing here"
    if (template == null || template === false) {
        return;
    }

    if (isArray(template)) {
        const len = template.length;
        if (len === 0) {
            return;
        }
        if (len === 1) {
            renderTemplate(context, rootContext, template[0], namespace, keys, refs, fragment);
            return;
        }

        // call the render function for each child
        for (let i = 0; i < len; i++) {
            renderTemplate(context, rootContext, template[i], namespace, keys, refs, fragment);
        }
        return;
    }

    const currentChildren = context.children;

    if (isVObject(template)) {
        /* ----- function components ----- */
        if (isVFunction(template)) {
            if (template.type === Fragment) {
                // a fragment has no identity of its own: its children belong to the context
                // and to the fragment that contain it
                renderTemplate(context, rootContext, template.children, namespace, keys, refs, fragment);
                return;
            }
            const { type: Fn, key, properties, children } = template;

            let functionContext: Context | undefined;
            const currentContext = currentChildren[context._pos];
            if (currentContext && currentContext.type === Fn && currentContext.key === key) {
                // the same function with the same key is already in this position:
                // this is also how a fragment finds itself again when it re-renders alone
                functionContext = currentContext;
            } else if (key != null) {
                functionContext = keys?.get(key);
            }

            // the context is inserted as is, rather than being looked up again from its node:
            // while reordering it may have been detached from the parent children already,
            // and recreating it would drop the hooks state the key is meant to preserve
            insertNode(
                context,
                functionContext ||
                    createContext(
                        ContextKind.REF,
                        null,
                        (context.node.ownerDocument as Document).createComment(Fn.name),
                        false,
                        rootContext
                    ),
                rootContext
            );

            // the comment marks where the fragment begins: what the function renders is not
            // nested into it but appended as its siblings, in this very same list, and the
            // last of them is remembered as `end` so that the range can be found again
            const renderContext = currentChildren[context._pos - 1];
            renderContext.type = Fn;
            renderContext.key = key;
            renderContext.state = renderContext.state || [];
            const hooks = new HooksManager(renderContext.state);
            if (key != null && renderContext !== fragment) {
                fragment.keys = (fragment.keys || new Map()).set(key, renderContext);
            }

            // the keys of the fragment are collected again by this render, while the refs are
            // kept: a node passed in a template has to be found again even when a render that
            // did not use it has run in between
            const childKeys = renderContext.keys;
            const childRefs = renderContext.refs;
            renderContext.keys = undefined;

            renderTemplate(
                context,
                rootContext,
                Fn(
                    {
                        children,
                        ...properties,
                    },
                    {
                        useState(initialValue) {
                            const [value, setInternal] = hooks.useState(initialValue);

                            return [
                                value,
                                (newValue: StateAction<typeof initialValue>, requestUpdate?: boolean) => {
                                    if (!setInternal(newValue)) {
                                        return;
                                    }
                                    if (requestUpdate === false) {
                                        return;
                                    }
                                    if (!currentChildren.includes(renderContext)) {
                                        // the fragment is gone: rendering it again would
                                        // bring back a subtree nobody references anymore
                                        return;
                                    }
                                    // only this fragment is rendered again, where it stands
                                    if (isComponent(rootContext.node) && rootContext.shadow) {
                                        rootContext.node.realm.requestUpdate(() => {
                                            internalRender(context, template, rootContext, namespace, renderContext);
                                        });
                                    } else {
                                        internalRender(context, template, rootContext, namespace, renderContext);
                                    }
                                },
                            ];
                        },
                        useRef: hooks.useRef.bind(hooks),
                        useMemo(factory, deps) {
                            return hooks.useMemo(factory, deps);
                        },
                        useCallback(callback, deps) {
                            return hooks.useCallback(callback, deps);
                        },
                        useEffect(effect: Effect, deps?: unknown[]) {
                            return hooks.useEffect(effect, deps);
                        },
                        useElement(tagName: string, options?: ElementCreationOptions) {
                            return hooks.useElement(tagName, options);
                        },
                        useId: (suffix?: string) => {
                            return hooks.useId(renderContext.node, suffix);
                        },
                        useRenderContext() {
                            return context;
                        },
                    }
                ),
                namespace,
                childKeys,
                childRefs,
                renderContext
            );

            renderContext.end = currentChildren[context._pos - 1];
            // the effects run once the fragment is in the document, and may render again
            hooks.runEffects();
            return;
        }

        /* ----- slots ----- */
        if (isVSlot(template)) {
            if (!isComponent(rootContext.node)) {
                return;
            }
            const { properties, children } = template;
            const name = properties?.name;
            // the light children assigned to this slot take the place of the template, which
            // is rendered only as a fallback, when the slot has nothing to show
            const slotted = rootContext.node.childNodesBySlot(name);
            if (slotted.length) {
                renderTemplate(context, rootContext, slotted, namespace, keys, refs, fragment);
            } else if (children) {
                renderTemplate(context, rootContext, children, namespace, keys, refs, fragment);
            }
            return;
        }

        /* ----- elements ----- */
        const { key, children, namespace: namespaceURI = namespace } = template;
        const properties = (template.properties || EMPTY_PROPERTIES) as KeyedProperties &
            TreeProperties &
            EventProperties &
            ElementProperties;

        // an existing node is reused when the key says so, or when the one at the cursor was
        // generated by this same render out of a compatible tag
        let templateContext: Context | undefined;
        const currentContext = currentChildren[context._pos];
        if (key != null) {
            templateContext = keys?.get(key);
        } else if (currentContext && currentContext.key == null && currentContext.owner === rootContext) {
            if (
                isVTag(template) &&
                currentContext.kind === ContextKind.VNODE &&
                currentContext.type === template.type &&
                currentContext.properties?.is === properties?.is
            ) {
                templateContext = currentContext;
            }
        }

        // a node rendered inside a component belongs to its realm, which has to adopt it
        if (!templateContext) {
            if (isVNode(template)) {
                // the template carries a node instance: it keeps the context it was given the
                // first time, so that what has been rendered into it is not rendered again
                const node = template.type;
                templateContext = refs?.get(node) || createContext(ContextKind.REF, null, node, false, rootContext);
                fragment.refs = (fragment.refs || new Map()).set(node, templateContext);
                if (
                    isComponent(rootContext.node) &&
                    rootContext.shadow &&
                    // unless it is one of the light children of the component, which the
                    // realm already holds on behalf of whoever passed it
                    !rootContext.node.slotChildNodes.includes(node)
                ) {
                    rootContext.node.realm.own(node);
                }
            } else {
                const ctr = customElements?.get(properties?.is ?? template.type);
                const node = ctr
                    ? new ctr()
                    : (context.node.ownerDocument as Document).createElementNS(namespaceURI, template.type);
                templateContext = createContext(
                    ContextKind.VNODE,
                    template.type,
                    node,
                    false,
                    rootContext,
                    rootContext
                );
                if (isComponent(rootContext.node) && rootContext.shadow) {
                    // the node has just been created, so it cannot be a light child already
                    // and there is no list to search it into
                    rootContext.node.realm.own(node);
                }
            }
        }

        const node = templateContext.node;
        if (key != null) {
            templateContext.key = key;
            fragment.keys = (fragment.keys || new Map()).set(key, templateContext);
        }

        // update node properties
        const oldProperties = templateContext.properties as
            | undefined
            | (KeyedProperties & TreeProperties & EventProperties & ElementProperties);
        templateContext.properties = properties;

        let ctr: ComponentConstructor | undefined;
        if (isComponent(node)) {
            ctr = (node as ComponentInstance).constructor as ComponentConstructor;
            // the whole property update is a single change as far as the component is
            // concerned: it renders once at the end, instead of once per property
            node.collectUpdatesStart();
        }

        // the properties the previous render had set and this one does not are unset first,
        // so that a property that replaces another one does not find a stale value in place
        if (oldProperties) {
            for (const propertyKey in oldProperties) {
                if (!(propertyKey in properties) && !shouldIgnoreProperty(node, propertyKey)) {
                    updateProperty(
                        templateContext,
                        node,
                        propertyKey as keyof Node,
                        undefined,
                        oldProperties[propertyKey as keyof typeof oldProperties] as Node[keyof Node],
                        ctr
                    );
                }
            }
        }

        for (const propertyKey in properties) {
            if (!shouldIgnoreProperty(node, propertyKey)) {
                updateProperty(
                    templateContext,
                    node,
                    propertyKey as keyof Node,
                    properties[propertyKey as keyof typeof properties] as Node[keyof Node],
                    oldProperties?.[propertyKey as keyof typeof oldProperties] as Node[keyof Node],
                    ctr
                );
            }
        }

        if (ctr) {
            (node as ComponentInstance).collectUpdatesEnd();
        }

        insertNode(context, templateContext, rootContext);

        // a node this render owns is rendered again even when it has no children, so that
        // whatever it used to contain is removed
        if (children?.length || templateContext.root === rootContext) {
            internalRender(templateContext, children, rootContext, namespaceURI, undefined);
        }
        return;
    }

    if (isSignal(template)) {
        // render the signal through a function component, in order to reuse
        // the fragment update and the hooks cleanup of the render context
        renderTemplate(context, rootContext, $signal(template), namespace, keys, refs, fragment);
        return;
    }

    if (template instanceof Node) {
        insertNode(
            context,
            currentChildren.find((child) => child.node === template) ||
                createContext(ContextKind.REF, null, template, false, rootContext),
            rootContext
        );
        return;
    }

    /* ----- text ----- */
    // the content of a style element rendered by a component is scoped to its definition
    const normalizedTemplate =
        isComponent(rootContext.node) && rootContext.shadow && (context.node as HTMLElement).tagName === 'STYLE'
            ? css(rootContext.node.is, String(template))
            : String(template);

    // a text node already in this position is updated in place rather than replaced
    const currentContext = currentChildren[context._pos];
    if (currentContext?.kind === ContextKind.LITERAL && currentContext.owner === rootContext) {
        if (currentContext.type !== normalizedTemplate) {
            currentContext.type = normalizedTemplate;
            currentContext.node.nodeValue = normalizedTemplate;
        }
        insertNode(context, currentContext, rootContext);
        return;
    }

    // convert non-Node template into Text
    insertNode(
        context,
        createContext(
            ContextKind.LITERAL,
            normalizedTemplate,
            (context.node.ownerDocument as Document).createTextNode(normalizedTemplate),
            false,
            rootContext,
            rootContext
        ),
        rootContext
    );
};

/* -------------------------------------------------------------------------------------------------
 * Entry points
 * ---------------------------------------------------------------------------------------------- */

/**
 * Render a set of nodes into the render root, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param context The render context of the root.
 * @param template The child (or the children) to render in Virtual DOM format or already generated.
 * @param rootContext The current root context of the render.
 * @param namespace The current namespace uri of the render.
 * @param fragment The fragment context to update.
 * @returns The resulting child nodes list.
 */
export const internalRender = (
    context: Context,
    template: Template,
    rootContext: Context = context,
    namespace = 'http://www.w3.org/1999/xhtml',
    fragment?: Context
): Context[] => {
    const contextChildren = context.children;

    renderDepth++;
    try {
        let previousRange: Set<Context> | undefined;
        let currentKeys: Map<unknown, Context> | undefined;
        let currentRefs: Map<Node, Context> | undefined;
        if (fragment) {
            // only one fragment is rendered again: the cursor starts at its marker, and the
            // contexts it owned are remembered, because everything around them belongs to
            // other fragments and has to come out of this render untouched
            context._pos = contextChildren.indexOf(fragment);
            const endContext = fragment.end as Context | undefined;
            // the range of a fragment never begins before its own marker, so the search for
            // its end can start from there instead of walking the whole list of siblings
            const endIndex = endContext ? contextChildren.indexOf(endContext, Math.max(context._pos, 0)) : -1;
            if (endIndex >= context._pos) {
                previousRange = new Set();
                for (let i = context._pos; i <= endIndex; i++) {
                    previousRange.add(contextChildren[i]);
                }
            }
        } else {
            context._pos = 0;
            currentKeys = context.keys;
            currentRefs = context.refs;
            context.keys = undefined;
        }

        const start = context._pos;
        // a nested render of this same context must not be taken for a move of this one
        const previousMoved = context._moved;
        context._moved = 0;

        renderTemplate(context, rootContext, template, namespace, currentKeys, currentRefs, fragment);

        // whatever is left after the cursor has not been rendered again. The nodes are taken
        // out of the document right away, while their contexts are released only once the
        // render has settled: a keyed node may still be re-inserted somewhere else before it
        // ends, and releasing it here would throw away the state its key is meant to preserve
        const currentIndex = context._pos;
        for (let i = contextChildren.length - 1; i >= currentIndex; i--) {
            const child = contextChildren[i];
            if (previousRange && !previousRange.has(child)) {
                continue;
            }
            contextChildren.splice(i, 1);
            detachNode(context, child, rootContext);
        }

        // the document is rearranged once, and only if something actually moved
        if (context._moved) {
            reconcileNodes(context, start, currentIndex);
        }
        context._moved = previousMoved;

        return contextChildren;
    } finally {
        renderDepth--;
        if (renderDepth === 0) {
            releaseDetachedContexts();
        }
    }
};

/**
 * Render a set of Nodes into another, with some checks for Nodes in order to avoid
 * useless changes in the tree and to mantain or update the state of compatible Nodes.
 *
 * @param input The child (or the children) to render in Virtual DOM format or already generated.
 * @param root The root Node for the render.
 * @returns The resulting child Nodes.
 */
export const render = (input: Template, root: Node = document.createDocumentFragment()): Node | Node[] | undefined => {
    const contexts = internalRender(getRootContext(root), input);

    // a template that is explicitly a list or a fragment always renders to a list, even when
    // it produced a single node; anything else renders to the node itself
    const isList = isArray(input) || (input != null && isVObject(input) && input.type === Fragment);
    if (!isList && contexts.length < 2) {
        return contexts[0]?.node;
    }

    const len = contexts.length;
    const childNodes = new Array<Node>(len);
    for (let i = 0; i < len; i++) {
        childNodes[i] = contexts[i].node;
    }
    return childNodes;
};
