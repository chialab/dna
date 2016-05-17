<a name="DNAVDomBaseComponent"></a>

## DNAVDomBaseComponent ⇐ <code>DNABaseComponent</code>
**Kind**: global class  
**Extends:** <code>DNABaseComponent</code>  

* [DNAVDomBaseComponent](#DNAVDomBaseComponent) ⇐ <code>DNABaseComponent</code>
    * [`new DNAVDomBaseComponent()`](#new_DNAVDomBaseComponent_new)
    * [`.behaviors`](#DNAVDomBaseComponent.behaviors) : <code>Array</code>

<a name="new_DNAVDomBaseComponent_new"></a>

### `new DNAVDomBaseComponent()`
Same as DNABaseComponent, with DNAVDomComponent behavior instead of DNATemplateComponent.
This component is available only including /dna\.vdom(\-?.*)\.js/ libraries.

**Example**  
my-component.js
```js
import { DNAVDomBaseComponent } from 'dna/component';
export class MyComponent extends DNAVDomBaseComponent {
  get template() {
    return `...`;
  }
  get style() {
    return '...';
  }
  get attributes() {
    return ['...', '...'];
  }
  get properties() {
    return ['...', '...'];
  }
  get events() {
    return {
      '...': '...'
    };
  }
}
```
<a name="DNAVDomBaseComponent.behaviors"></a>

### `DNAVDomBaseComponent.behaviors` : <code>Array</code>
Same DNABaseComponent's list of mixins,
with DNAVDomComponent behavior instead of DNATemplateComponent.

**Kind**: static property of <code>[DNAVDomBaseComponent](#DNAVDomBaseComponent)</code>  
