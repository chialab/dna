<a name="DNAStyleComponent"></a>

## DNAStyleComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAStyleComponent](#DNAStyleComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAStyleComponent()`](#new_DNAStyleComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNAStyleComponent+createdCallback)
    * _static_
        * [`.onRegister(id)`](#DNAStyleComponent.onRegister)
        * [`.addCss(id, style)`](#DNAStyleComponent.addCss) ⇒ <code>HTMLStyleElement</code>

<a name="new_DNAStyleComponent_new"></a>

### `new DNAStyleComponent()`
Simple Custom Component with css style handling using the `css` property.

**Example**  
my-component.js
```js
import { DNAStyleComponent } from 'dna/component';
export class MyComponent extends DNAStyleComponent {
  static get css() {
    return '.my-component p { color: red; }'
  }
}
```
app.js
```js
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = Register(MyComponent);
var element = new MyElement();
var p = document.createElement('p');
p.innerText = 'Paragraph';
element.appendChild(p); // text inside `p` gets the red color
```
<a name="DNAStyleComponent+createdCallback"></a>

### `dnaStyleComponent.createdCallback()`
Fires when an instance of the element is created.

**Kind**: instance method of <code>[DNAStyleComponent](#DNAStyleComponent)</code>  
<a name="DNAStyleComponent.onRegister"></a>

### `DNAStyleComponent.onRegister(id)`
Fires when an the element is registered.

**Kind**: static method of <code>[DNAStyleComponent](#DNAStyleComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The element definition name. |

<a name="DNAStyleComponent.addCss"></a>

### `DNAStyleComponent.addCss(id, style)` ⇒ <code>HTMLStyleElement</code>
Add `<style>` tag for the component.

**Kind**: static method of <code>[DNAStyleComponent](#DNAStyleComponent)</code>  
**Returns**: <code>HTMLStyleElement</code> - the style tag created.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The CSS element unique id. |
| style | <code>String</code> | The CSS content. |

