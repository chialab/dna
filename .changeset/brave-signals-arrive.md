---
"@chialab/dna": minor
---

DNA now carries its own signals implementation, exported as `Signal`.

`Signal.State`, `Signal.Computed`, `Signal.effect`, `Signal.untrack` and `Signal.batch` follow the shape of the TC39 proposal, with changes delivered **synchronously**: the DOM is patched before the assignment that caused it returns, the same guarantee a component property gives. A derived value is computed only when something reads it, and an effect below it does not run when the computation returns the same result.

A computation that throws is reported to whoever reads it, again on the next read, rather than being remembered as a value. An effect that throws does not keep the effects queued with it from running: they run, and the first failure is raised once the queue has drained. `Signal.Computed` can be detached from its sources with `dispose()`, which a derived value nobody reads any more needs in order not to be walked by every write of the values it read.

Signals work without any setup, and there is nothing to register: `configureSignals` and the `SignalAdapter` contract are gone, along with the automatic adoption of a native `globalThis.Signal`.
