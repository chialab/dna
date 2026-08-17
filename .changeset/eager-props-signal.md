---
"@chialab/dna": minor
---

The properties of a component are held by signals, reachable through `signals`.

`this.signals.title` is the signal of the `title` property: reading it inside a computation depends on the property, and assigning the property runs what depends on it. It is the property itself rather than a copy of it, so a derived value stays in step with it without an observer, and only the nodes bound to it are patched.

Reading a property the usual way inside a computation tracks it just the same. Assignment is unchanged: it still validates the value, reflects the attribute, runs the observers, fires the event and renders the component, synchronously and in that order — and writing the signal is that same assignment, not a shortcut past it, so the property, the attribute and the DOM cannot end up disagreeing.

`signals` covers every property the component declares, including the ones defined after it was first read.
