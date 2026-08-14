---
"@chialab/dna": minor
---

Add support for signals in templates.

Signals interpolated as content, attributes, properties or event listeners are unwrapped and kept up to date, updating only the nodes bound to them. DNA does not bundle an implementation: register one with `configureSignals`, or let DNA pick up a native `globalThis.Signal`. Also exports the `$signal` directive.
