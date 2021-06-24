# Events

Since Web Components extend the native `HTMLElement`, events handling is completly delegated to the DOM implementation, so you can use `addEventListener` and `removeEventListener` to properly setup a callback. DNA add some extra features like declarative event listeners and delegations.

## Declarative event listeners

You can declare event listeners on a component using the `listen` decorator or the `listeners` static accessor:

```ts
import { Component, customElement, listen } from '@chialab/dna';

@customElement('x-button, {
    extends: 'button',
})
class Button extends Component {
    @listen('click')
    onClick(event) {
        event.preventDefault();
    }

    @listen('input', '[name="age"]')
    onInputAge(event, target) {
        console.log(target.value);
    }
}
```

Event declaration accepts a function (in the example above, a prototype method has been referenced) or an object for listener configuration:

```ts
import { Component, customElement, listen } from '@chialab/dna';

@customElement('x-tracker)
class Tracker extends Component {
    static get listeners(){
        return {
            touchmove: {
                callback: function(event) {}
                passive: true,
            },
        };
    }

    @listen('touchmove', { passive: true })
    onTouchMove() {
        // ...
    }
}
```

<aside class="note">

Please refer to the [addEventListener](https://developer.mozilla.org/it/docs/Web/API/Element/addEventListener) documentation for a complete list of listener options.

</aside>

## Template listeners

Listeners can be added via a template attribute named as the event with the `on` prefix:

```ts
import { Component, customElement, html } from '@chialab/dna';

@customElement('x-header', {
    extends: 'header',
})
class Header extends Component {
    render() {
        return html`
            <h2>${this.title}</h2>
            <nav>
                <button onclick=${this.onNavClick}>Close</button>
            </nav>
        `;
    }
}
```

## Delegation

DNA supports event delegation for both imperatively and declaratively declarations. The listener callback will receive the original fired event as first argument and the matched target as second argument.

<aside class="note">

Do not confuse the `event.target` property with the second argument of the listener: the first one is the node which actually fired the event, the second one is the node which matches the selector and it is in the event path (`event.target` may be a descending child of the matched one).

</aside>

Using the `listen` decorator or the `listeners` static getter, you can specify the delegated child selector after the event name in the declaration key:

```ts
import { Component, customElement, listen } from '@chialab/dna';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends Component {
    static get listeners() {
        return {
            // event name + selector
            'click nav button': {
                callback(event, target) {},
                passive: false,
            },
        };
    };

    @listen('click', 'nav button', { passive: false })
    onClick() {}
}
```

Otherwise, you can use `addEventListener`, `removeEventListener`, `delegateEventListener` and `undelegateEventListener` methods:

```ts
import { Component, customElement, DOM } from '@chialab/idom';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends Component { ... }

const element = new Dialog();
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
import { Component, customElement, DOM } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
class Button extends Component { ... }

const button = new Button();
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
import { Component, customElement, listen, DOM } from '@chialab/dna';

@customElement('x-paginator')
class Paginator extends Component {
    @listen('click', 'button.next')
    async onClick() {
        this.data = await this.dispatchAsyncEvent('fetch');
    }
}

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
