/**
 * Subscription-like minimal interface.
 */
export declare type Subscription = {
    unsubscribe(): void;
};
/**
 * Observable-like minimal interface.
 */
export declare type Observable<T> = {
    pipe(operator: (value: T) => unknown): Observable<T>;
    subscribe(nextCallback: (value: T) => unknown, errorCallback: (error: Error) => unknown, completeCallback: () => unknown): Subscription;
};
/**
 * A Symbol which contains Subscription state.
 */
declare const SUBSCRIPTION_SYMBOL: unique symbol;
declare type WithObservableState<T> = T & {
    [SUBSCRIPTION_SYMBOL]?: ObservableState;
};
/**
 * An object representing the status of a Subscribable.
 */
export declare type ObservableState = {
    complete: boolean;
    errored: boolean;
    current?: unknown;
};
/**
 * Check if the target is a Subscribable (has the `subscribe` method).
 * @param target The object to check.
 */
export declare const isObservable: (target: any) => target is Observable<unknown>;
/**
 * Get or inject a state into a Subscribable object.
 * @param target The Subscribable to extend.
 * @return The Subscribable state instance.
 */
export declare const getObservableState: <T extends Observable<unknown>>(target: WithObservableState<T>) => ObservableState;
export {};
