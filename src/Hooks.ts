import type { HTMLTagNameMap } from './Elements';
import { uniqueId } from './factories';
import type { FunctionComponentHooks, Template } from './JSX';
import type { Context } from './render';

/**
 * The type of a hook state.
 */
type HookState<T = unknown> = [T, unknown[]];

/**
 * The plain state object of a hook.
 */
export type HooksState = HookState[];

/**
 * The type of a cleanup function.
 * It is called when the effect is no longer needed.
 */
type Cleanup = () => void;

/**
 * The value passed to a state setter.
 * It can be the new value itself or a function that receives the current value and returns the new one.
 */
export type StateAction<T> = T | ((currentValue: T) => T);

/**
 * The type of a mutable reference.
 */
export type Ref<T = unknown> = {
    current: T;
};

/**
 * The type of an effect function.
 */
// biome-ignore lint/suspicious/noConfusingVoidType: This is a valid use case for an effect.
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
 * The hooks of the fragment that is rendering, if any.
 *
 * A hook is called from inside a function component, so the fragment it belongs to is the one the
 * renderer is walking: it does not have to be handed over, and a hook can be imported and called
 * like the function it is. The pointer is set around the call of the function component and put
 * back the way it was found, so that a fragment rendering inside another one — a state setter
 * called while the function is still running — leaves the one underneath where it was.
 */
let currentHooks: Hooks | null = null;

/**
 * Point the hooks at the fragment that is about to render, and answer with the one they pointed at.
 * @param hooks The hooks of the fragment, or `null` outside a render.
 * @returns The hooks that were current.
 */
export const setCurrentHooks = (hooks: Hooks | null): Hooks | null => {
    const previous = currentHooks;
    currentHooks = hooks;
    return previous;
};

/**
 * The hooks of the fragment that is rendering.
 * @param name The name of the hook asking, for the error.
 * @returns The current hooks.
 * @throws If no function component is rendering.
 */
const requireHooks = (name: string): Hooks => {
    if (!currentHooks) {
        throw new Error(`\`${name}\` can only be called while a function component renders`);
    }
    return currentHooks;
};

/**
 * The hooks of a function component.
 *
 * They belong to the context of the fragment and outlive its renders: the state they keep, the
 * object handed to the function and the closures it is made of are built once for the whole life
 * of the fragment, and a fragment renders again every time its state changes. What each render
 * brings with it — the contexts it walks, the virtual node it starts from — is written here by
 * the render itself and read from here by the hooks, rather than being captured by them.
 */
export class Hooks {
    /**
     * The internal state of hooks.
     */
    private state: HooksState = [];

    /**
     * The index of current hook.
     */
    private index = 0;

    /**
     * The queue of effects to run, created only for the hooks that register one.
     */
    private effects?: Effect[];

    /**
     * The context of the fragment, whose node marks where the fragment begins.
     */
    readonly renderContext: Context;

    /**
     * Render the fragment again after a state change.
     * Rendering belongs to the renderer, which hands the manager the way back into it.
     */
    private readonly requestRender: (hooks: Hooks) => void;

    /**
     * The context the fragment is rendered into.
     */
    context: Context;

    /**
     * The root context of the render.
     */
    rootContext: Context;

    /**
     * The namespace uri of the render.
     */
    namespace: string;

    /**
     * The virtual node of the fragment, which is what rendering it again starts from.
     */
    template?: Template;

    /**
     * Create the hooks of a function component.
     * @param renderContext The context of the fragment they belong to.
     * @param requestRender The function that renders the fragment again.
     */
    constructor(renderContext: Context, requestRender: (hooks: Hooks) => void) {
        this.renderContext = renderContext;
        this.requestRender = requestRender;
        // the scope of a render, which is written again by each of them before the function
        // runs: it is declared here so that the manager holds every field it will ever have
        this.context = renderContext;
        this.rootContext = renderContext;
        this.namespace = '';
    }

    /**
     * Start a render pass: the scope of the render is taken in, and hooks are matched to their
     * state by the order they are called in, so the walk starts over from the first of them.
     *
     * The index of the pass this one interrupts is returned rather than dropped: a render can
     * start another one of the same fragment — a state setter called while the function is
     * still running — and the one underneath has to walk the very same hooks it was up to.
     * @param context The context the fragment is rendered into.
     * @param rootContext The root context of the render.
     * @param namespace The namespace uri of the render.
     * @param template The virtual node of the fragment.
     * @returns The index the manager was at.
     */
    beginRender(context: Context, rootContext: Context, namespace: string, template: Template): number {
        this.context = context;
        this.rootContext = rootContext;
        this.namespace = namespace;
        this.template = template;

        const previousIndex = this.index;
        this.index = 0;
        return previousIndex;
    }

