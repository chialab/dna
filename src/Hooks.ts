/**
 * The plain state object of a hook.
 */
export type HooksState = [unknown, unknown[]][];

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
    private nextState<T = unknown>(factory: () => T, deps: unknown[] = []) {
        const index = this.index++;
        const state = this.state[index];
        if (!state) {
            return (this.state[index] = [factory(), deps]) as [T, unknown[]];
        }
        if (state[1].length !== deps.length || state[1].some((dep, i) => !Object.is(dep, deps[i]))) {
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
    useState<T = unknown>(initialValue: T) {
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
    useMemo<T = unknown>(factory: () => T, deps: unknown[] = []) {
        return this.nextState(factory, deps)[0];
    }
}
