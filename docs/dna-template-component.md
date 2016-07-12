<a name="DNATemplateComponent"></a>

## DNATemplateComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNATemplateComponent](#DNATemplateComponent) ⇐ <code>DNAComponent</code>
    * [`new DNATemplateComponent()`](#new_DNATemplateComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNATemplateComponent+createdCallback)
        * [`.render(content)`](#DNATemplateComponent+render) ⇒
    * _static_
        * [`.autoUpdateView`](#DNATemplateComponent.autoUpdateView)
        * [`.onRegister(id)`](#DNATemplateComponent.onRegister)

<a name="new_DNATemplateComponent_new"></a>

### `new DNATemplateComponent()`
Simple Custom Component with template handling using the `template` property.

**Example**  
my-component.js
```js
import { DNATemplateComponent } from 'dna/component';
export class MyComponent extends DNATemplateComponent {
  static get template() {
    return `<h1>${this.name}</h1>`;
  }
  get name() {
    return 'Newton';
  }
}
```
app.js
```js
import { register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = register('my-component', MyComponent);
var element = new MyElement();
console.log(element.innerHTML); // logs "<h1>Newton</h1>"
```
<a name="DNATemplateComponent+createdCallback"></a>

### `dnaTemplateComponent.createdCallback()`
Fires when an instance of the element is created.

**Kind**: instance method of <code>[DNATemplateComponent](#DNATemplateComponent)</code>  
<a name="DNATemplateComponent+render"></a>

### `dnaTemplateComponent.render(content)` ⇒
Update Component child nodes.

**Kind**: instance method of <code>[DNATemplateComponent](#DNATemplateComponent)</code>  
**Returns**: Promise The render promise.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>\*</code> | Optional result of a `render` of an extended class. |

<a name="DNATemplateComponent.autoUpdateView"></a>

### `DNATemplateComponent.autoUpdateView`
Default `autoUpdateView` conf.

**Kind**: static property of <code>[DNATemplateComponent](#DNATemplateComponent)</code>  
<a name="DNATemplateComponent.onRegister"></a>

### `DNATemplateComponent.onRegister(id)`
Fires when an the element is registered.

**Kind**: static method of <code>[DNATemplateComponent](#DNATemplateComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The element definition name. |

