import { type ComponentConstructor, type ComponentInstance, isComponent } from './Component';
import { css } from './css';
import type { HTMLTagNameMap } from './Elements';
import { uniqueId } from './factories';
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
    type FunctionComponentHooks,
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

/**
 * The type of a hook state.
 */
type State<T = unknown> = [T, unknown[]];

/**
 * The value passed to a state setter.
 * It can be the new value itself or a function that receives the current value and returns the new one.
 */
export type Setter<T> = T | ((currentValue: T) => T);

/**
 * The type of a mutable reference.
 */
export type Ref<T = unknown> = {
    current: T;
};

/**
 * The type of a cleanup function.
 * It is called when the effect is no longer needed.
 */
type Cleanup = () => void;

/**
 * The type of an effect function.
 */
export type Effect = () => Cleanup | undefined | void;

/**
 * The symbol used to mark cleanup functions.
 */
const CLEANUP_SYMBOL: unique symbol = Symbol();

/**
 * Create a cleanup function.
 * @param fn The cleanup function to create.
 * @returns The cleanup function with a special symbol to mark it as a cleanup.
 */
const createCleanup = <T extends Cleanup>(fn: T): T => {
    (fn as T & { [CLEANUP_SYMBOL]?: boolean })[CLEANUP_SYMBOL] = true;
    return fn;
};

/**
 * Check if a function is a cleanup function.
 * @param fn The function to check.
 * @returns True if the function is a cleanup function, false otherwise.
 */
const isCleanup = (fn: unknown): fn is Cleanup => {
    return typeof fn === 'function' && (fn as Cleanup & { [CLEANUP_SYMBOL]?: boolean })[CLEANUP_SYMBOL] === true;
};

/**
 * The context of the fragment that is rendering, if any.
 *
 * A hook is called from inside a function component, so the fragment it belongs to is the one the
 * renderer is walking: it does not have to be handed over, and a hook can be imported and called
 * like the function it is. The pointer is set around the call of the function component and put
 * back the way it was found, so that a fragment rendering inside another one — a state setter
 * called while the function is still running — leaves the one underneath where it was.
 */
let currentContext: Context | null = null;

/**
 * Point the hooks at the fragment that is about to render, and answer with the one they pointed at.
 * @param context The context of the fragment, or `null` outside a render.
 * @returns The context that was current.
 */
export const setCurrentContext = (context: Context | null): Context | null => {
    const previous = currentContext;
    currentContext = context;
    return previous;
};

/**
 * The context of the fragment that is rendering.
 * @param name The name of the hook asking, for the error.
 * @returns The current context.
 * @throws If no function component is rendering.
 */
export const requireContext = (name: string): Context => {
    if (!currentContext) {
        throw new Error(`\`${name}\` can only be called while a function component renders`);
    }
    return currentContext;
};

/**
 * The kind of node a context describes.
 * - `LITERAL` is a text node generated from an interpolated value.
 * - `VNODE` is an element the renderer created from a virtual node, and owns entirely.
 * - `REF` is a node the renderer does not own: a render root, a node passed in the template
 *   or the comment that marks the position of a function component.
 */
export const ContextKind: {
    LITERAL: 0;
    VNODE: 1;
    REF: 2;
} = {
    LITERAL: 0,
    VNODE: 1,
    REF: 2,
};
export type ContextKind = (typeof ContextKind)[keyof typeof ContextKind];

/**
 * What the renderer keeps about a node while it walks, and — when the node is the marker of a
 * function component — the state of the hooks that function calls.
 *
 * The two used to be an object and a class pointing at each other: a fragment is a context whose
 * hooks are the only thing that tells it apart from the comment it is anchored to, and holding
 * them beside it cost an allocation, a field on every context to reach them and a field on them to
 * come back. They are one object now: the hooks read the fragment they belong to as `this`, and
 * the renderer hands a function component the very context it is rendering into.
 *
 * The hooks outlive the renders of the fragment: the state they keep and the closures they are
 * made of are built once for the whole life of the context, and a fragment renders again every
 * time its state changes. What each render brings with it — the namespace it walks in, the virtual
 * node it starts from — is written here by the render itself and read from here by the hooks.
 *
 * It is exported for `useRenderContext` alone: the fields are the bookkeeping of the walk and
 * change with it, so nothing outside the renderer should read them or count on them being there.
 * @internal
 */
export class Context {
    /**
     * The node the context describes.
     */
    node: Node;

    /**
     * What kind of node it is, and how much of it the renderer owns.
     */
    kind: ContextKind;

    /**
     * The function of a fragment, the tag name of an element, the text of a literal.
     */
    type: FunctionComponent | string | null;

    /**
     * The context the render started from.
     */
    root?: Context;

    /**
     * The context of the render that created the node.
     */
    owner?: Context;

    /**
     * The context whose children list holds this one.
     */
    parent?: Context;

    /**
     * The contexts of the nodes rendered into this one, in document order.
     */
    children?: Context[];

    /**
     * The properties the last render wrote on the node.
     */
    properties?: KeyedProperties & TreeProperties & Record<string, unknown>;

    /**
     * The last context of the range a fragment rendered, its marker included.
     */
    end?: Context;

    /**
     * The key the template named the node with.
     */
    key?: unknown;

