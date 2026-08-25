/**
 * The signals implementation of DNA.
 *
 * It is built around three constraints that come from what the renderer does with it.
 *
 * Changes travel **synchronously**: assigning a property renders a component before the
 * assignment returns, and that contract has to survive a value coming from a signal. What is
 * written inside an open batch waits for it to close rather than for a task of its own, so a
 * write made while another one is still settling lands with it instead of after it.
 *
 * Linking and unlinking a computation to its sources is **O(1)**, because a template holds one
 * effect per binding: mounting a list of a thousand rows creates a thousand effects that live
 * at the same time, and tearing it down disposes of them all at once. An implementation that
 * walks its subscribers to add or remove one turns that into quadratic work.
 *
 * A derived value is **pulled, not pushed**: writing a source marks what depends on it and
 * stops there, so a computed nobody reads costs nothing, and one whose result did not change
 * does not run the effects below it.
 */

/**
 * The type of a cleanup function returned by an effect.
 */
type Cleanup = () => void;

/**
 * The type of an effect callback.
 */
// biome-ignore lint/suspicious/noConfusingVoidType: an effect may return nothing.
export type EffectCallback = () => Cleanup | undefined | void;

/**
 * The options of a signal.
 */
export type Options<T> = {
    /**
     * Compare the previous and the next value.
     * When it returns `true` the signal is considered unchanged and nothing below it runs.
     */
    equals?: (previousValue: T, newValue: T) => boolean;
};

/**
 * A signal that can be read: a value, or one derived from other signals.
 *
 * It is the shape rather than the classes, so that a signal of a narrower type goes where a
 * wider one is expected — a `State<string>` into an attribute typed `string | undefined`,
 * which the classes would refuse, holding a writer of their own value type. The mark is what
 * keeps that from accepting any object with a `get` method: reading such an object is all the
 * renderer could do with it, since following a value means being told when it changes, and only
 * a signal of this graph tells. It used to be taken and rendered once, as an object.
 *
 * A value that comes from somewhere else — a store, a signal of another library — is followed by
 * keeping a {@link State} of this graph and writing it from there.
 */
export type ReadonlySignal<T = unknown> = {
    /**
     * Read the current value, and depend on it.
     * @returns The current value.
     */
    get(): T;
    /**
     * The mark of a signal of this graph. It is declared and never written: nothing is emitted
     * for it, and it is here so that the type asks for a signal rather than for a `get` method.
     */
    readonly isSignal: true;
};

/**
 * A computation that reads sources: either a derived value or an effect.
 */
// biome-ignore lint/suspicious/noExplicitAny: the graph holds computations of every value type.
type Sink = Computed<any> | Effect;

/**
 * The computation that is collecting its sources, if any.
 */
let currentSink: Sink | null = null;

/**
 * How many batches are open. Effects run when the outermost one closes.
 */
let batchDepth = 0;

/**
 * The effects waiting to run.
 */
let pending: Effect[] | null = null;

/**
 * Whether the queue is being drained.
 */
let flushing = false;

/**
 * How many times the effects may re-queue themselves before giving up, which is what
 * an effect writing one of its own sources ends up doing.
 */
const RUNAWAY_LIMIT = 1000;

/**
 * A value other computations can read and depend upon.
 */
abstract class Source<T> {
    /**
     * @inheritdoc
     */
    declare readonly isSignal: true;

    /**
     * Bumped whenever the value actually changes.
     * Sinks record it as they read, and compare it to know whether they have work to do.
     */
    version = 0;

    /**
     * The computations that read this source.
     */
    readonly sinks: Set<Sink> = new Set();

    /**
     * Read the current value without depending on it.
     */
    abstract peek(): T;

    /**
     * Read the current value, and depend on it.
     * @returns The current value.
     */
    abstract get(): T;
}

/**
 * Record that the running computation read a source.
 * @param source The source that has been read.
 */
