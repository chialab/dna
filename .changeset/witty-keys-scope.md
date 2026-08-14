---
"@chialab/dna": patch
---

Fix the identity of keyed children when a function component re-renders alone.

The keys of the children of a function component were registered in the parent context, while a fragment-scoped re-render looks them up in the context of the function component itself. So every update driven from inside a function component — a `useState` setter, or a signal interpolated as content — found an empty registry and re-created all of its keyed children instead of moving them. The children of a function component are now a key scope of their own, consistent between a render of the whole tree and a render of the single fragment.