    /**
     * The keyed contexts rendered by this fragment, by key.
     */
    keys?: Map<unknown, Context>;

    /**
     * The contexts of the nodes this fragment received in a template, by node.
     */
    refs?: Map<Node, Context>;

    /**
     * Whether the context renders the shadow content of a component.
     */
    shadow: boolean;

    /**
     * The position of the context among the children of its parent.
     */
    index: number;

    /**
     * Whether the subtree holds anything to release.
     */
    release: boolean;

    /**
     * Which render pass claimed this context by its key. A key names one node, so a context the
     * running pass has already claimed cannot be claimed again by it: this is what tells a key the
     * template declares twice from a key that simply did not move.
     */
    claimed: number;

    /**
     * The state of each hook the function component called, in the order it called them. It is
     * created by the first hook of the first render: most contexts are plain nodes and never
     * grow one.
     */
    private states?: State[];

    /**
     * The index of the hook the current render is at.
     */
    private hookIndex: number;

    /**
     * The queue of effects to run, created only for the hooks that register one.
     */
    private effects?: Effect[];

    /**
     * The namespace uri of the render, which rendering the fragment again walks in.
     */
    namespace: string;

    /**
     * The virtual node of the fragment, which is what rendering it again starts from.
     */
    template?: Template;

    /**
     * Create a node context.
     * @param kind The kind of the context.
     * @param type The type of the context.
     * @param node The node scope of the context.
     * @param shadow If the context renders the shadow content of a component.
     * @param root The render root context.
     * @param owner The render owner context.
     */
    constructor(
        kind: ContextKind,
        type: FunctionComponent | string | null,
        node: Node,
        shadow = false,
        root?: Context,
        owner?: Context
    ) {
        this.node = node;
        this.kind = kind;
        this.type = type;
        this.root = root;
        this.owner = owner;
        // the fields a render fills in later are assigned here even though they hold nothing yet:
        // adding one to an object that does not have it changes its shape and moves its properties
        // to a store of their own, and every node of a template is given a parent and a set of
        // properties right after having been created
        this.parent = undefined;
        this.properties = undefined;
        this.end = undefined;
        this.key = undefined;
        this.keys = undefined;
        this.refs = undefined;
        // a text node is a leaf: nothing is ever rendered into it, and the list it would be given
        // is the same empty one for all of them
        this.children = undefined;
        this.shadow = shadow;
        // no position yet: any slot of the children list would be a miss, which is what the
        // lookup expects of a context it has never placed
        this.index = -1;
        // a node the renderer does not own has to be emptied when it is dropped, and it is the
        // only kind that holds something to release from the moment it is created
        this.release = kind === ContextKind.REF;
        // no pass has claimed it yet
        this.claimed = 0;
        // only the marker of a function component ever calls a hook, and it is the first one it
        // calls that gives it a state: the rest of the contexts carry the fields empty
        this.states = undefined;
        this.hookIndex = 0;
        this.effects = undefined;
        this.namespace = '';
        this.template = undefined;
    }

    /**
     * Start a render pass: the scope of the render is taken in, and hooks are matched to their
     * state by the order they are called in, so the walk starts over from the first of them.
     *
     * The index of the pass this one interrupts is returned rather than dropped: a render can
     * start another one of the same fragment — a state setter called while the function is
     * still running — and the one underneath has to walk the very same hooks it was up to.
     * @param namespace The namespace uri of the render.
     * @param template The virtual node of the fragment.
     * @returns The index the context was at.
     */
    beginRender(namespace: string, template: Template): number {
        this.namespace = namespace;
        this.template = template;

        const previousIndex = this.hookIndex;
        this.hookIndex = 0;
        return previousIndex;
    }

    /**
     * End a render pass and restore the one it interrupted.
     * @param previousIndex The index returned by {@link beginRender}.
     */
    endRender(previousIndex: number): void {
        this.hookIndex = previousIndex;
    }

    /**
     * Get the next state of a hook.
     * If the dependencies are changed, the value of the state will be updated.
     * @param factory The state value factory.
     * @param deps The dependencies of the state.
     * @returns The state value and its dependencies.
     */
    private nextState<T = unknown>(factory: () => T, deps: unknown[] = []): State<T> {
        this.states ??= [];
        const hooks = this.states;
        const index = this.hookIndex++;
        const state = hooks[index];
        if (!state) {
            const newState = [factory(), deps] as [T, unknown[]];
            hooks[index] = newState;
            return newState;
        }
        if (state[1].length !== deps.length || state[1].some((dep, i) => !Object.is(dep, deps[i]))) {
            if (isCleanup(state[0])) {
                state[0]();
            }
            state[0] = factory();
            state[1] = deps;
        }
        return state as [T, unknown[]];
    }

