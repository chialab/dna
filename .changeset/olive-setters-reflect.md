---
"@chialab/dna": patch
---

Reflect and observe the value a property setter returned.

A property declaring a `setter` handed the assigned value to `propertyChangedCallback` and `stateChangedCallback` while handing the transformed one to its observers, so the attribute reflected the value before the transformation.
