# Events

Since Web Components extend the native `HTMLElement`, events handling is completly delegated to the DOM implementation, so you can use `addEventListener` and `removeEventListener` to properly setup a callback.  
DNA add some extra features like declarative event listeners and delegations.

## Declarative listeners

You can declare event listeners on a component using the `listen` decorator or the `listeners` static accessor:

::: code-group

```ts [@listen]
import { builtin, customElement, listen } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
class Button extends builtin.HTMLButtonElement {
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

```ts [get listeners]
import { builtin, define } from '@chialab/dna';

const Button = define(
    'x-button',
    class extends builtin.HTMLButtonElement {
        static get listeners() {
            return {
                'click': function (event) {
                    event.preventDefault();
                },
                'input [name="age"]': function (event, target) {
                    console.log(target.value);
                },
            };
        }
    },
    {
        extends: 'button',
    }
);
```

:::

Declarations can be configured with [event listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener):

::: code-group

```ts [@listen]
import { Component, customElement, listen } from '@chialab/dna';

@customElement('x-tracker')
class Tracker extends Component {
    @listen('touchmove', { passive: true })
    onTouchMove() {
        // ...
    }
}
```

```ts [get listeners]
import { Component, define } from '@chialab/dna';

const Tracker = define(
    'x-tracker',
    class extends Component {
        static get listeners() {
            return {
                touchmove: {
                    callback(event) {
                        // ...
                    },
                    passive: true,
                },
            };
        }
    }
);
```

:::

## Template listeners

Listeners can be added via a template attribute named as the event with the `on` prefix:

```tsx
import { Component, customElement } from '@chialab/dna';

@customElement('x-header', {
    extends: 'header',
})
class Header extends Component {
    render() {
        return (
            <>
                <h2>{this.title}</h2>
                <nav>
                    <button onclick={this.onNavClick}>Close</button>
                </nav>
            </>
        );
    }
}
```

## Target

Event listeners are automatically bound with the component. If you need a different target, such as the document or the window, you can pass the target to the declaration. In this case, event listeners are added once the element has been added to the DOM tree and removed once disconnected.

::: code-group

```ts [@listen]
import { Component, customElement, listen } from '@chialab/dna';

@customElement('x-tracker')
class Tracker extends Component {
    @listen('touchmove', window, { passive: true })
    onTouchMove() {
        // ...
    }
}
```

```ts [get listeners]
import { Component, define } from '@chialab/dna';

const Tracker = define(
    'x-tracker',
    class extends Component {
        static get listeners() {
            return {
                touchmove: {
                    callback(event) {
                        // ...
                    },
                    target: window,
                    passive: true,
                },
            };
        }
    }
);
```

:::

## Delegation

DNA supports event delegation for both imperatively and declaratively declarations. The listener callback will receive the original fired event as first argument and the matched target as second argument. Do not confuse the `event.target` property with the second argument of the listener: the first one is the node which actually fired the event, the second one is the node which matches the selector and it is in the event path (`event.target` may be a descending child of the matched one).

Using the `listen` decorator or the `listeners` static getter, you can specify the delegated child selector after the event name in the declaration key:

::: code-group

```ts [@listen]
import { builtin, customElement, listen } from '@chialab/dna';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends builtin.HTMLDialogElement {
    @listen('click', 'nav button', { passive: false })
    onClick(event, target) {
        // ...
    }
}
```

```ts [get listeners]
import { builtin, define } from '@chialab/dna';

const Dialog = define(
    'x-dialog',
    class extends builtin.HTMLDialogElement {
        static get listeners() {
            return {
                'click nav button': {
                    callback(event, target) {
                        // ...
                    },
                    passive: false,
                },
            };
        }
    },
    {
        extends: 'dialog',
    }
);
```

:::

You can also use `delegateEventListener` and `undelegateEventListener` methods:

```ts
import { builtin, customElement } from '@chialab/idom';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends builtin.HTMLDialogElement { ... }

const element = new Dialog();
const closeDialog = (event, target) => { ... };
document.body.appendChild(element);
// delegate listener
element.delegateEventListener('click', 'nav button', closeDialog, { passive: false });
// undelegate listener
element.undelegateEventListener('click', 'nav button', closeDialog);
```

### Dispatching events

DNA components overrides the `dispatchEvent` method in order to support an alternative signature for easier [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) creation:

```ts
import { builtin, customElement } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
class Button extends builtin.HTMLButtonElement { ... }

const button = new Button();
document.body.appendChild(element);
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

With DNA, you can also dispatch events and await a `Promise` which resolves when all async listeners are completed. This is useful for events based communication with other components:

```ts
import { Component, customElement, listen } from '@chialab/dna';

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