    /**
     * Create a state value and its setter.
     * The setter accepts the new value or a function that receives the current value and returns
     * the new one, and renders the fragment again unless it is asked not to.
     *
     * The pair is the state of the hook, and is handed out again by every render rather than
     * being built anew: the value it holds is the one the last setter call wrote, and the setter
     * keeps the identity it was created with — what a dependency list of another hook needs of
     * it. Nothing is allocated once the fragment has rendered a first time.
     * @param initialValue The initial value of the state.
     * @returns The state value and its setter.
     */
    useState<T = unknown>(initialValue: T): [T, (newValue: Setter<T>, requestUpdate?: boolean) => boolean] {
        return this.nextState<[T, (newValue: Setter<T>, requestUpdate?: boolean) => boolean]>(() => {
            const state: [T, (newValue: Setter<T>, requestUpdate?: boolean) => boolean] = [
                // a function is taken for a lazy initializer, as the setter takes it for an updater
                typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
                (newValue: Setter<T>, requestUpdate?: boolean) => {
                    const value =
                        typeof newValue === 'function' ? (newValue as (currentValue: T) => T)(state[0]) : newValue;
                    if (Object.is(value, state[0])) {
                        return false;
                    }

                    state[0] = value;
                    if (requestUpdate !== false) {
                        requestFragmentRender(this);
                    }

                    return true;
                },
            ];
            return state;
        })[0];
    }

    /**
     * Create a mutable reference that is preserved across renders.
     * Updating the `current` property does not trigger a new render.
     * @param initialValue The initial value of the reference.
     * @returns The reference object.
     */
    useRef<T>(initialValue: T): Ref<T>;
    useRef<T = undefined>(): Ref<T | undefined>;
    useRef<T>(initialValue?: T): Ref<T | undefined> {
        return this.useMemo(() => ({ current: initialValue }));
    }

    /**
     * Create a memoized value.
     * @param factory The state value factory.
     * @param deps The dependencies of the state.
     * @returns The memoized value.
     */
    useMemo<T = unknown>(factory: () => T, deps: unknown[] = []): T {
        return this.nextState(factory, deps)[0];
    }

    /**
     * Create a memoized callback.
     * @param callback The callback to memoize.
     * @param deps The dependencies of the callback.
     * @returns The memoized callback.
     */
    // biome-ignore lint/suspicious/noExplicitAny: Callbacks can accept and return anything.
    useCallback<T extends (...args: any[]) => any>(callback: T, deps: unknown[] = []): T {
        return this.useMemo(() => callback, deps);
    }

    /**
     * Create an effect that runs after the render.
     * @param effect The effect function to run.
     * @param deps The dependencies of the effect.
     * @returns A cleanup function to run when the effect is no longer needed.
     */
    useEffect(effect: Effect, deps: unknown[] = []): void {
        this.nextState(() => {
            let cleanup: ReturnType<Effect>;
            this.effects ??= [];
            this.effects.push(() => {
                cleanup = effect();
                return cleanup;
            });

            return createCleanup(() => {
                cleanup?.();
            });
        }, deps);
    }

    /**
     * Create a memoized element.
     * @param tagName The tag name of the element to create.
     * @param options The element creation options.
     * @returns The memoized element.
     */
    useElement<K extends keyof HTMLTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLTagNameMap[K];
    useElement<T extends HTMLElement = HTMLElement>(tagName: string, options?: ElementCreationOptions): T;
    useElement(tagName: string, options?: ElementCreationOptions): HTMLElement {
        return this.useMemo(() => document.createElement(tagName, options), [tagName, options?.is]);
    }

    /**
     * Generate a unique ID for the rendering context.
     * @param suffix An optional suffix to append to the ID.
     * @returns A unique ID string.
     */
    useId(suffix?: string): string {
        const ref = this.node;
        return this.useMemo(() => uniqueId(ref, `${this.hookIndex}`, suffix), [this.hookIndex, suffix]);
    }

    /**
     * Run all effects that were created since the last call.
     *
     * The queue is taken out of the context before being walked: an effect can render its own
     * fragment again, and the effects that render registers belong to the pass that follows it,
     * not to this one. Were they left in place they would be run twice — once by the nested
     * pass, once more by this walk.
     */
    runEffects(): void {
        const effects = this.effects;
        if (!effects) {
            return;
        }
        this.effects = undefined;
        for (let i = 0, len = effects.length; i < len; i++) {
            effects[i]();
        }
    }

    /**
     * Cleanup all effects and states.
     * This method should be called when the context is released or no longer needed.
     */
    cleanup(): void {
        const hooks = this.states;
        if (!hooks) {
            // the context is a plain node: it never called a hook, and there is nothing of a
            // fragment to take apart. Most of what a render walks ends here
            return;
        }
        // an effect queued by a render that never settled belongs to a fragment that is gone
        this.effects = undefined;
        for (const state of hooks) {
            if (isCleanup(state[0])) {
                state[0]();
            }
        }
        hooks.splice(0, hooks.length);
        this.hookIndex = 0;
    }
}

/**
 * Keep a value across the renders of a function component, and render it again when it changes.
 * The setter accepts the value or a function that receives the current one and returns the next,
 * and keeps its identity for the whole life of the fragment. It answers whether the value changed,
 * and takes a second argument to write without asking for a render.
 * @param initialValue The initial value, or a function that produces it.
 * @returns The value and its setter.
 * @throws If no function component is rendering.
 */
export const useState = <T = unknown>(
    initialValue: T
): [T, (newValue: Setter<T>, requestUpdate?: boolean) => boolean] => requireContext('useState').useState(initialValue);

/**
 * Keep a mutable reference across the renders of a function component.
 * Writing its `current` does not render anything.
 * @param initialValue The initial value of the reference.
 * @returns The reference.
 * @throws If no function component is rendering.
 */
