<a name="DNAEventsComponent"></a>

## DNAEventsComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAEventsComponent](#DNAEventsComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAEventsComponent()`](#new_DNAEventsComponent_new)
    * [`.createdCallback()`](#DNAEventsComponent+createdCallback)
    * [`.trigger(evName, data, bubbles, cancelable)`](#DNAEventsComponent+trigger)

<a name="new_DNAEventsComponent_new"></a>

### `new DNAEventsComponent()`
Simple Custom Component with events delegation,
It also implement a `dispatchEvent` wrapper named `trigger`.

**Example**  
my-component.js
```js
import { DNAEventsComponent } from 'dna/component';
export class MyComponent extends DNAEventsComponent {
  static get events() {
    return {
      'click button': 'onButtonClick'
    }
  }
  onButtonClick() {
    console.log('button clicked');
  }
}
```
app.js
```js
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.js';
var MyElement = Register(MyComponent);
var element = new MyElement();
var button = document.createElement('button');
button.innerText = 'Click me';
element.appendChild(button);
button.click(); // logs "button clicked"
```
<a name="DNAEventsComponent+createdCallback"></a>

### `dnaEventsComponent.createdCallback()`
Fires when an instance of the element is created.

**Kind**: instance method of <code>[DNAEventsComponent](#DNAEventsComponent)</code>  
<a name="DNAEventsComponent+trigger"></a>

### `dnaEventsComponent.trigger(evName, data, bubbles, cancelable)`
`Node.prototype.dispatchEvent` wrapper.

**Kind**: instance method of <code>[DNAEventsComponent](#DNAEventsComponent)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| evName | <code>String</code> |  | The name of the event to fire. |
| data | <code>Object</code> |  | A set of custom data to pass to the event. |
| bubbles | <code>Boolean</code> | <code>true</code> | Should the event bubble throw the DOM tree. |
| cancelable | <code>Boolean</code> | <code>true</code> | Can be the event cancel by a callback. |

