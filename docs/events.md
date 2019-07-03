# Events

Since Web Components are just `HTMLElement` extensions, events handling is completly delegated to the DOM implementation, so you can use `addEventListener` and `removeEventListener` to properly setup a callback. DNA add some extra features like declarative event listener declarations and delegation.

### Declarative event listeners

You can declare event listeners on a component using the `events` accessor:

```ts
import { Component } from '@chialab/dna';

class MyButton extends Component {
    get events() {
        return {
            click: this.onClick,
        };
    }

    onClick(event) { ... }
}
```

Event declaration accepts a function (in the example above, a prototype method has been referenced) or an object for listener configuration:

```ts
import { Component } from '@chialab/dna';

class GestureTracker extends Component {
    get events() {
        return {
            touchmove: {
                listener: (event) => { ... },
                passive: true,
            },
        };
    }
}
```

<aside class="note">

Please refer to the [addEventListener](https://developer.mozilla.org/it/docs/Web/API/Element/addEventListener) documentation for a complete list of listener options.

</aside>

### Template listeners

Listeners can be added via a template attribute named as the event with the `on` perfix:

```html
<my-dialog>
    <h2>Title</h2>
    <nav>
        <button onclick="[[ onNavClick ]]">Close</button>
    </nav>
</my-dialog>
```

### Delegation

DNA supports event delegation for both imperatively and declaratively declarations. The listener callback will received the original fired event as first argument and the matched target as secondo argumento.

<aside class="note">

Do not confuse the `event.target` property with the second argument of the listener: the first one is the node which actually fired the event, the second one is the node which matches the selector and it is in the event path (`event.target` may be a descending child of the matched one).

</aside>

Using the `events` accessor, you can specify the delegated child selector after the event name in the declaration key:

```ts
import { Component } from '@chialab/dna';

class MyDialog extends Component {
    get events() {
        return {
            // event name + selector
            'click nav button': {
                listener: (event, target) => { ... },
                passive: false,
            },
        };
    }
}
```

Otherwise, you can use `delegateEventListener` and `undelegateEventListener` methods just like `addEventListener` and `removeEventListener`:

```ts
import { Component } from '@chialab/idom';

class MyDialog extends Component { ... }

const element = new MyDialog();
const closeDialog = (event, target) => { ... };

// delegate listener
element.delegateEventListener('click', 'nav button', closeDialog, { passive: false });
// undelegate listener
element.undelegateEventListener('click', 'nav button', closeDialog);
```

### Dispatching events

DNA components overrides the `dispatchEvent` method in order to support an alternative signature for easier [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) creation:

```ts
import { Component } from '@chialab/dna';

class MyButton extends Component { ... }

const button = new MyButton();
// native dispatch
const event = new CustomEvent('sendEmail', {
    detail: { from '...', to: '...', body: '...' },
    bubbles: true,
    cancelable: true,
    composed: false,
});
button.dispatchEvent(event);
// DNA alternative signature
button.dispatchEvent('sendEmail',
    /* detail     */ { from '...', to: '...', body: '...' },
    /* bubbles    */ true,
    /* cancelable */ true,
    /* composed   */ false
);
```
