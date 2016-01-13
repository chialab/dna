<a name="DNAStyleComponent"></a>
## DNAStyleComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAStyleComponent](#DNAStyleComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAStyleComponent()`](#new_DNAStyleComponent_new)
    * [`.onRegister()`](#DNAStyleComponent.onRegister)
    * [`.addCss(css)`](#DNAStyleComponent.addCss) ⇒ <code>HTMLStyleElement</code>

<a name="new_DNAStyleComponent_new"></a>
### `new DNAStyleComponent()`
Simple Custom Component with css style handling using the `css` property.

<a name="DNAStyleComponent.onRegister"></a>
### `DNAStyleComponent.onRegister()`
Fires when an the element is registered.

**Kind**: static method of <code>[DNAStyleComponent](#DNAStyleComponent)</code>  
<a name="DNAStyleComponent.addCss"></a>
### `DNAStyleComponent.addCss(css)` ⇒ <code>HTMLStyleElement</code>
Add `<style>` tag for the component.

**Kind**: static method of <code>[DNAStyleComponent](#DNAStyleComponent)</code>  
**Returns**: <code>HTMLStyleElement</code> - the style tag created.  

| Param | Type | Description |
| --- | --- | --- |
| css | <code>String</code> | The CSS content. |

