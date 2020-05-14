import { createSymbolKey } from './symbols';

/**
 * A Symbol which contains all Thenable state.
 * @private
 */
const symbol: unique symbol = createSymbolKey() as any;

/**
 * An object representing the status of a Thenable.
 */
export type ThenableState = {
    pending: boolean;
    rejected: boolean;
    resolved: boolean;
    result?: any;
};

/**
 * Check if the target is a Thenable (has the `then` method).
 * @param target The object to check.
 */
export const isThenable = (target: any): target is Promise<unknown> => target && typeof target.then === 'function';

/**
 * Get the state of a Thenable object.
 * @param target The Thenable object.
 * @return The Thenable state.
 */
export const getThenableState = (target: Promise<unknown>) => wrapThenable(target);

/**
 * Get or inject a state into a Thenable object.
 * @param target The Thenable to extend.
 * @return The Thenable state instance.
 */
export const wrapThenable = (target: any): ThenableState => {
    let thenable: Promise<unknown> = target;
    if (symbol in thenable) {
        return (thenable as any)[symbol];
    }
    let state: ThenableState = {
        pending: true,
        rejected: false,
        resolved: false,
    };
    (thenable as any)[symbol] = state;
    thenable
        .then((result: unknown) => {
            state.result = result;
            state.pending = false;
            state.resolved = true;
        })
        .catch((error: unknown) => {
            state.result = error;
            state.pending = false;
            state.rejected = true;
        });

    return state;
};