const link = (source: Source<unknown>) => {
    const sink = currentSink;
    // the set also dedupes: a computation that reads the same source twice links to it once
    if (sink && !source.sinks.has(sink)) {
        source.sinks.add(sink);
        sink.sources.push(source);
        sink.versions.push(source.version);
    }
};

/**
 * Detach a computation from the sources of its previous run, so that the next one collects
 * the sources it actually reads.
 * @param sink The computation to detach.
 */
const unlink = (sink: Sink) => {
    const sources = sink.sources;
    for (let i = 0, len = sources.length; i < len; i++) {
        sources[i].sinks.delete(sink);
    }
    sources.length = 0;
    sink.versions.length = 0;
};

/**
 * Check whether any of the sources of a computation holds a different value than the one it
 * was read at. Computed sources are validated along the way, which is what pulls a derived
 * value only as far as it is needed.
 * @param sink The computation to check.
 * @returns True if the computation has to run again.
 */
const hasChanged = (sink: Sink): boolean => {
    const sources = sink.sources;
    const versions = sink.versions;
    for (let i = 0, len = sources.length; i < len; i++) {
        const source = sources[i];
        if (source instanceof Computed) {
            source.validate();
        }
        if (source.version !== versions[i]) {
            return true;
        }
    }
    return false;
};

/**
 * Run a computation, collecting the sources it reads.
 * @param sink The computation to run.
 * @param body What the computation does.
 * @returns The result of the computation.
 */
const track = <T>(sink: Sink, body: () => T): T => {
    const previousSink = currentSink;
    unlink(sink);
    currentSink = sink;
    try {
        return body();
    } finally {
        currentSink = previousSink;
    }
};

/**
 * Mark what depends on a source that just changed: derived values are flagged as stale, and
 * the effects that are reached are queued. Nothing is recomputed here — walking the graph is
 * the whole of the push, and the work happens when the effects run and pull what they need.
 * @param source The source that changed.
 */
const mark = (source: Source<unknown>) => {
    for (const sink of source.sinks) {
        if (sink instanceof Computed) {
            if (!sink.stale) {
                sink.stale = true;
                mark(sink);
            }
        } else if (!sink.queued && !sink.disposed) {
            sink.queued = true;
            pending = pending || [];
            pending.push(sink);
        }
    }
};

/**
 * Run the queued effects, and the ones they queue in turn.
 * @throws The first error an effect threw, once the queue has drained, or if the effects keep
 * queueing themselves.
 */
const flush = () => {
    // an effect writing a signal starts a flush of its own: the one already running owns the
    // queue, and picks up whatever the write added on its next round
    if (flushing) {
        return;
    }
    flushing = true;
    let failure: unknown;
    let failed = false;
    try {
        let rounds = 0;
        while (pending) {
            if (++rounds > RUNAWAY_LIMIT) {
                throw new Error('Signal effects did not settle: an effect is writing one of its own sources');
            }
            const effects = pending;
            pending = null;
            for (let i = 0, len = effects.length; i < len; i++) {
                const effect = effects[i];
                effect.queued = false;
                // the effect was reached through a derived value: it runs only if that value
                // really changed, so a computation returning the same result stops here
                if (effect.disposed || !hasChanged(effect)) {
                    continue;
                }
                // one effect that throws does not keep its siblings from running: they hold the
                // rest of the DOM, which would otherwise be left describing a value that is no
                // longer there. The first failure is the one reported, once the queue is empty
                try {
                    effect.run();
                } catch (error) {
                    if (!failed) {
                        failed = true;
                        failure = error;
                    }
                }
            }
        }
    } finally {
        flushing = false;
        // the queue is empty by now unless the effects never settled: such a queue is dropped
        // rather than inherited by the next write, and the flags go with it
        if (pending) {
            for (let i = 0, len = pending.length; i < len; i++) {
                pending[i].queued = false;
            }
            pending = null;
        }
    }
    if (failed) {
        throw failure;
    }
};

