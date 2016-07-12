<a name="DNAPropertiesComponent"></a>

## DNAPropertiesComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAPropertiesComponent](#DNAPropertiesComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAPropertiesComponent()`](#new_DNAPropertiesComponent_new)
    * [`.createdCallback()`](#DNAPropertiesComponent+createdCallback)
    * [`.observeProperty(propName, callback)`](#DNAPropertiesComponent+observeProperty) ⇒ <code>Object</code>
    * [`.observeProperties(callback)`](#DNAPropertiesComponent+observeProperties) ⇒ <code>Object</code>

<a name="new_DNAPropertiesComponent_new"></a>

### `new DNAPropertiesComponent()`
Simple Custom Component for properties initialization via attributes.

**Example**  
my-component.js
```js
import { DNAPropertiesComponent } from 'dna/component';
export class MyComponent extends DNAPropertiesComponent {
  static get observedProperties() {
    return ['name'];
  }
}
```
app.js
```js
import { register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = register('my-component', MyComponent);
var temp = document.createElement('div');
temp.innerHTML = '<my-component name="Albert"></my-component>';
var element = temp.firstChild;
console.log(element.name); // logs "Albert"
```
<a name="DNAPropertiesComponent+createdCallback"></a>

### `dnaPropertiesComponent.createdCallback()`
On `created` callback, apply attributes to properties.

**Kind**: instance method of <code>[DNAPropertiesComponent](#DNAPropertiesComponent)</code>  
<a name="DNAPropertiesComponent+observeProperty"></a>

### `dnaPropertiesComponent.observeProperty(propName, callback)` ⇒ <code>Object</code>
Create a listener for node's property changes.

**Kind**: instance method of <code>[DNAPropertiesComponent](#DNAPropertiesComponent)</code>  
**Returns**: <code>Object</code> - An object with `cancel` method.  

| Param | Type | Description |
| --- | --- | --- |
| propName | <code>string</code> | The property name to observe. |
| callback | <code>function</code> | The callback to fire. |

<a name="DNAPropertiesComponent+observeProperties"></a>

### `dnaPropertiesComponent.observeProperties(callback)` ⇒ <code>Object</code>
Create a listener for node's properties changes.

**Kind**: instance method of <code>[DNAPropertiesComponent](#DNAPropertiesComponent)</code>  
**Returns**: <code>Object</code> - An object with `cancel` method.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback to fire. |

