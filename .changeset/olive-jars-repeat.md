---
"@chialab/dna": minor
---

Introducing the `useSignal`, `useComputed`, `useSignalValue` and `useSignalEffect` hooks.

`useSignal` and `useComputed` create a signal and preserve it across renders, `useSignalValue` reads one and re-renders the function component whenever it changes, and `useSignalEffect` runs a callback whenever one of the signals it reads changes, stopping it when the fragment is unmounted.
