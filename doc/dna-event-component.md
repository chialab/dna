<a name="DNAEventComponent"></a>
## DNAEventComponent ⇐ <code>DNAComponent</code>
**Kind**: global class  
**Extends:** <code>DNAComponent</code>  

* [DNAEventComponent](#DNAEventComponent) ⇐ <code>DNAComponent</code>
    * [`new DNAEventComponent()`](#new_DNAEventComponent_new)
    * _instance_
        * [`.createdCallback()`](#DNAEventComponent+createdCallback)
        * [`.addEventListener(evName, callback)`](#DNAEventComponent+addEventListener)
        * [`.trigger(evName, data, bubbles, cancelable)`](#DNAEventComponent+trigger)
    * _static_
        * [`.createEvent(type)`](#DNAEventComponent.createEvent) ⇒ <code>Event</code>

<a name="new_DNAEventComponent_new"></a>
### `new DNAEventComponent()`
Simple Custom Component with events delegation, `addEventListener` polyfill and a `dispatchEvent` wrapper named `trigger`.

<a name="DNAEventComponent+createdCallback"></a>
### `dnaEventComponent.createdCallback()`
Fires when an instance of the element is created.

**Kind**: instance method of <code>[DNAEventComponent](#DNAEventComponent)</code>  
<a name="DNAEventComponent+addEventListener"></a>
### `dnaEventComponent.addEventListener(evName, callback)`
`Node.prototype.addEventListener` polyfill.

**Kind**: instance method of <code>[DNAEventComponent](#DNAEventComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| evName | <code>String</code> | The name of the event to listen. |
| callback | <code>function</code> | The callback for the event. |

<a name="DNAEventComponent+trigger"></a>
### `dnaEventComponent.trigger(evName, data, bubbles, cancelable)`
`Node.prototype.dispatchEvent` wrapper.

**Kind**: instance method of <code>[DNAEventComponent](#DNAEventComponent)</code>  

| Param | Type | Description |
| --- | --- | --- |
| evName | <code>String</code> | The name of the event to fire. |
| data | <code>Object</code> | A set of custom data to pass to the event. |
| bubbles | <code>Boolean</code> | Should the event bubble throw the DOM tree. |
| cancelable | <code>Boolean</code> | Can be the event cancel by a callback. |

<a name="DNAEventComponent.createEvent"></a>
### `DNAEventComponent.createEvent(type)` ⇒ <code>Event</code>
Create an Event instance.

**Kind**: static method of <code>[DNAEventComponent](#DNAEventComponent)</code>  
**Returns**: <code>Event</code> - The created event.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The event type. |

