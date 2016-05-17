<a name="DNABaseComponent"></a>

## DNABaseComponent ⇐ <code>DNAMixedComponent</code>
**Kind**: global class  
**Extends:** <code>DNAMixedComponent</code>  

* [DNABaseComponent](#DNABaseComponent) ⇐ <code>DNAMixedComponent</code>
    * [`new DNABaseComponent()`](#new_DNABaseComponent_new)
    * [`.behaviors`](#DNABaseComponent.behaviors) : <code>Array</code>

<a name="new_DNABaseComponent_new"></a>

### `new DNABaseComponent()`
Simple Custom Component with some behaviors.

**Example**  
my-component.js
```js
import { DNABaseComponent } from 'dna/component';
export class MyComponent extends DNABaseComponent {
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
<a name="DNABaseComponent.behaviors"></a>

### `DNABaseComponent.behaviors` : <code>Array</code>
A list of mixins, including: DNAStyleComponent, DNAEventsComponent,
DNAPropertiesComponent, DNAAttributesComponent and DNATemplateComponent.

**Kind**: static property of <code>[DNABaseComponent](#DNABaseComponent)</code>  
