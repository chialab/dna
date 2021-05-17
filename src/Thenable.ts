import { createSymbolKey } from './symbols';

/**
 * A Symbol which contains Thenable state.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const THENABLE_SYMBOL: unique symbol = createSymbolKey() as any;

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
 */
export const isThenable = (target: any): target is Promise<unknown> => typeof target.then === 'function';

/**
 * Get or inject a state into a Thenable object.
 * @param target The Thenable to extend.
 * @return The Thenable state instance.
 */
export const getThenableState = (target: Promise<unknown>): ThenableState => {
    let thenable: Promise<unknown> = target;
    if ((thenable as any)[THENABLE_SYMBOL]) {
        return (thenable as any)[THENABLE_SYMBOL];
    }
    let state: ThenableState = {
        pending: true,
    };
    (thenable as any)[THENABLE_SYMBOL] = state;
    thenable
        .then((result: unknown) => {
            state.result = result;
            state.pending = false;
        })
        .catch((error: unknown) => {
            state.result = error;
            state.pending = false;
        });

    return state;
};
