---
"@chialab/dna": patch
---

Render with fewer allocations and fewer reads of the DOM.

A render no longer pays for what it does not use: the children list of a context, the node registry of a render root, the queue of the effects of a fragment and the list of the contexts a render detached are all created the moment something is put in them, the empty result of a `class` or a `style` conversion is shared instead of being allocated at each call, and the indexes a reorder works on are held in typed arrays. An element the render has just created is written straight away, without first asking the DOM what it already holds, and a plain tag is created without going through the custom elements registry or a namespace it does not need. Where a context sits among its siblings is remembered on the context itself, so a reorder no longer scans the list for each of them, and a subtree that holds nothing to release is dropped in a single step instead of being walked node by node.

The hooks of a function component are built once and belong to the fragment, so the `useState` setter now keeps its identity across renders: a `useCallback` or a `useEffect` that lists it among its dependencies is no longer invalidated by every render.

The state a render keeps while it walks — how deep it is, the contexts it detached — belongs to the root it started from rather than being shared by every render root of the page.
