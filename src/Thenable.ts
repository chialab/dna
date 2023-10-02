/**
 * A Symbol which contains Thenable state.
 */
const THENABLE_SYMBOL: unique symbol = Symbol();

type WithThenableState<T> = T & {
    [THENABLE_SYMBOL]?: ThenableState;
};

/**
 * An object representing the status of a Thenable.
 */
export type ThenableState = {
    pending: boolean;
    result?: unknown;
};

/**
 * Check if the target is a Thenable (has the `then` method).
 * @param target The object to check.
 * @returns True if the target is a Thenable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isThenable = (target: any): target is Promise<any> => typeof target.then === 'function';

/**
 * Get or inject a state into a Thenable object.
 * @param target The Thenable to extend.
 * @returns The Thenable state instance.
 */
export const getThenableState = (target: WithThenableState<Promise<unknown>>): ThenableState => {
    const state = target[THENABLE_SYMBOL];
    if (state) {
        return state;
    }

    const newState = (target[THENABLE_SYMBOL] = {
        pending: true,
    } as ThenableState);
    target
        .then((result: unknown) => {
            newState.result = result;
            newState.pending = false;
        })
        .catch((error: unknown) => {
            newState.result = error;
            newState.pending = false;
        });

    return newState;
};
