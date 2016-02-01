<a name="DNAAttributesComponent"></a>
## DNAAttributesComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAAttributesComponent](#DNAAttributesComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAAttributesComponent()`](#new_DNAAttributesComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNAAttributesComponent+createdCallback)
    * _static_
        * [`.onRegister()`](#DNAAttributesComponent.onRegister)

<a name="new_DNAAttributesComponent_new"></a>
### `new DNAAttributesComponent()`
Simple Custom Component with attributes watching and reflecting.

**Example**  
my-component.next.js
```js
import { DNAAttributesComponent } from 'dna/component';
export class MyComponent extends DNAAttributesComponent {
  get attributes() {
    return ['name'];
  }
}
```
app.next.js
```js
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.next.js';
var MyElement = Register(MyComponent);
var element = new MyElement();
element.setAttribute('name', 'Newton');
console.log(element.name); // logs "Newton"
```
<a name="DNAAttributesComponent+createdCallback"></a>
### `dnaAttributesComponent.createdCallback()`
On `created` callback, sync attributes with properties.

**Kind**: instance method of <code>[DNAAttributesComponent](#DNAAttributesComponent)</code>  
<a name="DNAAttributesComponent.onRegister"></a>
### `DNAAttributesComponent.onRegister()`
Fires when an the element is registered.

**Kind**: static method of <code>[DNAAttributesComponent](#DNAAttributesComponent)</code>  