export function useRef<T>(initialValue: T): Ref<T>;
export function useRef<T = undefined>(): Ref<T | undefined>;
export function useRef<T>(initialValue?: T): Ref<T | undefined> {
    return requireContext('useRef').useRef(initialValue);
}

/**
 * Keep the result of a computation across the renders of a function component, and compute it
 * again when one of the dependencies changes.
 * @param factory The computation.
 * @param deps The dependencies it is computed again for.
 * @returns The memoized result.
 * @throws If no function component is rendering.
 */
export const useMemo = <T = unknown>(factory: () => T, deps?: unknown[]): T =>
    requireContext('useMemo').useMemo(factory, deps);

/**
 * Keep a callback across the renders of a function component, and build it again when one of the
 * dependencies changes.
 * @param callback The callback.
 * @param deps The dependencies it is built again for.
 * @returns The memoized callback.
 * @throws If no function component is rendering.
 */
// biome-ignore lint/suspicious/noExplicitAny: Callbacks can accept and return anything.
export const useCallback = <T extends (...args: any[]) => any>(callback: T, deps?: unknown[]): T =>
    requireContext('useCallback').useCallback(callback, deps);

/**
 * Run a callback once the fragment is in the document, and again when one of the dependencies
 * changes. It may return a cleanup, which runs before the next call and when the fragment is gone.
 * @param effect The callback.
 * @param deps The dependencies it runs again for.
 * @throws If no function component is rendering.
 */
export const useEffect = (effect: Effect, deps?: unknown[]): void => {
    requireContext('useEffect').useEffect(effect, deps);
};

/**
 * Keep an element across the renders of a function component, for a template to place.
 * @param tagName The tag name of the element.
 * @param options The element creation options.
 * @returns The element.
 * @throws If no function component is rendering.
 */
export function useElement<K extends keyof HTMLTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
): HTMLTagNameMap[K];
export function useElement<T extends HTMLElement = HTMLElement>(tagName: string, options?: ElementCreationOptions): T;
export function useElement(tagName: string, options?: ElementCreationOptions): HTMLElement {
    return requireContext('useElement').useElement(tagName, options);
}

/**
 * Generate an identifier unique to the fragment, for a label to point at a field with.
 * @param suffix A suffix to tell two identifiers of the same fragment apart.
 * @returns The identifier.
 * @throws If no function component is rendering.
 */
export const useId = (suffix?: string): string => requireContext('useId').useId(suffix);

/**
 * The context the fragment is being rendered into.
 * It is the bookkeeping of the renderer: reaching for it from a function component is discouraged.
 * @returns The render context.
 * @throws If no function component is rendering.
 */
export const useRenderContext = (): Context => requireContext('useRenderContext').parent as Context;

/**
 * The hooks a function component is handed as its second argument.
 *
 * One object for the whole page rather than one per fragment: the hooks read the fragment that is
 * rendering off the renderer, so there is nothing to bind and nothing to keep. It is here for the
 * components that take it — importing the hooks is the way to reach them now.
 */
const hooks: FunctionComponentHooks = {
    useState,
    useRef,
    useMemo,
    useCallback,
    useEffect,
    useElement,
    useId,
    useRenderContext,
};

/**
 * A symbol for node render context.
 */
const CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol for shadow context.
 */
const SHADOW_CONTEXT_SYMBOL: unique symbol = Symbol();

/**
 * What a render keeps while it walks.
 *
 * None of it belongs to a context: how deep the walk is, where it is among the children of the
 * parent it is in, what it moved and what it detached are true of the render, not of the nodes it
 * visits — and a context carrying them holds a slot for each on every one of the thousands a list
 * makes. The two that outlive a render, the pass counter and the registry of the nodes placed, are
 * kept here as well, so that a root has one object beside it instead of six fields inside it.
 */
type RenderState = {
    /**
     * The root the walk started from, so that a render nested inside another one — a component
     * rendering while its properties are assigned — is told apart and settles on its own.
     */
    root: Context | null;
    /**
     * How deep the walk is. The outermost level releases what the whole render detached.
     */
    depth: number;
    /**
     * Which pass is running, for a key to be claimed once by it.
     */
    pass: number;
    /**
     * The context whose children the walk is in, so that a render of that same context — a
     * fragment a state setter rendered again while this walk was suspended — is told from a
     * render of one of its children.
     */
    parent: Context | null;
    /**
     * Where the walk is among the children of the parent it is in.
     */
    cursor: number;
    /**
     * How many contexts the walk moved, so that the document is rearranged only if one did.
     */
    shift: number;
    /**
     * Whether the detached contexts are being released.
     */
    releasing: boolean;
    /**
     * The contexts the walk detached. A keyed node is removed from its parent before being
     * re-inserted somewhere else, so a context is known to be gone only once the render settled.
     */
    detached?: Context[];
    /**
     * The context of a node, so that one placed by an earlier render is found again — which is
     * what lets a keyed node move from one parent to another.
     */
    contexts?: WeakMap<Node, Context>;
};

/**
 * The state of each render root, which outlives the renders that walk from it.
 */
const renderStates: WeakMap<Context, RenderState> = new WeakMap();

/**
 * The state of no render, so that reading the current one never has to be guarded.
 */
