---
"@chialab/dna": minor
---

Introducing computed properties.

A property declared with `compute` derives its value from the signals its computation reads instead of holding one. The computation runs with the component as its `this`, only when something reads the property, and only when one of the values it read has changed.

The property is read-only — through `setInnerPropertyValue` as much as through the accessor — and cannot declare the options that need a write to hang off, nor the ones that would take part in producing the value the computation is the whole of: `get`, `getter`, `type`, `fromAttribute` and `toAttribute` are refused rather than dropped in silence. An observer added at runtime with `observe` is refused too, since nothing would ever run it.
