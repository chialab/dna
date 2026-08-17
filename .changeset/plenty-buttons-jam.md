---
"@chialab/dna": minor
---

Add support for signals in templates.

Signals interpolated as content, attributes, properties or event listeners are unwrapped and kept up to date, updating only the nodes bound to them. Also exports the `$signal` directive, which does the same explicitly.
