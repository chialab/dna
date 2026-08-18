---
"@chialab/dna": patch
---

Fix the lifecycle of keyed nodes dropped or moved while reordering.

A keyed node detached to make room for another one skipped the cleanup pass: when it was really gone its `useEffect` cleanups never ran and its state was orphaned, and when it was re-attached at another position a new render context was created for it, dropping the hooks state that the key is meant to preserve. Detached contexts are now released once the render has settled, and a keyed function component keeps its own context across a reorder.
