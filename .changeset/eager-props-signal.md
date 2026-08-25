---
"@chialab/dna": minor
---

The properties of a component are held by signals, reachable through `signals`.

`this.signals.title` is the signal of the `title` property: reading it inside a computation depends on the property, and assigning the property runs what depends on it. It is the property itself rather than a copy of it, so a derived value stays in step with it without an observer, and only the nodes bound to it are patched.

Reading a property the usual way inside a computation tracks it just the same. Assignment keeps its order: it validates the value, reflects the attribute, runs the observers, fires the event and renders the component, in that order — and writing the signal is that same assignment, not a shortcut past it, so the property, the attribute and the DOM cannot end up disagreeing.

An assignment renders before it returns, unless it is made while another one is still running. A property written from an observer, from `propertyChangedCallback` or from a listener of the property event settles with the assignment that led there, and the DOM is patched once, when that one returns — the same coalescing `assign` and the `collectUpdates` pair have always asked for, now applied to the writes a component makes while reacting to another. Everything the assignment does before rendering — the attribute, the observers, the event — still happens where it did, immediately and in order.

`signals` covers every property the component declares, including the ones defined after it was first read.
