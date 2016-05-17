<a name="DNAVDomComponent"></a>

## DNAVDomComponent ⇐ <code>DNATemplateComponent</code>
**Kind**: global class  
**Extends:** <code>DNATemplateComponent</code>  

* [DNAVDomComponent](#DNAVDomComponent) ⇐ <code>DNATemplateComponent</code>
    * [`new DNAVDomComponent()`](#new_DNAVDomComponent_new)
    * _instance_
        * [`.updateViewContent()`](#DNAVDomComponent+updateViewContent)
    * _static_
        * [`.useVirtualDomHooks`](#DNAVDomComponent.useVirtualDomHooks)

<a name="new_DNAVDomComponent_new"></a>

### `new DNAVDomComponent()`
Same as DNATemplateComponent, but with VDOM support.
This component is available only including /dna\.vdom(\-?.*)\.js/ libraries.

**Example**  
my-component.js
```js
import { DNAVDomComponent } from 'dna/component';
export class MyComponent extends DNAVDomComponent {
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
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = Register(MyComponent);
var element = new MyElement();
console.log(element.innerHTML); // logs "<h1>Newton</h1>"
```
<a name="DNAVDomComponent+updateViewContent"></a>

### `dnavDomComponent.updateViewContent()`
Update Component child nodes using VDOM trees.

**Kind**: instance method of <code>[DNAVDomComponent](#DNAVDomComponent)</code>  
<a name="DNAVDomComponent.useVirtualDomHooks"></a>

### `DNAVDomComponent.useVirtualDomHooks`
Use virtualDom hooks for component life-cycle.

**Kind**: static property of <code>[DNAVDomComponent](#DNAVDomComponent)</code>  
