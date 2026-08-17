---
"@chialab/dna": minor
---

DNA now carries its own signals implementation, exported as `Signal`.

`Signal.State`, `Signal.Computed`, `Signal.effect`, `Signal.untrack` and `Signal.batch` follow the shape of the TC39 proposal, with changes delivered **synchronously**: the DOM is patched before the assignment that caused it returns, the same guarantee a component property gives. A derived value is computed only when something reads it, and an effect below it does not run when the computation returns the same result.

Signals work without any setup, and there is nothing to register: `configureSignals` and the `SignalAdapter` contract are gone, along with the automatic adoption of a native `globalThis.Signal`.
