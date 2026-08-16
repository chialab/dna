---
"@chialab/dna": minor
---

Introducing the `useSignal`, `useComputed`, `useSignalValue` and `useSignalEffect` hooks.

`useSignal` and `useComputed` create signals with the registered implementation and preserve them across renders, `useSignalValue` reads a signal and re-renders the function component whenever it changes, and `useSignalEffect` runs a callback whenever one of the signals it reads changes, stopping it when the fragment is unmounted.

A `SignalAdapter` can now also provide the optional `state` and `computed` factories, which is what the first two hooks need: an adapter without them still renders everything it is handed.
