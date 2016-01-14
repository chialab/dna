## Functions

<dl>
<dt><a href="#Create">`Create(tagName, config)`</a> ⇒ <code>function</code></dt>
<dd><p>Create and register a (Web) Component.
<code>document.registerElement</code>-like interface.</p>
</dd>
<dt><a href="#Register">`Register()`</a></dt>
<dd><p>Wrap the <a href="DNAHelper#register"><code>DNAHelper.register</code></a> method.</p>
</dd>
</dl>

<a name="Create"></a>
## `Create(tagName, config)` ⇒ <code>function</code>
Create and register a (Web) Component.
`document.registerElement`-like interface.

**Kind**: global function  
**Returns**: <code>function</code> - The Component constructor.  

| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>string</code> | The tag to use for the custom element. (required) |
| config | <code>object</code> | A configuration object. (`prototype` key is required) |

<a name="Register"></a>
## `Register()`
Wrap the [`DNAHelper.register`](DNAHelper#register) method.

**Kind**: global function  
