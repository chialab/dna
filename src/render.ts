import { type ComponentConstructor, type ComponentInstance, isComponent } from './Component';
import { css } from './css';
import { $signal } from './directives';
import { Hooks } from './Hooks';
import {
    getOwnPropertyDescriptor,
    getPropertyDescriptor,
    getPrototypeOf,
    hasOwn,
    isArray,
    plainObject,
} from './helpers';
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
    children?: Context[];
    contexts?: WeakMap<Node, Context>;
    properties?: KeyedProperties & TreeProperties & Record<string, unknown>;
    hooks?: Hooks;
    bindings?: Map<string, SignalBinding>;
    end?: Context;
    key?: unknown;
    keys?: Map<unknown, Context>;
    refs?: Map<Node, Context>;
    shadow?: boolean;
    _index: number;
    _cursor?: number;
    _shift?: number;
    _release?: boolean;
    /**
     * The contexts detached during the current render.
     * A detached context cannot be released right away: keyed nodes are removed from their
     * parent before being re-inserted at another position, so a context is known to be gone
     * only once the whole render has settled.
     */
    _detached?: Context[];
    /**
     * The nesting level of the current render.
     */
    _depth?: number;
    /**
     * Whether detached contexts are being released.
     */
    _releasing?: boolean;
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
    // the fields a render fills in later are declared here even though they hold nothing yet:
    // adding one to an object that does not have it changes its shape and moves its properties
    // to a store of their own, and every node of a template is given a parent and a set of
    // properties right after having been created
    parent: undefined,
    properties: undefined,
    hooks: undefined,
    bindings: undefined,
    end: undefined,
    key: undefined,
    keys: undefined,
    refs: undefined,
    // a text node is a leaf: nothing is ever rendered into it, and the list it would be given
    // is the same empty one for all of them
    children: undefined,
    // the node -> context map belongs to the render root, which is the only context it is ever
    // read from: it is created by the first context that has to be found again from its node,
    // and a render that never places one does not allocate it at all
    contexts: undefined,
    shadow,
    _cursor: 0,
    _shift: 0,
    // no position yet: any slot of the children list would be a miss, which is what the
    // lookup expects of a context it has never placed
    _index: -1,
    // a node the renderer does not own has to be emptied when it is dropped, and it is the
    // only kind that holds something to release from the moment it is created
    _release: kind === ContextKind.REF,
    // the state of a render belongs to the root of the tree it walks, which is the only
    // context it is ever read from: every other one leaves the field empty
    _detached: root ? undefined : [],
    _depth: root ? undefined : 0,
    _releasing: root ? undefined : false,
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
const hyphenatedProperties = plainObject<Record<string, string>>();

/**
 * A regular expression literal is a new object on every evaluation: the ones of a hot path
 * are created once and reused, instead of being allocated at each call of their function.
 */
const UPPERCASE_REGEX = /[A-Z]/g;

/**
 * The pattern that separates two class names.
 */
const WHITESPACE_REGEX = /\s+/;

/**
 * The result of converting an empty `class` or `style` value.
 * Both conversions are read but never written by their callers, so the empty case is a shared
 * object rather than one allocated at each call: a `class` update converts twice, and most of
 * the elements of a template declare no style at all.
 */
const EMPTY = plainObject<Record<string, never>>();

/**
 * Convert a camel case style property name to its hyphenated form.
 * @param propertyKey The property name to convert.
 * @returns The hyphenated property name.
 */
