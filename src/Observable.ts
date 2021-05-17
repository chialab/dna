import { createSymbolKey } from './symbols';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SUBSCRIPTION_SYMBOL: unique symbol = createSymbolKey() as any;

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
export const isObservable = (target: any): target is Observable<unknown> => typeof target['subscribe'] === 'function';

/**
 * Get or inject a state into a Subscribable object.
 * @param target The Subscribable to extend.
 * @return The Subscribable state instance.
 */
export const getObservableState = (target: any): ObservableState => {
    let subscribable: Observable<unknown> = target;
    if ((subscribable as any)[SUBSCRIPTION_SYMBOL]) {
        return (subscribable as any)[SUBSCRIPTION_SYMBOL];
    }
    let state: ObservableState = {
        complete: false,
        errored: false,
    };
    (subscribable as any)[SUBSCRIPTION_SYMBOL] = state;
    subscribable
        .subscribe((value) => {
            state.current = value;
            state.errored = false;
        }, (error) => {
            state.current = error;
            state.errored = true;
        }, () => {
            state.complete = true;
        });

    return state;
};
