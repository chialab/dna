# Events

Since Web Components are just `HTMLElement` extensions, events handling is completly delegated to the DOM implementation, so you can use `addEventListener` and `removeEventListener` to properly setup a callback. DNA add some extra features like declarative event listener declarations and delegation, and a special decorator for component methods.

## Using the decorator

Some class methods can be bound to an event listener with the `listener` decorator. You can also delegate events giving a valid selector to the listener object:

```ts
import { Component, define, listener} from '@chialab/dna';

class MyForm extends Component {
    @listener({ event: 'click', passive: true })
    onClick(event) {
        //
    }

    @listener({ event: 'input', selector: '[name="age"]' })
    onInputAge(event, target) {
        //
    }
}

define('my-form', MyForm, { extends: 'form' });
```

## Declarative event listeners

You can also declare event listeners on a component using the `listeners` accessor, if you won't/can't use decorators:

```ts
import { Component, define } from '@chialab/dna';

class MyButton extends Component {
    get listeners() {
        return {
            'click': this.onClick,
            'input [name="age"]': this.onInputAge,
        };
    };

    onClick(event) {
        event.preventDefault();
    }

    onInputAge(event, target) {
        console.log(target.value);
    }
}

define('my-button', MyButton, { extends: 'button' });
```

Event declaration accepts a function (in the example above, a prototype method has been referenced) or an object for listener configuration:

```ts
import { Component, define } from '@chialab/dna';

class MyTracker extends Component {
    get listeners(){
        return {
            touchmove: {
                listener: (event) => {
                    event.preventDefault();
                },
                passive: true,
            },
        };
    };
}

define('my-tracker', MyTracker);
```

<aside class="note">

Please refer to the [addEventListener](https://developer.mozilla.org/it/docs/Web/API/Element/addEventListener) documentation for a complete list of listener options.

</aside>

## Template listeners

Listeners can be added via a template attribute named as the event with the `on` prefix:

```ts
import { Component, html define } from '@chialab/dna';

class MyHeader extends Component {
    render() {
        return html`
            <h2>${this.title}</h2>
            <nav>
                <button onclick=${this.onNavClick}>Close</button>
            </nav>
        `;
    }
}

define('my-header', MyHeader, { extends: 'header' });
```

## Delegation

DNA supports event delegation for both imperatively and declaratively declarations. The listener callback will receive the original fired event as first argument and the matched target as second argument.

<aside class="note">

Do not confuse the `event.target` property with the second argument of the listener: the first one is the node which actually fired the event, the second one is the node which matches the selector and it is in the event path (`event.target` may be a descending child of the matched one).

</aside>

Using the `listeners` getter, you can specify the delegated child selector after the event name in the declaration key:

```ts
import { Component, define } from '@chialab/dna';

class MyDialog extends Component {
    get listeners() {
        return {
            // event name + selector
            'click nav button': {
                listener: (event, target) => { ... },
                passive: false,
            },
        };
    };
}

define('my-dialog', MyDialog, { extends: 'dialog' });
```

Otherwise, you can use `delegateEventListener` and `undelegateEventListener` methods just like `addEventListener` and `removeEventListener`:

```ts
import { Component, DOM, define } from '@chialab/idom';

class MyDialog extends Component { ... }
define('my-button', MyButton, { extends: 'button' });

const element = new MyDialog();
const closeDialog = (event, target) => { ... };
DOM.appendChild(document.body, element);
// delegate listener
element.delegateEventListener('click', 'nav button', closeDialog, { passive: false });
// undelegate listener
element.undelegateEventListener('click', 'nav button', closeDialog);
```

### Dispatching events

DNA components overrides the `dispatchEvent` method in order to support an alternative signature for easier [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) creation:

```ts
import { Component, DOM, define } from '@chialab/dna';

class MyButton extends Component { ... }
define('my-button', MyButton, { extends: 'button' });

const button = new MyButton();
DOM.appendChild(document.body, element);
// native dispatch
const event = new CustomEvent('sendEmail', {
    detail: { from: '...', to: '...', body: '...' },
    bubbles: true,
    cancelable: true,
    composed: false,
});
button.dispatchEvent(event);

// DNA alternative signature
button.dispatchEvent('sendEmail',
    // detail
    { from: '...', to: '...', body: '...' },
    // bubbles
    true,
    // cancelable
    true,
    // composed
    false
);
```

## Async dispatch

With DNA, you can also dispatch events and await a `Promise` which resolves when all async listeners are completed:

```ts
import { Component, DOM, define } from '@chialab/dna';

class Paginator extends Component {
    get listeners() {
        return {
            'click button.next': async () => {
                this.data = await this.dispatchAsyncEvent('fetch');
            },
        };
    };
}

define('my-paginator', Paginator);

const paginator = new Paginator();
paginator.addEventListener('fetch', (event) => {
    event.respondWith(async () => {
        const response = await fetch('/posts');
        return await response.json();
    });
});
```

<aside class="note">

This is useful for events based communication with other components.

</aside>
