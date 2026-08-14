import type { Effect } from './Hooks';

/**
 * A signal that exposes its value through a method, like the TC39 proposal.
 */
export type SignalGetter<T = unknown> = {
    /**
     * Read the current value, tracking the signal as a dependency
     * of the enclosing computation.
     * @returns The current value.
     */
    get(): T;
};

/**
 * A signal that exposes its value through a property, like Preact signals.
 */
export type SignalValue<T = unknown> = {
    /**
     * The current value. Reading it tracks the signal as a dependency
     * of the enclosing computation.
     */
    readonly value: T;
};

/**
 * A read-only signal, in either of the shapes DNA understands.
 * Which one is in use depends on the implementation registered with `configureSignals`.
 */
export type SignalLike<T = unknown> = SignalGetter<T> | SignalValue<T>;

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
export type SignalState<T = unknown> = SignalGetter<T> & {
    /**
     * Update the value of the signal.
     * @param newValue The value to set.
     */
    set(newValue: T): void;
};

/**
 * A derived signal.
 */
export type SignalComputed<T = unknown> = SignalGetter<T>;

/**
 * A signal watcher.
 */
export type SignalWatcher = {
    /**
     * Start observing the given signals, or re-arm the watcher when called without arguments.
     * @param signals The signals to observe.
     */
    watch(...signals: SignalGetter<unknown>[]): void;
    /**
     * Stop observing the given signals.
     * @param signals The signals to release.
     */
    unwatch(...signals: SignalGetter<unknown>[]): void;
    /**
     * Collect the watched computeds that are currently dirty.
     * @returns The list of pending signals.
     */
    getPending(): SignalGetter<unknown>[];
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
 * The whole contract between DNA and a signals implementation: recognise a signal,
 * read it, react to it and read it without reacting. Any library that can do these
 * four things can drive DNA templates, whatever shape its signals have.
 */
export type SignalAdapter = {
    /**
     * Check if a value is one of the signals of this implementation.
     * @param value The value to check.
     * @returns True if the value is a signal.
     */
    isSignal(value: unknown): boolean;
    /**
     * Read the current value, tracking the signal as a dependency
     * of the enclosing computation.
     * @param signal The signal to read.
     * @returns The current value.
     */
    get<T>(signal: SignalLike<T>): T;
    /**
     * Run a callback whenever one of the signals it reads changes.
     * The callback runs immediately once. It may return a cleanup function.
     * @param callback The callback to run.
     * @returns A function that stops the effect.
     */
    effect(callback: Effect): () => void;
    /**
     * Run a callback without tracking the signals it reads.
     * @param callback The callback to run.
     * @returns The result of the callback.
     */
    untrack<T>(callback: () => T): T;
};

/**
 * Build an adapter for an implementation of the TC39 proposal.
 * Effects are collected by a single watcher and flushed on a microtask, because the
 * notification callback of a `Watcher` can neither read nor write signals.
 * @param Signal The Signal namespace.
 * @returns The adapter.
 */
const createNamespaceAdapter = (Signal: SignalNamespace): SignalAdapter => {
    let watcher: SignalWatcher | undefined;
    let flushScheduled = false;

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

    const getWatcher = () => {
        if (!watcher) {
            watcher = new Signal.subtle.Watcher(() => {
                // this runs synchronously inside `set`, where signals can be neither
                // read nor written: the actual work is deferred to a microtask
                if (!flushScheduled) {
                    flushScheduled = true;
                    queueMicrotask(flush);
                }
            });
        }
        return watcher;
    };

    return {
        isSignal: (value) => value instanceof Signal.State || value instanceof Signal.Computed,
        get: <T>(signal: SignalLike<T>) => (signal as SignalGetter<T>).get(),
        untrack: (callback) => Signal.subtle.untrack(callback),
        effect(callback) {
            const currentWatcher = getWatcher();

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
        },
    };
};

/**
 * Check if an implementation follows the TC39 proposal.
 * @param implementation The registered implementation.
 * @returns True if it is a Signal namespace.
 */
const isNamespace = (implementation: SignalNamespace | SignalAdapter): implementation is SignalNamespace =>
    typeof (implementation as SignalNamespace).State === 'function';

/**
 * The implementation as it was registered, kept to detect a conflicting registration.
 */
let registered: SignalNamespace | SignalAdapter | null = null;

/**
 * The adapter in use.
 * Signals are not implemented by any engine yet and DNA does not ship a polyfill,
 * so the implementation is either detected on the global scope or registered by the application.
 */
let adapter: SignalAdapter | null = null;

/**
 * Register the signals implementation to use, either an implementation of the TC39
 * proposal or an adapter for any other library.
 * A single implementation can be active at a time: mixing two of them would result in
 * two disjoint reactive graphs that cannot observe each other.
 * @param implementation The Signal namespace, or an adapter.
 * @throws If a different implementation has already been registered.
 */
export const configureSignals = (implementation: SignalNamespace | SignalAdapter): void => {
    if (registered && registered !== implementation) {
        throw new Error('A different Signal implementation is already in use');
    }
    registered = implementation;
    adapter = isNamespace(implementation) ? createNamespaceAdapter(implementation) : implementation;
};

const globalSignal = (globalThis as typeof globalThis & { Signal?: SignalNamespace }).Signal;
if (globalSignal) {
    configureSignals(globalSignal);
}

/**
 * Check if a signals implementation is available.
 * @returns True if signals can be used.
 */
export const hasSignals = (): boolean => !!adapter;

/**
 * Get the adapter in use.
 * @returns The adapter.
 * @throws If no implementation has been registered.
 */
const getAdapter = (): SignalAdapter => {
    if (!adapter) {
        throw new Error(
            'No Signal implementation is available. Register one with `configureSignals(Signal)` before using signals.'
        );
    }
    return adapter;
};

/**
 * Check if a value is a signal.
 * @param value The value to check.
 * @returns True if the value is a signal of the registered implementation.
 */
export const isSignal = <T = unknown>(value: unknown): value is SignalLike<T> => !!adapter && adapter.isSignal(value);

/**
 * Read the current value of a signal, whatever shape the implementation gives it.
 * @param signal The signal to read.
 * @returns The current value.
 * @throws If no implementation has been registered.
 */
export const get = <T = unknown>(signal: SignalLike<T>): T => getAdapter().get(signal);

/**
 * Run a callback without tracking the signals it reads.
 * It is a no-op when no implementation is available.
 * @param callback The callback to run.
 * @returns The result of the callback.
 */
export const untrack = <T>(callback: () => T): T => (adapter ? adapter.untrack(callback) : callback());

/**
 * Run a callback whenever one of the signals it reads changes.
 * The callback runs immediately once, then whenever a dependency changes.
 * It returns a function that stops it, and the callback may return its own cleanup.
 * @param callback The callback to run.
 * @returns A function that stops the effect and runs the last cleanup.
 * @throws If no Signal implementation is available.
 */
export const effect = (callback: Effect): (() => void) => {
    const currentAdapter = getAdapter();
    // the effect is created outside of any running computation: implementations that
    // adopt nested effects would otherwise dispose it as soon as the enclosing one re-runs
    return currentAdapter.untrack(() => currentAdapter.effect(callback));
};
