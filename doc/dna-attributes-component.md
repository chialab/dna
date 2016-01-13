<a name="DNAAttributesComponent"></a>
## DNAAttributesComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAAttributesComponent](#DNAAttributesComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAAttributesComponent()`](#new_DNAAttributesComponent_new)
    * [`.createdCallback()`](#DNAAttributesComponent+createdCallback)

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
import { DNAComponents } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.next.js';
var MyElement = DNAComponents.register(MyComponent);
var element = new MyElement();
element.setAttribute('name', 'Newton');
console.log(element.name); // logs "Newton"
```
<a name="DNAAttributesComponent+createdCallback"></a>
### `dnaAttributesComponent.createdCallback()`
On `created` callback, sync attributes with properties.

**Kind**: instance method of <code>[DNAAttributesComponent](#DNAAttributesComponent)</code>  
