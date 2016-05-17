<a name="DNAAttributesComponent"></a>

## DNAAttributesComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAAttributesComponent](#DNAAttributesComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAAttributesComponent()`](#new_DNAAttributesComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNAAttributesComponent+createdCallback)
        * [`.attributeChangedCallback(attrName, oldVal, newVal)`](#DNAAttributesComponent+attributeChangedCallback)
    * _static_
        * [`.onRegister()`](#DNAAttributesComponent.onRegister)

<a name="new_DNAAttributesComponent_new"></a>

### `new DNAAttributesComponent()`
Simple Custom Component with attributes watching and reflecting.

**Example**  
my-component.js
```js
import { DNAAttributesComponent } from 'dna/component';
export class MyComponent extends DNAAttributesComponent {
  get attributes() {
    return ['name'];
  }
}
```
app.js
```js
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = Register(MyComponent);
var element = new MyElement();
element.setAttribute('name', 'Newton');
console.log(element.name); // logs "Newton"
```
<a name="DNAAttributesComponent+createdCallback"></a>

### `dnaAttributesComponent.createdCallback()`
On `created` callback, sync attributes with properties.

**Kind**: instance method of <code>[DNAAttributesComponent](#DNAAttributesComponent)</code>  
<a name="DNAAttributesComponent+attributeChangedCallback"></a>

### `dnaAttributesComponent.attributeChangedCallback(attrName, oldVal, newVal)`
On `attributeChanged` callback, sync attributes with properties.

**Kind**: instance method of <code>[DNAAttributesComponent](#DNAAttributesComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| attrName | <code>String</code> | The changed attribute name. |
| oldVal | <code>\*</code> | The value of the attribute before the change. |
| newVal | <code>\*</code> | The value of the attribute after the change. |

<a name="DNAAttributesComponent.onRegister"></a>

### `DNAAttributesComponent.onRegister()`
Fires when an the element is registered.

**Kind**: static method of <code>[DNAAttributesComponent](#DNAAttributesComponent)</code>  
