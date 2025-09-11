import { uniqueId } from './factories';

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
 * The hooks manager.
 */
export class HooksManager {
    /**
     * The internal state of hooks.
     */
    private state: HooksState;

    /**
     * The index of current hook.
     */
    private index = 0;

    /**
     * The queue of effects to run.
     */
    private effects: Set<Effect> = new Set();

    /**
     * Create a new hooks manager.
     * @param state The initial state of hooks.
     */
    constructor(state: HooksState = []) {
        this.state = state;
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
     * @param initialValue The initial value of the state.
     * @returns The state value and its setter.
     */
    useState<T = unknown>(initialValue: T): [T, (newValue: T) => boolean] {
        const state = this.nextState(
            typeof initialValue === 'function' ? (initialValue as () => T) : () => initialValue
        );

        return [
            state[0],
            (newValue: T) => {
                if (Object.is(newValue, state[0])) {
                    return false;
                }

                state[0] = newValue;
                return true;
            },
        ] as const;
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
     * Create an effect that runs after the render.
     * @param effect The effect function to run.
     * @param deps The dependencies of the effect.
     * @returns A cleanup function to run when the effect is no longer needed.
     */
    useEffect(effect: Effect, deps: unknown[] = []): void {
        this.nextState(() => {
            let cleanup: ReturnType<Effect>;
            this.effects.add(() => {
                cleanup = effect();
                return cleanup;
            });

            return createCleanup(() => {
                cleanup?.();
            });
        }, deps);
    }

    /**
     * Generate a unique ID for the rendering context.
     * @param fn The function component requesting the ID.
     * @param suffix An optional suffix to append to the ID.
     * @returns A unique ID string.
     */
    useId(ref: Node, suffix?: string): string {
        return this.useMemo(() => uniqueId(ref, `${this.index}`, suffix), [this.index, suffix]);
    }

    /**
     * Run all effects that were created since the last call.
     * @returns An array of effects to run.
     */
    runEffects(): void {
        for (const effect of this.effects) {
            effect();
        }
        this.effects.clear();
    }

    /**
     * Cleanup all effects and states.
     * This method should be called when the component is unmounted or no longer needed.
     */
    cleanup(): void {
        for (const state of this.state) {
            if (isCleanup(state[0])) {
                state[0]();
            }
        }
        this.state.splice(0, this.state.length);
    }
}
