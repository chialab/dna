<a name="DNAPropertiesComponent"></a>

## DNAPropertiesComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAPropertiesComponent](#DNAPropertiesComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAPropertiesComponent()`](#new_DNAPropertiesComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNAPropertiesComponent+createdCallback)
    * _static_
        * [`.onRegister()`](#DNAPropertiesComponent.onRegister)

<a name="new_DNAPropertiesComponent_new"></a>

### `new DNAPropertiesComponent()`
Simple Custom Component for properties initialization via attributes.

**Example**  
my-component.js
```js
import { DNAPropertiesComponent } from 'dna/component';
export class MyComponent extends DNAPropertiesComponent {
  get properties() {
    return ['name'];
  }
}
```
app.js
```js
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = Register('my-component', { prototype: MyComponent });
var temp = document.createElement('div');
temp.innerHTML = '<my-component name="Albert"></my-component>';
var element = temp.firstChild;
console.log(element.name); // logs "Albert"
```
<a name="DNAPropertiesComponent+createdCallback"></a>

### `dnaPropertiesComponent.createdCallback()`
On `created` callback, apply attributes to properties.

**Kind**: instance method of <code>[DNAPropertiesComponent](#DNAPropertiesComponent)</code>  
<a name="DNAPropertiesComponent.onRegister"></a>

### `DNAPropertiesComponent.onRegister()`
Fires when an the element is registered.

**Kind**: static method of <code>[DNAPropertiesComponent](#DNAPropertiesComponent)</code>  
