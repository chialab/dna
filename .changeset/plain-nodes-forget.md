---
"@chialab/dna": patch
---

Leave nothing behind when a property is no longer declared.

A property the previous render had set and this one does not was written the value it no longer has, which a property that holds a string shows as it is: dropping `title` left `title="undefined"` on the node, and dropping the `value` of a form field left the field holding the word rather than nothing. The property is emptied and the attribute removed, so the node is left as it would have been had the property never been declared. An attribute a template declares `false` is unaffected: for `draggable` that is one of the values it takes, not the absence of it.
