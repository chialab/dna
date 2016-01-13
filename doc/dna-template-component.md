<a name="DNATemplateComponent"></a>
## DNATemplateComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNATemplateComponent](#DNATemplateComponent) ⇐ <code>DNAComponent</code>
    * [`new DNATemplateComponent()`](#new_DNATemplateComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNATemplateComponent+createdCallback)
    * _static_
        * [`.onRegister()`](#DNATemplateComponent.onRegister)

<a name="new_DNATemplateComponent_new"></a>
### `new DNATemplateComponent()`
Simple Custom Component with template handling using the `template` property.

**Example**  
my-component.next.js
```js
import { DNATemplateComponent } from 'dna/component';
export class MyComponent extends DNATemplateComponent {
  static get template() {
    return `<h1>${this.name}</h1>`
  }
  get name() {
    return 'Newton'
  }
}
```
app.next.js
```js
import { DNAComponents } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.next.js';
var MyElement = DNAComponents.register(MyComponent);
var element = new MyElement();
console.log(element.innerHTML); // logs "<h1>Newton</h1>"
```
<a name="DNATemplateComponent+createdCallback"></a>
### `dnaTemplateComponent.createdCallback()`
Fires when an instance of the element is created.

**Kind**: instance method of <code>[DNATemplateComponent](#DNATemplateComponent)</code>  
<a name="DNATemplateComponent.onRegister"></a>
### `DNATemplateComponent.onRegister()`
Fires when an the element is registered.

**Kind**: static method of <code>[DNATemplateComponent](#DNATemplateComponent)</code>  