const hyphenate = (propertyKey: string) => {
    let hyphenated = hyphenatedProperties[propertyKey];
    if (hyphenated === undefined) {
        if (propertyKey.startsWith('-')) {
            // a custom property is declared as it is written, and two names that differ only by
            // case — `--fooBar` and `--foobar` — are two distinct properties: a name that already
            // begins with a dash, be it a custom property or a vendor prefixed one, is left alone
            hyphenated = propertyKey;
        } else {
            hyphenated = propertyKey.replace(UPPERCASE_REGEX, (match: string) => `-${match.toLowerCase()}`);
            if (hyphenated.startsWith('ms-')) {
                // `-ms-` is the one vendor prefix whose camel case form begins in lower case:
                // unlike `WebkitTransform`, `msTransform` has no capital to turn into a leading dash
                hyphenated = `-${hyphenated}`;
            }
        }
        hyphenatedProperties[propertyKey] = hyphenated;
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
        return EMPTY;
    }
    if (typeof value === 'object') {
        return value;
    }

    // a map with no prototype, so that a class named after one of its members — `constructor`
    // is a valid class name — is not found on it. The literal notation is the one an engine
    // can keep in its fast representation, unlike `Object.create(null)`
    const classes = plainObject<Record<string, boolean | undefined>>();
    // any run of whitespace separates two class names, and empty tokens are dropped
    // because `classList` refuses them
    for (const className of value.split(WHITESPACE_REGEX)) {
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
    if (!value) {
        return EMPTY;
    }

    const styles = plainObject<Record<string, string>>();
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
 * @param isNew If the node has just been created, and has no class of its own to preserve.
 */
const setClasses = (node: HTMLElement, value: ClassValue, oldValue: ClassValue, isNew?: boolean) => {
    if (value == null) {
        if (!isNew) {
            node.removeAttribute('class');
        }
        return;
    }
    if (typeof value === 'string' && (isNew || node.className === (oldValue || ''))) {
        node.className = value;
        return;
    }

    const classes = convertClasses(value);
    const classList = node.classList;
    for (const className in convertClasses(oldValue)) {
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
 * @param isNew If the node has just been created, and has no style of its own to preserve.
 */
const setStyle = (node: HTMLElement, value: StyleValue, oldValue: StyleValue, isNew?: boolean) => {
    if (value == null) {
        if (!isNew) {
            node.removeAttribute('style');
        }
        return;
    }
    if (typeof value === 'string' && (isNew || node.getAttribute('style') === oldValue)) {
        node.setAttribute('style', value);
        return;
    }

    const styles = convertStyles(value);
    const style = node.style;
    for (const propertyKey in convertStyles(oldValue)) {
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
    // an own property shadows the whole chain, so it is always looked up. Asking whether there
    // is one comes first, because reading the descriptor allocates an object to describe it and
    // a node whose properties all come from its class — which is most of them — has none
    if (hasOwn.call(element, propertyKey)) {
        const ownDescriptor = getOwnPropertyDescriptor(element, propertyKey) as PropertyDescriptor;
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
 * @param isNew If the node has just been created by this render, and therefore holds no
 * attribute of its own: what the template declares is written without being compared first,
 * and what it does not declare has nothing to remove.
 */
const setProperty = <T extends Node | HTMLElement, P extends string & keyof T>(
    node: T,
    propertyKey: P,
    value: T[P] | undefined,
    oldValue?: T[P],
    ctr?: ComponentConstructor,
    isNew?: boolean
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
        setClasses(node as HTMLElement, value as ClassValue, oldValue as ClassValue, isNew);
        return;
    }
    if (propertyKey === 'style') {
        setStyle(node as HTMLElement, value as StyleValue, oldValue as StyleValue, isNew);
        return;
    }

    // `onclick` and friends are real properties of the node and are assigned as such, while
    // `onClick` and `on:click` exist only in the template and become event listeners
    if (propertyKey[0] === 'o' && propertyKey[1] === 'n') {
        const eventName =
            propertyKey in node ? null : propertyKey[2] === ':' ? propertyKey.substring(3) : propertyKey.substring(2);
        if (eventName !== null) {
            if (oldValue) {
                (node as HTMLElement).removeEventListener(eventName, oldValue as EventListener);
            }
            if (value) {
                (node as HTMLElement).addEventListener(eventName, value as EventListener);
            }
            return;
        }
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

    // an empty value removes the attribute, while `true` renders it as a boolean attribute.
    // Removing an attribute the node does not have is a no-op, and is left to the DOM rather
    // than being asked about first
    if (value == null || value === false) {
        if (!isNew) {
            (node as HTMLElement).removeAttribute(propertyKey);
        }
        return;
    }

    const attrValue = value === true ? '' : (value as string).toString();
    if (isNew || (node as HTMLElement).getAttribute(propertyKey) !== attrValue) {
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
 * @param isNew If the node has just been created by this render.
 */
const updateProperty = <T extends Node | HTMLElement, P extends string & keyof T>(
    context: Context,
    node: T,
    propertyKey: P,
    value: T[P] | undefined,
    oldValue?: T[P],
    ctr?: ComponentConstructor,
    isNew?: boolean
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
        setProperty(node, propertyKey, value, previousValue, ctr, isNew);
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
    // the binding has to be stopped when the node is dropped, so the subtree that holds it
    // can no longer be thrown away without being walked
    markRelease(context);
};

/**
 * Mark a context, and the chain of the ones that contain it, as holding something to release.
 * The flag is what lets a dropped subtree be walked only when walking it has an effect: most of
 * what a template renders is plain elements with nothing attached, and a list of them is thrown
 * away as a whole instead of node by node.
 * @param context The context to mark.
 */
const markRelease = (context: Context | undefined) => {
    // the chain above an already marked context is marked too, so the walk stops at the first
    // context that knows about it
    let current = context;
    while (current && !current._release) {
        current._release = true;
        current = current.parent;
    }
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
 *
 * A child that holds nothing to release is skipped along with everything below it: dropping a
 * list of plain elements is then a single step instead of one per node of it. What is left
 * behind is the entry of those nodes in the node -> context map, which is weak and dies with
 * the nodes themselves; the map is only ever asked about a node a template names again, and a
 * node that is named again is taken out of the subtree it used to belong to, entry included.
 *
 * It is idempotent, since a context can be released both inline and by the deferred pass.
 * @param context The context to release.
 * @param rootContext The root context the subtree belonged to.
 */
const releaseContext = (context: Context, rootContext: Context) => {
    disposeBindings(context);
    // the hooks are left in place: they are the state of a fragment that is gone, and
    // emptying them is enough
    context.hooks?.cleanup();

    const children = context.children;
    if (!children) {
        return;
    }

    const owned = context.kind === ContextKind.REF;
    for (const child of children) {
        if (owned && child.node.parentNode === context.node) {
            context.node.removeChild(child.node);
        }
        if (!child._release) {
            continue;
        }
        if (rootContext.contexts?.get(child.node) === child) {
            rootContext.contexts.delete(child.node);
        }
        releaseContext(child, rootContext);
    }
    if (owned) {
        context.children = [];
    }
};

/**
 * Release the contexts that have been detached and never re-attached during the render.
 * @param rootContext The root context of the render that has settled.
 */
const releaseDetachedContexts = (rootContext: Context) => {
    if (rootContext._releasing) {
        return;
    }
    rootContext._releasing = true;
    try {
        // releasing a context runs user code — disconnected callbacks, effect cleanups — which
        // can detach further contexts: the queue is walked with a cursor rather than drained
        // from its head, so that what is appended while it runs is picked up by the same pass
        const detached = rootContext._detached;
        if (detached) {
            for (const context of detached) {
                if (!context._release) {
                    // the subtree holds nothing to release: it is dropped with its node
                    continue;
                }
                if (rootContext.contexts?.get(context.node) === context) {
                    // the context has been re-attached during the render
                    continue;
                }
                releaseContext(context, rootContext);
            }
        }
        rootContext._detached = undefined;
    } finally {
        rootContext._releasing = false;
    }
};

/* -------------------------------------------------------------------------------------------------
 * Children list
 * ---------------------------------------------------------------------------------------------- */

/**
 * Check whether a context can be reached from anywhere but the list of its parent.
 *
 * A keyed context is looked up by its key, and one the renderer does not own by its node:
 * both can be handed to another parent, or be re-inserted after having been detached, so
 * the node they hold has to lead back to them. Anything else — the elements and the texts
 * a template declares without a key — is only ever reached through the cursor walking the
 * children of its parent, and once it leaves that list nothing can name it again.
 *
 * The map they would go into is weak, and an entry in it costs the collector far more than
 * an ordinary one: keeping the nodes that no one can look up out of it is what stops a
 * render from making the whole tree expensive to collect.
 * @param context The context to check.
 * @returns `true` when the node of the context has to lead back to it.
 */
const isFindable = (context: Context) => context.key != null || context.kind === ContextKind.REF;

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
    if (isFindable(childContext)) {
        // the entry is what tells a context re-inserted later in this same render from one
        // that is gone: only the contexts that have one are asked to drop it
        rootContext.contexts?.delete(childNode);
    }
    // the render state belongs to the root of the tree being walked, and a context is only
    // ever detached while that tree is being rendered
    rootContext._detached ??= [];
    rootContext._detached.push(childContext);
};

/**
 * Check whether a children list holds a node the renderer does not own.
 * Such a node may be a light child a component handed to one of its slots, and the realm that
 * holds it keeps its own account of where it went: it has to be taken out of its parent one node
 * at a time, through the removal the realm watches, rather than by emptying the parent at once.
 * @param children The children list to check.
 * @returns `true` when at least one of them is a node the renderer was given.
 */
const holdsForeignNode = (children: Context[]) => {
    for (const child of children) {
        if (child.kind === ContextKind.REF) {
            return true;
        }
    }
    return false;
};

/**
 * Find a context in a children list.
 * The position the context was last placed at is remembered on the context itself and is
 * checked before searching: a list is walked looking for contexts that mostly still are
 * where the previous render left them, and scanning for each of them would turn a reorder
 * into quadratic work. The slot is compared by identity, so a remembered position that has
 * gone stale — every insertion or removal shifts the ones that follow it — is a miss and
 * nothing more.
 * @param children The children list to search.
 * @param context The context to look for.
 * @returns The index of the context, or `-1` when the list does not hold it.
 */
const indexOfContext = (children: Context[], context: Context) => {
    return children[context._index] === context ? context._index : children.indexOf(context);
};

/**
 * Remove a node from the render tree.
 * @param parentContext The parent context.
 * @param childContext The child context to remove.
 * @param rootContext The root context.
 */
const removeNode = (parentContext: Context, childContext: Context, rootContext: Context) => {
    detachNode(parentContext, childContext, rootContext);
    if (parentContext.children) {
        const io = indexOfContext(parentContext.children, childContext);
        if (io !== -1) {
            parentContext.children.splice(io, 1);
        }
    }
};

/**
 * Insert a node into the render tree.
 * @param parentContext The parent context.
 * @param childContext The child context.
 * @param rootContext The root context.
 */
const insertNode = (parentContext: Context, childContext: Context, rootContext: Context) => {
    const pos = parentContext._cursor ?? 0;

    parentContext.children ??= [];

    // already where the template wants it: this is the common case of an update that did
    // not reorder anything, and it costs a single comparison. Nothing else is read here,
    // because this runs for every node of every render
    if (parentContext.children[pos] === childContext) {
        childContext._index = pos;
        parentContext._cursor = pos + 1;
        return;
    }

    // only the children of this parent can be found in its list, and the parent a context
    // belongs to is remembered on it: without this check every node a render creates — which
    // belongs to no parent yet — would scan the whole list to learn what is already known,
    // and building a list of n nodes would cost n²/2 comparisons
    const from = childContext.parent === parentContext ? indexOfContext(parentContext.children, childContext) : -1;
    if (from > pos) {
        // the context is further down the list: move it up to the cursor, together with the
        // range of a fragment, which is contiguous and ends at `end`. The document is left
        // alone here and rearranged once by `reconcileNodes`, which needs the whole picture
        // to move the smallest possible number of nodes
        const endContext = childContext.end;
        const to =
            endContext && endContext !== childContext ? indexOfContext(parentContext.children, endContext) : from;
        if (to <= from) {
            // a single child: exchange it with the one at the cursor, instead of shifting
            // everything in between. The displaced context lands on a slot the walk has not
            // reached yet, where it is still found — by key, or by the cursor itself once it
            // gets there. Shifting would cost one copy per sibling, and a list where every
            // row is displaced, as in a swap, would be quadratic in the number of rows
            const displaced = parentContext.children[pos];
            parentContext.children[from] = displaced;
            parentContext.children[pos] = childContext;
            displaced._index = from;
            childContext._index = pos;
            parentContext._shift = (parentContext._shift ?? 0) + 1;
        } else {
            // a function component owns the contiguous range up to `end` and moves whole
            const range = parentContext.children.splice(from, to - from + 1);
            parentContext.children.splice(pos, 0, ...range);
            // only the contexts between the cursor and the end of the range changed place
            for (let i = pos; i <= to; i++) {
                parentContext.children[i]._index = i;
            }
            parentContext._shift = (parentContext._shift ?? 0) + range.length;
        }
    } else if (from !== -1) {
        // the context is the one at the cursor, once the contexts in between are dropped:
        // they are stale children that the template did not render again
        let currentContext = parentContext.children[pos];
        while (currentContext && childContext !== currentContext) {
            removeNode(parentContext, currentContext, rootContext);
            currentContext = parentContext.children[pos];
        }
    } else {
        // brand new to this parent: it may still belong to another one, when a keyed node
        // moves across parents, and has to be removed from it first. A node this render has
        // just created cannot: it is reachable from nowhere else, and the lookup — one per
        // node of a first render — would always miss
        if (childContext.parent !== undefined || childContext.kind === ContextKind.REF) {
            const currentChildContext = rootContext.contexts?.get(childContext.node);
            if (currentChildContext?.parent && currentChildContext.parent !== parentContext) {
                removeNode(currentChildContext.parent, currentChildContext, rootContext);
            }
        }
        if (pos === parentContext.children.length) {
            // building a list appends every one of its nodes: the document is asked to append,
            // which is the same operation without the anchor to convert, and a splice at the end
            // of an array still builds the array of what it removed — an empty one, for each node
            parentContext.node.appendChild(childContext.node);
            parentContext.children.push(childContext);
        } else {
            parentContext.node.insertBefore(childContext.node, parentContext.children[pos].node);
            parentContext.children.splice(pos, 0, childContext);
        }
        childContext._index = pos;
        childContext.parent = parentContext;
        if (isFindable(childContext)) {
            rootContext.contexts ??= new WeakMap();
            rootContext.contexts.set(childContext.node, childContext);
        }
        if (childContext._release) {
            // whatever the child holds has to be found again from the list it now belongs to
            markRelease(parentContext);
        }
    }
    parentContext._cursor = pos + 1;
};

/**
 * Compute the longest increasing subsequence of a list of positions.
 * Entries equal to `-1` mark nodes without a previous position and never take part in it.
 * @param positions The previous position of each node, in the order the template wants them.
 * @returns The indexes of `positions` that form the subsequence, ascending.
 */
const getSequence = (positions: Int32Array): number[] => {
    const len = positions.length;
    // `previous[i]` is the index that comes before `i` in the subsequence ending at `i`, while
    // `tails[l]` is the index that ends the subsequence of length `l + 1` with the smallest tail.
    // Both hold nothing but indexes: a typed array is half the memory of the array of holes that
    // sizing an ordinary one produces, and is not slowed down by them
    const previous = new Int32Array(len);
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
    if (!currentChildren) {
        return;
    }

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
    const positions = new Int32Array(count);
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

/**
 * The properties of a template that declares none.
 * It is shared and never written to, so that an element without properties does not pay for
 * an object of its own on each and every render.
 */
const EMPTY_PROPERTIES: KeyedProperties & TreeProperties & EventProperties & ElementProperties = {};

/**
 * The namespace of an HTML document, which is the one a render starts in.
 */
const HTML_NAMESPACE: string = 'http://www.w3.org/1999/xhtml';

/* -------------------------------------------------------------------------------------------------
 * Fragment hooks
 * ---------------------------------------------------------------------------------------------- */

/**
 * Render again the fragment of a function component, after one of its hooks changed its state.
 * It is the way back into the renderer the hooks are given, and the one thing they cannot do
 * on their own.
 *
 * Where the fragment stands is read when the render is requested, not when the setter that
 * requests it was handed out: a setter outlives the render it comes from, and the fragment may
 * have been rendered into another place since.
 * @param hooks The hooks of the fragment.
 */
const requestFragmentRender = (hooks: Hooks) => {
    const { renderContext, context, rootContext } = hooks;
    if (!context.children?.includes(renderContext)) {
        // the fragment is gone: rendering it again would bring back a subtree nobody
        // references anymore
        return;
    }

    // only this fragment is rendered again, where it stands
    if (isComponent(rootContext.node) && rootContext.shadow) {
        rootContext.node.realm.requestUpdate(() => {
            internalRender(hooks.context, hooks.template, hooks.rootContext, hooks.namespace, renderContext);
        });
        return;
    }
    internalRender(context, hooks.template, rootContext, hooks.namespace, renderContext);
};

/* -------------------------------------------------------------------------------------------------
 * Template rendering
 * ---------------------------------------------------------------------------------------------- */

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

    context.children ??= [];

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
            const currentContext = context.children[context._cursor ?? 0];
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
            const renderContext = context.children[(context._cursor ?? 0) - 1];
            renderContext.type = Fn;
            renderContext.key = key;
            if (key != null && renderContext !== fragment) {
                fragment.keys ??= new Map();
                fragment.keys.set(key, renderContext);
            }

            // the hooks belong to the fragment and outlive its renders, together with the state
            // they hold: a fragment that renders again does not build them — nor the closures
            // they are made of — a second time, and it renders again on every state change
            const hooks = renderContext.hooks || new Hooks(renderContext, requestFragmentRender);
            renderContext.hooks = hooks;

            // the keys of the fragment are collected again by this render, while the refs are
            // kept: a node passed in a template has to be found again even when a render that
            // did not use it has run in between
            const childKeys = renderContext.keys;
            const childRefs = renderContext.refs;
            renderContext.keys = undefined;

            const previousIndex = hooks.beginRender(context, rootContext, namespace, template);
            const result = Fn(
                {
                    children,
                    ...properties,
                },
                hooks.api
            );
            hooks.endRender(previousIndex);

            renderTemplate(context, rootContext, result, namespace, childKeys, childRefs, renderContext);

            renderContext.end = context.children[(context._cursor ?? 0) - 1];
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
        const currentContext = context.children[context._cursor ?? 0];
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
        let isNew = false;
        if (!templateContext) {
            if (isVNode(template)) {
                // the template carries a node instance: it keeps the context it was given the
                // first time, so that what has been rendered into it is not rendered again
                const node = template.type;
                templateContext = refs?.get(node) || createContext(ContextKind.REF, null, node, false, rootContext);
                fragment.refs = (fragment.refs || new Map()).set(node, templateContext);
                if (
                    // whether the render is a shadow one is a flag of the context, and is read
                    // before asking the node what it is: a render that is not one — every render
                    // that does not come from a component — stops here
                    rootContext.shadow &&
                    isComponent(rootContext.node) &&
                    // unless it is one of the light children of the component, which the
                    // realm already holds on behalf of whoever passed it
                    !rootContext.node.slotChildNodes.includes(node)
                ) {
                    rootContext.node.realm.own(node);
                }
            } else {
                const definition = properties.is ?? template.type;
                // the name of a custom element always contains a hyphen: a plain tag can never
                // have been registered as one, and the registry — which every element of every
                // render would otherwise be looked up into — does not need to be asked
                const ctr = definition.indexOf('-') === -1 ? undefined : customElements?.get(definition);
                const document = context.node.ownerDocument as Document;
                const node = ctr
                    ? new ctr()
                    : // `createElementNS` is the slower of the two and is only needed to leave the
                      // document tree for another one, as an `<svg>` subtree does
                      namespaceURI === HTML_NAMESPACE
                      ? document.createElement(template.type)
                      : document.createElementNS(namespaceURI, template.type);
                templateContext = createContext(
                    ContextKind.VNODE,
                    template.type,
                    node,
                    false,
                    rootContext,
                    rootContext
                );
                // the element comes out of the document with no attribute of its own: what the
                // template declares can be written straight away, without asking the node what
                // it holds and without removing what it never had
                isNew = true;
                if (rootContext.shadow && isComponent(rootContext.node)) {
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
                    ctr,
                    isNew
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
        // the list is searched with a plain loop, so that looking for the node does not allocate
        // the closure that would capture it
        let nodeContext: Context | undefined;
        for (const childContext of context.children) {
            if (childContext.node === template) {
                nodeContext = childContext;
                break;
            }
        }
        insertNode(
            context,
            nodeContext || createContext(ContextKind.REF, null, template, false, rootContext),
            rootContext
        );
        return;
    }

    /* ----- text ----- */
    // the content of a style element rendered by a component is scoped to its definition
    const normalizedTemplate =
        rootContext.shadow && isComponent(rootContext.node) && (context.node as HTMLElement).tagName === 'STYLE'
            ? css(rootContext.node.is, String(template))
            : String(template);

    // a text node already in this position is updated in place rather than replaced
    const currentContext = context.children[context._cursor ?? 0];
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
    namespace: string = HTML_NAMESPACE,
    fragment?: Context
): Context[] => {
    context.children ??= [];

    // the render this one belongs to is the one of its root: a nested render of another tree —
    // a component rendering while its properties are assigned — is a render of its own, and
    // settles on its own
    rootContext._depth = (rootContext._depth ?? 0) + 1;
    try {
        let previousRange: Set<Context> | undefined;
        let currentKeys: Map<unknown, Context> | undefined;
        let currentRefs: Map<Node, Context> | undefined;
        if (fragment) {
            // only one fragment is rendered again: the cursor starts at its marker, and the
            // contexts it owned are remembered, because everything around them belongs to
            // other fragments and has to come out of this render untouched
            context._cursor = indexOfContext(context.children, fragment);
            const endContext = fragment.end as Context | undefined;
            // the range of a fragment never begins before its own marker, so the search for
            // its end can start from there instead of walking the whole list of siblings
            const endHint = endContext?._index ?? -1;
            const endIndex = !endContext
                ? -1
                : context.children[endHint] === endContext
                  ? endHint
                  : context.children.indexOf(endContext, Math.max(context._cursor, 0));
            if (endIndex >= context._cursor) {
                previousRange = new Set();
                for (let i = context._cursor; i <= endIndex; i++) {
                    previousRange.add(context.children[i]);
                }
            }
        } else {
            context._cursor = 0;
            currentKeys = context.keys;
            currentRefs = context.refs;
            context.keys = undefined;
        }

        const start = context._cursor;
        // a nested render of this same context must not be taken for a move of this one
        const previousShift = context._shift;
        context._shift = 0;

        renderTemplate(context, rootContext, template, namespace, currentKeys, currentRefs, fragment);

        // whatever is left after the cursor has not been rendered again. The nodes are taken
        // out of the document right away, while their contexts are released only once the
        // render has settled: a keyed node may still be re-inserted somewhere else before it
        // ends, and releasing it here would throw away the state its key is meant to preserve
        const currentIndex = context._cursor;
        // a render that emptied the whole list takes the nodes out in one step: the parent holds
        // exactly what is being dropped, so it can be emptied instead of being asked to remove
        // its children one by one. `detachNode` then finds them already out of it and only has
        // the contexts left to deal with
        if (
            // the count of what is being dropped comes first: it is zero for most of the nodes
            // of most renders, and this runs for every one of them
            context.children.length - currentIndex > 1 &&
            currentIndex === 0 &&
            !previousRange &&
            !isComponent(context.node) &&
            context.node.childNodes.length === context.children.length &&
            !holdsForeignNode(context.children)
        ) {
            context.node.textContent = '';
        }
        if (previousRange) {
            // only the contexts of the fragment are dropped, so the ones of the others are
            // stepped over and the list has to be cut around them
            for (let i = context.children.length - 1; i >= currentIndex; i--) {
                const child = context.children[i];
                if (!previousRange.has(child)) {
                    continue;
                }
                context.children.splice(i, 1);
                detachNode(context, child, rootContext);
            }
        } else {
            // the whole tail belongs to this render, so every step drops the last context:
            // popping it leaves the list in the same state a splice would, without building
            // the array of removed items that a splice returns for each of them
            for (let i = context.children.length - 1; i >= currentIndex; i--) {
                detachNode(context, context.children.pop() as Context, rootContext);
            }
        }

        // the document is rearranged once, and only if something actually moved
        if (context._shift) {
            reconcileNodes(context, start, currentIndex);
        }
        context._shift = previousShift;

        return context.children;
    } finally {
        if (--rootContext._depth === 0) {
            releaseDetachedContexts(rootContext);
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

    return contexts.map((context) => context.node);
};
