---
"@chialab/dna": patch
---

Keep the state of a function component displaced by a keyed sibling.

A keyed node moving up to the cursor exchanges places with whatever sits there, which costs one copy instead of one per sibling in between. A function component cannot take part in that exchange: its marker and the nodes it rendered are one contiguous range, and sending the marker to the slot the keyed node came from split the range in two. The walk no longer recognised the fragment and built a marker and a set of hooks of its own, so `useState` started over and `useEffect` ran again as if it had just been mounted. The range moves whole in that case, and only nodes that occupy a single slot are exchanged.
