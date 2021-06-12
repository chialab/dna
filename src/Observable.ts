import { createSymbol } from './helpers';

/**
 * Subscription-like minimal interface.
 */
export type Subscription = {
    unsubscribe(): void;
};

/**
 * Observable-like minimal interface.
 */
export type Observable<T> = {
    pipe(operator: (value: T) => unknown): Observable<T>;
    subscribe(nextCallback: (value: T) => unknown, errorCallback: (error: Error) => unknown, completeCallback: () => unknown): Subscription;
};

/**
 * A Symbol which contains Subscription state.
 */
const SUBSCRIPTION_SYMBOL: unique symbol = createSymbol();

type WithObservableState<T> = T & {
    [SUBSCRIPTION_SYMBOL]?: ObservableState;
};

/**
 * An object representing the status of a Subscribable.
 */
export type ObservableState = {
    complete: boolean;
    errored: boolean;
    current?: unknown;
};

/**
 * Check if the target is a Subscribable (has the `subscribe` method).
 * @param target The object to check.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObservable = (target: any): target is Observable<unknown> => typeof target['subscribe'] === 'function';

/**
 * Get or inject a state into a Subscribable object.
 * @param target The Subscribable to extend.
 * @return The Subscribable state instance.
 */
export const getObservableState = <T extends Observable<unknown>>(target: WithObservableState<T>): ObservableState => {
    const state = target[SUBSCRIPTION_SYMBOL];
    if (state) {
        return state;
    }
    const newState = target[SUBSCRIPTION_SYMBOL] = {
        complete: false,
        errored: false,
    } as ObservableState;
    target
        .subscribe((value) => {
            newState.current = value;
            newState.errored = false;
        }, (error) => {
            newState.current = error;
            newState.errored = true;
        }, () => {
            newState.complete = true;
        });

    return newState;
};