/**
 * A value that can be written.
 */
export class State<T> extends Source<T> {
    private value: T;
    private readonly equals: (previousValue: T, newValue: T) => boolean;

    /**
     * Create a writable signal.
     * @param initialValue The initial value.
     * @param options The signal options.
     */
    constructor(initialValue: T, options?: Options<T>) {
        super();
        this.value = initialValue;
        this.equals = options?.equals ?? Object.is;
    }

    /**
     * @inheritdoc
     */
    peek(): T {
        return this.value;
    }

    /**
     * @inheritdoc
     */
    get(): T {
        link(this);
        return this.value;
    }

    /**
     * Write the value. What depends on it runs before this returns, unless a batch is open.
     * @param newValue The value to set.
     */
    set(newValue: T): void {
        if (this.equals(this.value, newValue)) {
            return;
        }
        this.value = newValue;
        this.version++;
        mark(this);
        if (!batchDepth) {
            flush();
        }
    }
}

/**
 * A value derived from the sources its computation reads.
 */
export class Computed<T> extends Source<T> {
    /**
     * The sources of the last run, and their version at the time.
     */
    readonly sources: Source<unknown>[] = [];
    readonly versions: number[] = [];

    /**
     * Whether something below the computation changed, so the cached value may no longer hold.
     */
    stale = true;

    private value: T = undefined as T;
    private computed = false;
    private computing = false;
    private readonly computation: () => T;
    private readonly equals: (previousValue: T, newValue: T) => boolean;

    /**
     * Create a derived signal.
     * @param computation The computation of the value.
     * @param options The signal options.
     */
    constructor(computation: () => T, options?: Options<T>) {
        super();
        this.computation = computation;
        this.equals = options?.equals ?? Object.is;
    }

    /**
     * Bring the cached value up to date, if it is not already.
     * @throws If the computation reads itself.
     */
    validate(): void {
        // checked before the staleness, since the computation clears that as it starts:
        // a computation reading itself finds it already cleared
        if (this.computing) {
            throw new Error('Signal computation depends on itself');
        }
        if (!this.stale) {
            return;
        }
        this.stale = false;
        // the mark walked here without knowing whether anything really changed: if none of the
        // sources holds a different value, the cached one still stands and nothing runs
        if (this.computed && !hasChanged(this)) {
            return;
        }

        this.computing = true;
        try {
            const newValue = track(this, this.computation);
            if (!this.computed || !this.equals(this.value, newValue)) {
                this.value = newValue;
                this.version++;
            }
            this.computed = true;
        } catch (error) {
            // a computation that threw leaves no value to stand behind: the staleness is taken
            // back so that the next read runs it again and throws again, rather than handing out
            // the value of a run that never finished — `undefined`, or the one from before —
            // for as long as nothing happens to invalidate it. A computation that threw before
            // reading anything has no source left to be invalidated by, and would never run again
            this.stale = true;
            this.computed = false;
            throw error;
        } finally {
            this.computing = false;
        }
    }

    /**
     * Detach the computation from its sources.
     * A derived value nobody reads any more would otherwise be kept — and walked by every write
     * of the values it read — for as long as they live. Reading it again recomputes it, and
     * links it back to whatever it reads.
     */
    dispose(): void {
        unlink(this);
        this.stale = true;
        this.computed = false;
    }

    /**
     * @inheritdoc
     */
    peek(): T {
        this.validate();
        return this.value;
    }

    /**
     * @inheritdoc
     */
    get(): T {
        this.validate();
        // linked after the validation, so that the version recorded is the current one
        link(this);
        return this.value;
    }
}

/**
 * A computation that runs for its side effects.
 *
 * It is the object form of {@link effect}, for a caller that has to hold on to it: running it
 * again is how work that depends on something the graph cannot see — the DOM, a field that is
 * not a signal — is redone on demand, without a signal invented to invalidate.
 */
