---
"@chialab/dna": minor
---

A component renders again when one of the signals its template read has changed.

The template is computed inside a computation, so what it depends on is worked out rather than declared: a property the template never reads no longer renders the component, an external signal read while rendering does, and writes made together render it once.

`requestUpdate` and `forceUpdate` keep asking for a render no change caused, `update: false` keeps a property from being depended upon when read, and `shouldUpdate` refusing a change keeps the DOM as it was.