    /**
     * End a render pass and restore the one it interrupted.
     * @param previousIndex The index returned by {@link beginRender}.
     */
    endRender(previousIndex: number): void {
        this.index = previousIndex;
    }

    /**
     * Get the next state of a hook.
     * If the dependencies are changed, the value of the state will be updated.
     * @param factory The state value factory.
     * @param deps The dependencies of the state.
     * @returns The state value and its dependencies.
     */
    private nextState<T = unknown>(factory: () => T, deps: unknown[] = []): HookState<T> {
        const index = this.index++;
        const state = this.state[index];
        if (!state) {
            const newState = [factory(), deps] as [T, unknown[]];
            this.state[index] = newState;
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
    useState<T = unknown>(initialValue: T): [T, (newValue: StateAction<T>, requestUpdate?: boolean) => boolean] {
        return this.nextState<[T, (newValue: StateAction<T>, requestUpdate?: boolean) => boolean]>(() => {
            const state: [T, (newValue: StateAction<T>, requestUpdate?: boolean) => boolean] = [
                // a function is taken for a lazy initializer, as the setter takes it for an updater
                typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
                (newValue: StateAction<T>, requestUpdate?: boolean) => {
                    const value =
                        typeof newValue === 'function' ? (newValue as (currentValue: T) => T)(state[0]) : newValue;
                    if (Object.is(value, state[0])) {
                        return false;
                    }

                    state[0] = value;
                    if (requestUpdate !== false) {
                        this.requestRender(this);
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
        const ref = this.renderContext.node;
        return this.useMemo(() => uniqueId(ref, `${this.index}`, suffix), [this.index, suffix]);
    }

    /**
     * Run all effects that were created since the last call.
     *
     * The queue is taken out of the manager before being walked: an effect can render its own
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
     * This method should be called when the component is unmounted or no longer needed.
     */
    cleanup(): void {
        // an effect queued by a render that never settled belongs to a fragment that is gone
        this.effects = undefined;
        for (const state of this.state) {
            if (isCleanup(state[0])) {
                state[0]();
            }
        }
        this.state.splice(0, this.state.length);
        this.index = 0;
    }
}

/* -------------------------------------------------------------------------------------------------
 * The hooks
 * ---------------------------------------------------------------------------------------------- */

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
): [T, (newValue: StateAction<T>, requestUpdate?: boolean) => boolean] =>
    requireHooks('useState').useState(initialValue);

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
    return requireHooks('useRef').useRef(initialValue);
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
    requireHooks('useMemo').useMemo(factory, deps);

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
    requireHooks('useCallback').useCallback(callback, deps);

/**
 * Run a callback once the fragment is in the document, and again when one of the dependencies
 * changes. It may return a cleanup, which runs before the next call and when the fragment is gone.
 * @param effect The callback.
 * @param deps The dependencies it runs again for.
 * @throws If no function component is rendering.
 */
export const useEffect = (effect: Effect, deps?: unknown[]): void => {
    requireHooks('useEffect').useEffect(effect, deps);
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
    return requireHooks('useElement').useElement(tagName, options);
}

/**
 * Generate an identifier unique to the fragment, for a label to point at a field with.
 * @param suffix A suffix to tell two identifiers of the same fragment apart.
 * @returns The identifier.
 * @throws If no function component is rendering.
 */
export const useId = (suffix?: string): string => requireHooks('useId').useId(suffix);

/**
 * The context the fragment is being rendered into.
 * It is the bookkeeping of the renderer: reaching for it from a function component is discouraged.
 * @returns The render context.
 * @throws If no function component is rendering.
 */
export const useRenderContext = (): Context => requireHooks('useRenderContext').context;

/**
 * The hooks a function component is handed as its second argument.
 *
 * One object for the whole page rather than one per fragment: the hooks read the fragment that is
 * rendering off the renderer, so there is nothing to bind and nothing to keep. It is here for the
 * components that take it — importing the hooks is the way to reach them now.
 */
export const hooks: FunctionComponentHooks = {
    useState,
    useRef,
    useMemo,
    useCallback,
    useEffect,
    useElement,
    useId,
    useRenderContext,
};