const IDLE: RenderState = { root: null, depth: 0, pass: 0, parent: null, cursor: 0, shift: 0, releasing: false };

/**
 * The state of the render that is walking.
 */
let currentRender: RenderState = IDLE;

/**
 * Get (or create) the state of a render root.
 * @param root The root context.
 * @returns Its state.
 */
const renderStateOf = (root: Context): RenderState => {
    let state = renderStates.get(root);
    if (!state) {
        state = { root, depth: 0, pass: 0, parent: null, cursor: 0, shift: 0, releasing: false };
        renderStates.set(root, state);
    }
    return state;
};

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
            context = new Context(ContextKind.REF, null, node, true);
            node[SHADOW_CONTEXT_SYMBOL] = context;
        }
        return context;
    }

    let context = node[CONTEXT_SYMBOL];
    if (!context) {
        context = new Context(ContextKind.REF, null, node, false);
        node[CONTEXT_SYMBOL] = context;
    }
    return context;
};

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
        if (!isNew && oldValue != null) {
            node.removeAttribute('class');
        }
        return;
    }
    // written and read through the attribute, the way the style is: outside the HTML namespace
    // `className` is a read-only `SVGAnimatedString`, so assigning it throws and reading it never
    // matches the string the last render applied — while the attribute is the same one everywhere
    if (typeof value === 'string' && (isNew || value === oldValue)) {
        node.setAttribute('class', value);
        return;
    }

    const classes = convertClasses(value);
    const oldClasses = convertClasses(oldValue);
    const classList = node.classList;
    for (const className in oldClasses) {
        if (oldClasses[className] && !classes[className]) {
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
        if (!isNew && oldValue != null) {
            node.removeAttribute('style');
        }
        return;
    }
    if (typeof value === 'string' && (isNew || value === oldValue)) {
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
        const declaration = styles[propertyKey];
        if (style.getPropertyValue(propertyKey) !== declaration) {
            style.setProperty(propertyKey, declaration);
        }
    }
};

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
 * The name of the event a property key stands for, when it stands for one.
 * `onclick` and friends are real properties of the node and are assigned as such, while `onClick`
 * and `on:click` exist only in the template and become event listeners.
 * @param node The node the property is set on.
 * @param propertyKey The property key.
 * @returns The event name, or `null` when the key is not a listener.
 */
