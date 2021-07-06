/**
 * A Symbol which contains Thenable state.
 */
declare const THENABLE_SYMBOL: unique symbol;
declare type WithThenableState<T> = T & {
    [THENABLE_SYMBOL]?: ThenableState;
};
/**
 * An object representing the status of a Thenable.
 */
export declare type ThenableState = {
    pending: boolean;
    result?: unknown;
};
/**
 * Check if the target is a Thenable (has the `then` method).
 * @param target The object to check.
 */
export declare const isThenable: (target: any) => target is Promise<any>;
/**
 * Get or inject a state into a Thenable object.
 * @param target The Thenable to extend.
 * @return The Thenable state instance.
 */
export declare const getThenableState: (target: WithThenableState<Promise<unknown>>) => ThenableState;
export {};
