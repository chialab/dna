import type { HTMLTagNameMap } from './Elements';
import { uniqueId } from './factories';
import type { FunctionComponentHooks, Template } from './JSX';
import type { Context } from './render';
import { Computed, effect as createEffect, type Options, type ReadonlySignal, State, untrack } from './Signal';

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
     * The hooks handed to the function component on every render.
     */
    readonly api: FunctionComponentHooks;

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
        this.api = {
            useState: this.useState.bind(this),
            useRef: this.useRef.bind(this),
            useMemo: this.useMemo.bind(this),
            useCallback: this.useCallback.bind(this),
            useEffect: this.useEffect.bind(this),
            useSignal: this.useSignal.bind(this),
            useComputed: this.useComputed.bind(this),
            useSignalValue: this.useSignalValue.bind(this),
            useSignalEffect: this.useSignalEffect.bind(this),
            useElement: (tagName: string, options?: ElementCreationOptions) => this.useElement(tagName, options),
            useId: (suffix?: string) => this.useId(suffix),
            useRenderContext: () => this.context,
        };
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
    useState<T = unknown>(initialValue: T): [T, (newValue: StateAction<T>, requestUpdate?: boolean) => void] {
        return this.nextState<[T, (newValue: StateAction<T>, requestUpdate?: boolean) => void]>(() => {
            const state: [T, (newValue: StateAction<T>, requestUpdate?: boolean) => void] = [
                // a function is taken for a lazy initializer, as the setter takes it for an updater
                typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
                (newValue: StateAction<T>, requestUpdate?: boolean) => {
                    const value =
                        typeof newValue === 'function' ? (newValue as (currentValue: T) => T)(state[0]) : newValue;
                    if (Object.is(value, state[0])) {
                        return;
                    }

                    state[0] = value;
                    if (requestUpdate !== false) {
                        this.requestRender(this);
                    }
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
     * Create a writable signal, preserved across renders.
     *
     * Writing it does not render the fragment by itself: what follows it is whatever reads it — an
     * interpolation in the template, a {@link useSignalValue}, a computation elsewhere in the
     * graph. This is what makes it different from {@link useState}, whose value belongs to this
     * fragment alone and always renders it again.
     * @param initialValue The initial value of the signal.
     * @param options The signal options.
     * @returns The signal.
     */
    useSignal<T>(initialValue: T, options?: Options<T>): State<T> {
        return this.useMemo(() => new State(initialValue, options));
    }

    /**
     * Create a signal derived from the ones its computation reads, preserved across renders.
     *
     * It is memoized like {@link useMemo}: the computation is captured once, so a computation that
     * reads the props of the function component needs them in its dependency list. The signals it
     * reads are tracked on their own and do not belong there.
     * @param computation The computation of the signal.
     * @param deps The dependencies of the computation.
     * @param options The signal options.
     * @returns The signal.
     */
    useComputed<T>(computation: () => T, deps: unknown[] = [], options?: Options<T>): Computed<T> {
        return this.useMemo(() => new Computed(computation, options), deps);
    }

    /**
     * Read the value of a signal and render the fragment again whenever it changes.
     *
     * A signal read directly, outside of this hook, is only a value: the function component does
     * not run inside a computation, so nothing would notice it changing. This is what turns a
     * signal into state the fragment follows, and it is the same thing an interpolated signal
     * gets — with the value in hand, which is what a condition or a computation needs.
     * @param signal The signal to read.
     * @returns The current value of the signal.
     */
    useSignalValue<T>(signal: ReadonlySignal<T>): T {
        // the value is read through a factory and written through an updater: `useState` takes a
        // function for a lazy initializer and its setter takes one for an updater, so a signal
        // holding a function goes through unchanged
        const [value, setValue] = this.useState<T>((() => untrack(() => signal.get())) as unknown as T);

        this.useEffect(
            () =>
                createEffect(() => {
                    const newValue = signal.get();
                    setValue(() => newValue);
                }),
            [signal]
        );

        return value;
    }

    /**
     * Run a callback whenever one of the signals it reads changes, for as long as the fragment
     * lives. The callback runs immediately once, then on a microtask, and it may return its own
     * cleanup function.
     * @param effect The effect function to run.
     * @param deps The dependencies of the effect.
     */
    useSignalEffect(effect: Effect, deps: unknown[] = []): void {
        this.useEffect(() => createEffect(effect), deps);
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
