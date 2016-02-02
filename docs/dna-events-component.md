<a name="DNAEventsComponent"></a>
## DNAEventsComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAEventsComponent](#DNAEventsComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAEventsComponent()`](#new_DNAEventsComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNAEventsComponent+createdCallback)
        * [`.addEventListener(evName, callback)`](#DNAEventsComponent+addEventListener)
        * [`.trigger(evName, data, bubbles, cancelable)`](#DNAEventsComponent+trigger)
    * _static_
        * [`.createEvent(type)`](#DNAEventsComponent.createEvent) ⇒ <code>Event</code>

<a name="new_DNAEventsComponent_new"></a>
### `new DNAEventsComponent()`
Simple Custom Component with events delegation, `addEventListener` polyfill and a `dispatchEvent` wrapper named `trigger`.

**Example**  
my-component.next.js
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
app.next.js
```js
import { Register } from 'dna/component';
import { MyComponent } from './components/my-component/my-component.next.js';
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
<a name="DNAEventsComponent+addEventListener"></a>
### `dnaEventsComponent.addEventListener(evName, callback)`
`Node.prototype.addEventListener` polyfill.

**Kind**: instance method of <code>[DNAEventsComponent](#DNAEventsComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| evName | <code>String</code> | The name of the event to listen. |
| callback | <code>function</code> | The callback for the event. |

<a name="DNAEventsComponent+trigger"></a>
### `dnaEventsComponent.trigger(evName, data, bubbles, cancelable)`
`Node.prototype.dispatchEvent` wrapper.

**Kind**: instance method of <code>[DNAEventsComponent](#DNAEventsComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| evName | <code>String</code> | The name of the event to fire. |
| data | <code>Object</code> | A set of custom data to pass to the event. |
| bubbles | <code>Boolean</code> | Should the event bubble throw the DOM tree. |
| cancelable | <code>Boolean</code> | Can be the event cancel by a callback. |

<a name="DNAEventsComponent.createEvent"></a>
### `DNAEventsComponent.createEvent(type)` ⇒ <code>Event</code>
Create an Event instance.

**Kind**: static method of <code>[DNAEventsComponent](#DNAEventsComponent)</code>  
**Returns**: <code>Event</code> - The created event.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The event type. |

