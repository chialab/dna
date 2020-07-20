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
    pipe(operator: (value: T) => any): Observable<T>;
    subscribe(nextCallback: (value: T) => any, errorCallback: (error: Error) => any, completeCallback: () => any): Subscription;
};

/**
 * A Symbol which contains Subscription state.
 * @private
 */
const SUBSCRIPTION_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * An object representing the status of a Subscribable.
 */
export type ObservableState = {
    complete: boolean;
    errored: boolean;
    current?: any;
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
