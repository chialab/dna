import type { Effect } from './Hooks';

/**
 * A read-only signal-like object.
 */
export type SignalLike<T = unknown> = {
    /**
     * Read the current value, tracking the signal as a dependency
     * of the enclosing computation.
     * @returns The current value.
     */
    get(): T;
};

/**
 * The options accepted by signal constructors.
 */
export type SignalOptions<T> = {
    /**
     * Compare the previous and the next value of the signal.
     * When it returns `true` the signal is considered unchanged and sinks are not notified.
     */
    equals?: (previousValue: T, newValue: T) => boolean;
    [key: symbol]: unknown;
};

/**
 * A writable signal.
 */
export type SignalState<T = unknown> = SignalLike<T> & {
    /**
     * Update the value of the signal.
     * @param newValue The value to set.
     */
    set(newValue: T): void;
};

/**
 * A derived signal.
 */
export type SignalComputed<T = unknown> = SignalLike<T>;

/**
 * A signal watcher.
 */
export type SignalWatcher = {
    /**
     * Start observing the given signals, or re-arm the watcher when called without arguments.
     * @param signals The signals to observe.
     */
    watch(...signals: SignalLike<unknown>[]): void;
    /**
     * Stop observing the given signals.
     * @param signals The signals to release.
     */
    unwatch(...signals: SignalLike<unknown>[]): void;
    /**
     * Collect the watched computeds that are currently dirty.
     * @returns The list of pending signals.
     */
    getPending(): SignalLike<unknown>[];
};

/**
 * The subset of the TC39 Signal namespace used by DNA.
 * @see [proposal-signals]{@link https://github.com/tc39/proposal-signals}
 */
export type SignalNamespace = {
    State: new <T>(initialValue: T, options?: SignalOptions<T>) => SignalState<T>;
    Computed: new <T>(computation: () => T, options?: SignalOptions<T>) => SignalComputed<T>;
    subtle: {
        Watcher: new (notify: () => void) => SignalWatcher;
        untrack<T>(callback: () => T): T;
        readonly watched: symbol;
        readonly unwatched: symbol;
    };
};

/**
 * The Signal implementation in use.
 * Signals are not implemented by any engine yet and DNA does not ship a polyfill,
 * so the implementation is either detected on the global scope or registered by the application.
 */
let implementation: SignalNamespace | null =
    (globalThis as typeof globalThis & { Signal?: SignalNamespace }).Signal ?? null;

/**
 * Register the Signal implementation to use.
 * A single implementation can be active at a time: mixing two of them would result in
 * two disjoint reactive graphs that cannot observe each other.
 * @param Signal The Signal namespace, either native or from a polyfill.
 * @throws If a different implementation has already been registered.
 */
export const configureSignals = (Signal: SignalNamespace): void => {
    if (implementation && implementation !== Signal) {
        throw new Error('A different Signal implementation is already in use');
    }
    implementation = Signal;
};

/**
 * Check if a Signal implementation is available.
 * @returns True if signals can be used.
 */
export const hasSignals = (): boolean => !!implementation;

/**
 * Get the Signal implementation in use.
 * @returns The Signal namespace.
 * @throws If no implementation has been registered.
 */
export const getSignals = (): SignalNamespace => {
    if (!implementation) {
        throw new Error(
            'No Signal implementation is available. Register one with `configureSignals(Signal)` before using signals.'
        );
    }
    return implementation;
};

/**
 * Check if a value is a signal.
 * @param value The value to check.
 * @returns True if the value is a State or a Computed signal.
 */
export const isSignal = <T = unknown>(value: unknown): value is SignalLike<T> =>
    !!implementation && (value instanceof implementation.State || value instanceof implementation.Computed);

/**
 * Run a callback without tracking the signals it reads.
 * It is a no-op when no implementation is available.
 * @param callback The callback to run.
 * @returns The result of the callback.
 */
export const untrack = <T>(callback: () => T): T =>
    implementation ? implementation.subtle.untrack(callback) : callback();

/**
 * The watcher shared by all DNA effects.
 */
let watcher: SignalWatcher | undefined;

/**
 * Whether a flush has already been scheduled.
 */
let flushScheduled = false;

/**
 * Run the pending effects.
 */
const flush = () => {
    flushScheduled = false;
    if (!watcher) {
        return;
    }
    const pending = watcher.getPending();
    for (let i = 0, len = pending.length; i < len; i++) {
        // recomputing a pending signal runs the body of its effect
        pending[i].get();
    }
    // a watcher stops observing its sources once it has notified:
    // it must be re-armed on every flush, even when nothing was pending
    watcher.watch();
};

/**
 * Get (or create) the shared watcher.
 * @param Signal The Signal implementation.
 * @returns The watcher instance.
 */
const getWatcher = (Signal: SignalNamespace): SignalWatcher => {
    if (!watcher) {
        watcher = new Signal.subtle.Watcher(() => {
            // this runs synchronously inside `set`, where signals can be neither read nor written:
            // the actual work is deferred to a microtask
            if (!flushScheduled) {
                flushScheduled = true;
                queueMicrotask(flush);
            }
        });
    }
    return watcher;
};

/**
 * Run a callback whenever one of the signals it reads changes.
 * The callback runs immediately once, then asynchronously on a microtask.
 * @param callback The callback to run. It may return a cleanup function.
 * @returns A function that stops the effect and runs the last cleanup.
 * @throws If no Signal implementation is available.
 */
export const effect = (callback: Effect): (() => void) => {
    const Signal = getSignals();
    const currentWatcher = getWatcher(Signal);

    let cleanup: ReturnType<Effect>;
    const computed = new Signal.Computed(() => {
        cleanup?.();
        cleanup = callback();
    });

    currentWatcher.watch(computed);
    computed.get();

    return () => {
        currentWatcher.unwatch(computed);
        cleanup?.();
        cleanup = undefined;
    };
};
