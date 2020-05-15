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
const symbol: unique symbol = createSymbolKey() as any;

/**
 * An object representing the status of a Subscribable.
 */
export type SubscribableState = {
    complete: boolean;
    errored: boolean;
    current?: any;
};

/**
 * Check if the target is a Subscribable (has the `subscribe` method).
 * @param target The object to check.
 */
export const isSubscribable = (target: any): target is Observable<unknown> => target && typeof target['subscribe'] === 'function';

/**
 * Get the state of a Subscribable object.
 * @param target The Subscribable object.
 * @return The Subscribable state.
 */
export const getSubscribableState = (target: Promise<unknown>) => wrapSubscribable(target);

/**
 * Get or inject a state into a Subscribable object.
 * @param target The Subscribable to extend.
 * @return The Subscribable state instance.
 */
export const wrapSubscribable = (target: any): SubscribableState => {
    let subscribable: Observable<unknown> = target;
    if (symbol in subscribable) {
        return (subscribable as any)[symbol];
    }
    let state: SubscribableState = {
        complete: false,
        errored: false,
    };
    (subscribable as any)[symbol] = state;
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
