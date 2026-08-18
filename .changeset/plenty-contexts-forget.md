---
"@chialab/dna": patch
---

Keep the state of a render out of the contexts it walks.

How deep a render is, where it is among the children of a parent, how much it moved, what it detached, which pass is running and the registry of the nodes it placed are all true of the render rather than of the nodes it visits. They lived on the render root, so every other context declared a field for each of them and left it empty — thousands of times over for a list of a thousand rows. They belong to the render now, and a context carries six fields fewer.

`Context`, which `useRenderContext` returns, no longer declares `contexts`, `_cursor`, `_shift`, `_detached`, `_depth` or `_releasing`. It is the bookkeeping of the renderer and is marked internal: nothing outside it should read those.