const eventNameOf = (node: Node, propertyKey: string): string | null => {
    if (propertyKey[0] !== 'o' || propertyKey[1] !== 'n' || propertyKey in node) {
        return null;
    }
    return propertyKey[2] === ':' ? propertyKey.substring(3) : propertyKey.substring(2);
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

    const eventName = eventNameOf(node, propertyKey as string);
    if (eventName !== null) {
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

    // no value at all is the template saying it does not declare this any more, so the node is
    // left as it would have been had it never been declared: the attribute goes, and a property
    // that backs it is emptied first. `false` is not the same thing — for `draggable` it is one of
    // the values the attribute takes, and taking it away would mean `auto` — so it goes on being
    // written like any other, and only removes an attribute that has no property behind it
    if (value == null) {
        if (!shouldSetAttribute) {
            // the empty value of what the property holds: assigning `undefined` to a property
            // that holds a string is the string `"undefined"`, which the DOM shows as it is
            const current = (node as unknown as Record<string, unknown>)[propertyKey];
            (node as unknown as Record<string, unknown>)[propertyKey] = typeof current === 'string' ? '' : value;
        }
        // removing an attribute the node does not have is a no-op, and is left to the DOM rather
        // than being asked about first
        if (!isNew) {
            (node as HTMLElement).removeAttribute(propertyKey);
        }
        return;
    }

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

    // an attribute with no property behind it is removed by `false`, which is how a template says
    // a boolean attribute is not there, while `true` renders it as one
    if (value === false) {
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
    while (current && !current.release) {
        current.release = true;
        current = current.parent;
    }
};

/**
 * Release the resources held by a context and its subtree: hooks and effects.
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
    // the hooks are left in place: they are the state of a fragment that is gone, and
    // emptying them is enough
    context.cleanup();

    const children = context.children;
    if (!children) {
        return;
    }

    const owned = context.kind === ContextKind.REF;
    for (const child of children) {
        if (owned && child.node.parentNode === context.node) {
            context.node.removeChild(child.node);
        }
        if (!child.release) {
            continue;
        }
        if (currentRender.contexts?.get(child.node) === child) {
            currentRender.contexts.delete(child.node);
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
    if (currentRender.releasing) {
        return;
    }
    currentRender.releasing = true;
    try {
        // releasing a context runs user code — disconnected callbacks, effect cleanups — which
        // can detach further contexts: the queue is walked with a cursor rather than drained
        // from its head, so that what is appended while it runs is picked up by the same pass
        const detached = currentRender.detached;
        if (detached) {
            for (const context of detached) {
                if (!context.release) {
                    // the subtree holds nothing to release: it is dropped with its node
                    continue;
                }
                if (currentRender.contexts?.get(context.node) === context) {
                    // the context has been re-attached during the render
                    continue;
                }
                releaseContext(context, rootContext);
            }
        }
        currentRender.detached = undefined;
    } finally {
        currentRender.releasing = false;
    }
};

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
        currentRender.contexts?.delete(childNode);
    }
    // the render state belongs to the root of the tree being walked, and a context is only
    // ever detached while that tree is being rendered
    currentRender.detached ??= [];
    currentRender.detached.push(childContext);
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
    return children[context.index] === context ? context.index : children.indexOf(context);
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
    const pos = currentRender.cursor;

    parentContext.children ??= [];

    // already where the template wants it: this is the common case of an update that did
    // not reorder anything, and it costs a single comparison. Nothing else is read here,
    // because this runs for every node of every render
    if (parentContext.children[pos] === childContext) {
        childContext.index = pos;
        currentRender.cursor = pos + 1;
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
        const displaced = parentContext.children[pos];
        // the exchange moves one slot, so it is only good for a context that occupies one: the
        // range of a fragment is contiguous and has to stay so, and sending its marker away from
        // the nodes the function rendered would leave the walk unable to find it — it would build
        // a marker and a set of hooks of its own, dropping the state the fragment was keeping
        if (to <= from && !(displaced.end && displaced.end !== displaced)) {
            // a single child: exchange it with the one at the cursor, instead of shifting
            // everything in between. The displaced context lands on a slot the walk has not
            // reached yet, where it is still found — by key, or by the cursor itself once it
            // gets there. Shifting would cost one copy per sibling, and a list where every
            // row is displaced, as in a swap, would be quadratic in the number of rows
            parentContext.children[from] = displaced;
            parentContext.children[pos] = childContext;
            displaced.index = from;
            childContext.index = pos;
            currentRender.shift++;
        } else {
            // a function component owns the contiguous range up to `end` and moves whole. This is
            // also the way a single child moves past a fragment, since nothing else can be
            // displaced onto the slot it leaves without being taken apart
            const range = parentContext.children.splice(from, to - from + 1);
            parentContext.children.splice(pos, 0, ...range);
            // only the contexts between the cursor and the end of the range changed place
            for (let i = pos; i <= to; i++) {
                parentContext.children[i].index = i;
            }
            currentRender.shift += range.length;
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
            const currentChildContext = currentRender.contexts?.get(childContext.node);
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
        childContext.index = pos;
        childContext.parent = parentContext;
        if (isFindable(childContext)) {
            currentRender.contexts ??= new WeakMap();
            currentRender.contexts.set(childContext.node, childContext);
        }
        if (childContext.release) {
            // whatever the child holds has to be found again from the list it now belongs to
            markRelease(parentContext);
        }
    }
    currentRender.cursor = pos + 1;
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

    // the walk reports where it stopped, which a nested render of this same parent may have left
    // beyond the list it stopped in: the range is cut to what the list actually holds, so that a
    // reorder reads contexts rather than the holes past its end
    const last = end < currentChildren.length ? end : currentChildren.length;
    const count = last - start;
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
    let anchor = currentChildren[last]?.node ?? null;
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
 * @param fragment The context of the fragment, which is also where its hooks keep their state.
 */
const requestFragmentRender = (fragment: Context) => {
    const context = fragment.parent as Context;
    const rootContext = fragment.root as Context;
    if (!context.children?.includes(fragment)) {
        // the fragment is gone: rendering it again would bring back a subtree nobody
        // references anymore
        return;
    }

    // only this fragment is rendered again, where it stands
    if (isComponent(rootContext.node) && rootContext.shadow) {
        rootContext.node.realm.requestUpdate(() => {
            internalRender(context, fragment.template, rootContext, fragment.namespace, fragment);
        });
        return;
    }
    internalRender(context, fragment.template, rootContext, fragment.namespace, fragment);
};

/**
 * Check whether a context can take the place of the element a template declares.
 *
 * It is a function of its own rather than a closure over the template: it is asked for every
 * element of every render, and a closure would be one allocation per node — thousands of them
 * for a list, all of them dead by the end of the walk.
 * @param candidate The context already in this position, or the one the key names.
 * @param type The tag name the template declares.
 * @param is The builtin the template extends, if any.
 * @returns True if the context describes a node the template can be rendered into.
 */
const fitsTemplate = (candidate: Context, type: string, is: string | undefined) =>
    candidate.kind === ContextKind.VNODE && candidate.type === type && candidate.properties?.is === is;

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

    // what a template is, is asked of its type before anything is read off it: a virtual node
    // and a node answer to a lookup, a string and a number do not, and a lookup that is handed
    // both is the slow kind for every node of every render — including the thousands that are
    // virtual nodes and would have answered on the first try
    const isObject = typeof template === 'object';

    if (isObject && isVObject(template)) {
        if (isVFunction(template)) {
            if (template.type === Fragment) {
                // a fragment has no identity of its own: its children belong to the context
                // and to the fragment that contain it
                renderTemplate(context, rootContext, template.children, namespace, keys, refs, fragment);
                return;
            }
            const { type: Fn, key, properties, children } = template;

            const pass = currentRender.pass;
            let functionContext: Context | undefined;
            const currentContext = context.children[currentRender.cursor];
            if (currentContext && currentContext.type === Fn && currentContext.key === key) {
                // the same function with the same key is already in this position:
                // this is also how a fragment finds itself again when it re-renders alone
                functionContext = currentContext;
            } else if (key != null) {
                const keyed = keys?.get(key);
                // the key may name a node that is not a fragment of this function at all — an
                // element that shares it, or another function's fragment, whose hooks are not
                // the ones this function asks for in the order it asks for them
                if (keyed && keyed.type === Fn && keyed.kind === ContextKind.REF) {
                    functionContext = keyed;
                }
            }
            // a context this pass has already placed is not the one a second declaration of the
            // same key names: that one is given a context of its own
            if (functionContext && key != null) {
                if (functionContext.claimed === pass) {
                    functionContext = undefined;
                } else {
                    functionContext.claimed = pass;
                }
            }

            // the context is inserted as is, rather than being looked up again from its node:
            // while reordering it may have been detached from the parent children already,
            // and recreating it would drop the hooks state the key is meant to preserve
            insertNode(
                context,
                functionContext ||
                    new Context(
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
            const renderContext = context.children[currentRender.cursor - 1];
            renderContext.type = Fn;
            renderContext.key = key;
            if (key != null && renderContext !== fragment) {
                fragment.keys ??= new Map();
                fragment.keys.set(key, renderContext);
            }

            // the keys of the fragment are collected again by this render, while the refs are
            // kept: a node passed in a template has to be found again even when a render that
            // did not use it has run in between
            const childKeys = renderContext.keys;
            const childRefs = renderContext.refs;
            renderContext.keys = undefined;

            // the context of the fragment is pointed at while the function runs, so that a hook it
            // calls finds the state it belongs to without being handed it, and put back afterwards
            // even if the function throws — a pointer left behind would hand the next fragment
            // this state. The state itself outlives the render, together with the closures it is
            // made of: a fragment that renders again does not build them a second time
            const previousContext = setCurrentContext(renderContext);
            const previousIndex = renderContext.beginRender(namespace, template);
            let result: Template;
            try {
                result = Fn(
                    {
                        children,
                        ...properties,
                    },
                    hooks
                );
            } finally {
                renderContext.endRender(previousIndex);
                setCurrentContext(previousContext);
            }

            renderTemplate(context, rootContext, result, namespace, childKeys, childRefs, renderContext);

            renderContext.end = context.children[currentRender.cursor - 1];
            // the effects run once the fragment is in the document, and may render again
            renderContext.runEffects();
            return;
        }

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

        const { key, children, namespace: namespaceURI = namespace } = template;
        const properties = (template.properties || EMPTY_PROPERTIES) as KeyedProperties &
            TreeProperties &
            EventProperties &
            ElementProperties;

        // an existing node is reused when the key says so, or when the one at the cursor was
        // generated by this same render out of a compatible tag
        let templateContext: Context | undefined;
        const currentContext = context.children[currentRender.cursor];
        // a template that carries a node instance names one node and one only: nothing already
        // in this position can stand for it, and it is looked up among the refs instead
        const type = isVTag(template) ? template.type : null;
        if (key != null) {
            const pass = currentRender.pass;
            // the node is where the previous render left it, which is what an update that
            // reordered nothing looks like — and is most of them: the key does not have to be
            // looked up at all. The one at the cursor carries the key, so it is the node the key
            // names, unless this very pass has already placed it
            if (
                currentContext &&
                currentContext.key === key &&
                currentContext.claimed !== pass &&
                type !== null &&
                fitsTemplate(currentContext, type, properties.is)
            ) {
                templateContext = currentContext;
            } else {
                const keyed = keys?.get(key);
                // a key names one node, and the one it named is not always the node the template
                // declares now: the marker of a function component that shares the key, or an
                // element of another tag. One that does not fit is left where it is — for a
                // sibling that shares the key and does fit — and this element gets one of its own
                if (keyed && keyed.claimed !== pass && type !== null && fitsTemplate(keyed, type, properties.is)) {
                    templateContext = keyed;
                }
            }
            if (templateContext) {
                // claimed: a second declaration of the same key gets a context of its own
                templateContext.claimed = pass;
            }
        } else if (
            currentContext &&
            currentContext.key == null &&
            currentContext.owner === rootContext &&
            type !== null &&
            fitsTemplate(currentContext, type, properties.is)
        ) {
            templateContext = currentContext;
        }

        // a node rendered inside a component belongs to its realm, which has to adopt it
        let isNew = false;
        if (!templateContext) {
            if (isVNode(template)) {
                // the template carries a node instance: it keeps the context it was given the
                // first time, so that what has been rendered into it is not rendered again
                const node = template.type;
                templateContext = refs?.get(node) || new Context(ContextKind.REF, null, node, false, rootContext);
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
                templateContext = new Context(ContextKind.VNODE, template.type, node, false, rootContext, rootContext);
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

        // the collection has to be closed even by a property that refuses its value: it counts a
        // batch depth that belongs to the whole page, and one left open holds back every write
        // that follows it, everywhere, for good
        try {
            // the properties the previous render had set and this one does not are unset first,
            // so that a property that replaces another one does not find a stale value in place
            if (oldProperties) {
                for (const propertyKey in oldProperties) {
                    // a value says the property is declared again without having to ask whether
                    // it is: `in` is the question this walk exists to ask, and it is asked of a
                    // different shape of object for every kind of node a template holds — the
                    // lookup never settles on one and is resolved the slow way every time, for
                    // every property of every node. A read settles on the values instead, and
                    // only a property that holds nothing is worth the question
                    if (
                        properties[propertyKey as keyof typeof properties] === undefined &&
                        !(propertyKey in properties) &&
                        !shouldIgnoreProperty(node, propertyKey)
                    ) {
                        setProperty(
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
                // whatever a template nests is declared as `children` as well, so the key is on
                // every element that holds anything and is the one the walk always steps over:
                // it is let go here rather than through the call that answers for the rest
                if (propertyKey !== 'children' && !shouldIgnoreProperty(node, propertyKey)) {
                    setProperty(
                        node,
                        propertyKey as keyof Node,
                        properties[propertyKey as keyof typeof properties] as Node[keyof Node],
                        oldProperties?.[propertyKey as keyof typeof oldProperties] as Node[keyof Node],
                        ctr,
                        isNew
                    );
                }
            }
        } finally {
            if (ctr) {
                (node as ComponentInstance).collectUpdatesEnd();
            }
        }

        insertNode(context, templateContext, rootContext);

        // a node this render owns is rendered again even when it has no children, so that
        // whatever it used to contain is removed. A leaf on both sides is the exception: the
        // template declares nothing and the context holds nothing, so the render would walk an
        // empty list against an empty template and settle it — and most of the nodes of a list
        // have a leaf under them, rendered again for nothing on every pass
        const declaresChildren = children != null && (!isArray(children) || children.length > 0);
        if (
            (children?.length || templateContext.root === rootContext) &&
            (declaresChildren || templateContext.children?.length)
        ) {
            internalRender(templateContext, children, rootContext, namespaceURI, undefined);
        }
        return;
    }

    if (isObject && template instanceof Node) {
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
            nodeContext || new Context(ContextKind.REF, null, template, false, rootContext),
            rootContext
        );
        return;
    }

    // the content of a style element rendered by a component is scoped to its definition
    const normalizedTemplate =
        rootContext.shadow && isComponent(rootContext.node) && (context.node as HTMLElement).tagName === 'STYLE'
            ? css(rootContext.node.is, String(template))
            : String(template);

    // a text node already in this position is updated in place rather than replaced
    const currentContext = context.children[currentRender.cursor];
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
        new Context(
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
    // settles on its own, so it takes the state of its own root rather than sharing this one
    const previousRender = currentRender;
    const render = previousRender.root === rootContext ? previousRender : renderStateOf(rootContext);
    currentRender = render;

    // where the walk is and what it moved belong to the walk, not to the context it is in: a
    // nested render — of another tree, or of a fragment a state setter rendered again while this
    // walk was suspended — has to leave both the way it found them
    const previousParent = render.parent;
    const previousCursor = render.cursor;
    const previousShift = render.shift;
    const previousLength = context.children.length;
    render.parent = context;

    render.depth++;
    if (render.depth === 1) {
        // a walk that starts from outside opens a pass of its own; the ones it nests share it,
        // since a context is claimed once by whoever is walking
        render.pass++;
    }
    try {
        let previousRange: Set<Context> | undefined;
        let currentKeys: Map<unknown, Context> | undefined;
        let currentRefs: Map<Node, Context> | undefined;
        if (fragment) {
            // only one fragment is rendered again: the cursor starts at its marker, and the
            // contexts it owned are remembered, because everything around them belongs to
            // other fragments and has to come out of this render untouched
            currentRender.cursor = indexOfContext(context.children, fragment);
            const endContext = fragment.end as Context | undefined;
            // the range of a fragment never begins before its own marker, so the search for
            // its end can start from there instead of walking the whole list of siblings
            const endHint = endContext?.index ?? -1;
            const endIndex = !endContext
                ? -1
                : context.children[endHint] === endContext
                  ? endHint
                  : context.children.indexOf(endContext, Math.max(currentRender.cursor, 0));
            if (endIndex >= currentRender.cursor) {
                previousRange = new Set();
                for (let i = currentRender.cursor; i <= endIndex; i++) {
                    previousRange.add(context.children[i]);
                }
            }
        } else {
            currentRender.cursor = 0;
            currentKeys = context.keys;
            currentRefs = context.refs;
            context.keys = undefined;
        }

        const start = currentRender.cursor;
        // a nested render of this same context must not be taken for a move of this one
        currentRender.shift = 0;

        renderTemplate(context, rootContext, template, namespace, currentKeys, currentRefs, fragment);

        // whatever is left after the cursor has not been rendered again. The nodes are taken
        // out of the document right away, while their contexts are released only once the
        // render has settled: a keyed node may still be re-inserted somewhere else before it
        // ends, and releasing it here would throw away the state its key is meant to preserve
        const currentIndex = currentRender.cursor;
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
        if (currentRender.shift) {
            reconcileNodes(context, start, currentIndex);
        }

        return context.children;
    } finally {
        // the walk this one interrupted resumes where it was. When it was walking this very
        // context — a fragment rendered again while the walk of its parent was suspended — the
        // contexts this render dropped or inserted sit in a range that walk has already stepped
        // over, so it resumes that much further along; a render of a child moved nothing of its
        render.cursor =
            previousParent === context ? previousCursor + (context.children.length - previousLength) : previousCursor;
        render.parent = previousParent;
        render.shift = previousShift;
        if (--render.depth === 0) {
            releaseDetachedContexts(rootContext);
        }
        currentRender = previousRender;
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
