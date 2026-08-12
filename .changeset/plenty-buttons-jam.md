---
"@chialab/dna": minor
---

Add support for TC39 Signals in templates.

Signals interpolated as content, attributes, properties or event listeners are unwrapped and kept up to date, updating only the nodes bound to them. DNA does not bundle a polyfill: register an implementation with `configureSignals(Signal)`, or let DNA pick up a native `globalThis.Signal`. Also exports the `$signal` directive, `effect`, `untrack`, `isSignal` and `hasSignals`.