export class Effect {
    readonly sources: Source<unknown>[] = [];
    readonly versions: number[] = [];

    queued = false;
    disposed = false;

    private cleanup: Cleanup | undefined;
    private readonly callback: EffectCallback;

    /**
     * Create an effect.
     * @param callback The callback to run.
     */
    constructor(callback: EffectCallback) {
        this.callback = callback;
    }

    /**
     * Run the callback, collecting the sources it reads.
     */
    run(): void {
        this.cleanup?.();
        this.cleanup = undefined;
        // only a function counts as a cleanup: a callback written as an arrow expression
        // returns whatever its body evaluates to, which is usually not one
        const result = track(this, this.callback);
        this.cleanup = typeof result === 'function' ? (result as Cleanup) : undefined;

        // a source written while this was still running was marked when nothing was listening
        // yet — the link to it is made as it is read, so a write that comes before that finds
        // no one to notify. Asking again now that every source is linked is what catches it.
        if (!this.queued && !this.disposed && hasChanged(this)) {
            this.queued = true;
            pending = pending || [];
            pending.push(this);
        }
    }

    /**
     * Stop the effect and run its last cleanup.
     */
    dispose(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        unlink(this);
        this.cleanup?.();
        this.cleanup = undefined;
    }
}

/**
 * Run a callback whenever one of the signals it reads changes.
 * The callback runs immediately once, and then before the write that changed a source returns.
 * @param callback The callback to run. It may return a cleanup function.
 * @returns A function that stops the effect and runs its last cleanup.
 */
export const effect = (callback: EffectCallback): (() => void) => {
    const node = new Effect(callback);
    node.run();

    return () => node.dispose();
};

/**
 * Run a callback without depending on the signals it reads.
 * @param callback The callback to run.
 * @returns The result of the callback.
 */
export const untrack = <T>(callback: () => T): T => {
    const previousSink = currentSink;
    currentSink = null;
    try {
        return callback();
    } finally {
        currentSink = previousSink;
    }
};

/**
 * Hold the effects back until the matching {@link endBatch}.
 * The scoped {@link batch} is the way to use this; the pair is for a caller that opens and
 * closes around work it does not own, and it must be balanced.
 */
export const beginBatch = (): void => {
    batchDepth++;
};

/**
 * Close a batch opened by {@link beginBatch}, running the effects it held back when the
 * outermost one closes.
 *
 * A call that closes a batch nobody opened is ignored rather than taken for what it says: a
 * negative depth is one no {@link beginBatch} can bring back to zero, and every write that
 * followed would be held back for the rest of the life of the page.
 */
export const endBatch = (): void => {
    if (batchDepth === 0) {
        return;
    }
    if (--batchDepth === 0) {
        flush();
    }
};

/**
 * Run a callback and hold the effects back until it returns, so that many writes settle once.
 * @param callback The callback to run.
 * @returns The result of the callback.
 */
export const batch = <T>(callback: () => T): T => {
    beginBatch();
    try {
        return callback();
    } finally {
        endBatch();
    }
};

/**
 * Check if a value is one of these signals.
 * The class is the check, and {@link ReadonlySignal} asks for the same thing: an object shaped
 * like a signal is not one, because nothing would tell the renderer when its value changed.
 * @param value The value to check.
 * @returns True if the value is a signal.
 */
export const isSignal = (value: unknown): value is ReadonlySignal<unknown> =>
    value instanceof State || value instanceof Computed;

/**
 * Create a writable signal.
 * @param initialValue The initial value.
 * @param options The signal options.
 * @returns The writable signal.
 */
export const state = <T>(initialValue: T, options?: Options<T>): State<T> => new State(initialValue, options);

/**
 * Create a derived signal.
 * @param computation The computation of the value.
 * @param options The signal options.
 * @returns The derived signal.
 */
export const computed = <T>(computation: () => T, options?: Options<T>): Computed<T> =>
    new Computed(computation, options);
