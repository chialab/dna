---
"@chialab/dna": minor
---

Introducing computed properties.

A property declared with `compute` derives its value from the signals its computation reads instead of holding one. The computation runs with the component as its `this`, only when something reads the property, and only when one of the values it read has changed. The property is read-only, and cannot declare the options that need a write to hang off.
