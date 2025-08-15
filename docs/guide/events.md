# Events

Since Web Components extend the native `HTMLElement`, events handling is completly delegated to the DOM implementation, so you can use `addEventListener` and `removeEventListener` to properly setup a callback.  
DNA add some extra features like declarative event listeners and delegations.

## Declarative listeners

You can declare event listeners on a component using the `listen` decorator or the `listeners` static accessor:

::: code-group

```ts [@listen]
import { customElement, HTML, listen } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
class Button extends HTML.Button {
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
import { define, HTML } from '@chialab/dna';

const Button = define(
    'x-button',
    class Button extends HTML.Button {
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
    class Tracker extends Component {
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

Listeners can be added via a template attribute named as the event with the `on` prefix for known element events, or with the `on:` prefix for delegating custom events.

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
                <nav on:close={this.onNavClick}>
                    <button onclick={(event) => event.target.dispatchEvent(new CustomEvent('close'))}>Close</button>
                </nav>
            </>
        );
    }
}
```

## Delegation

DNA supports event delegation for both imperatively and declaratively declarations. The listener callback will receive the original fired event as first argument and the matched target as second argument. Do not confuse the `event.target` property with the second argument of the listener: the first one is the node which actually fired the event, the second one is the node which matches the selector and it is in the event path (`event.target` may be a descending child of the matched one).

Using the `listen` decorator or the `listeners` static getter, you can specify the delegated child selector after the event name in the declaration key:

::: code-group

```ts [@listen]
import { customElement, HTML, listen } from '@chialab/dna';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends HTML.Dialog {
    @listen('click', 'nav button', { passive: false })
    onClick(event, target) {
        // ...
    }
}
```

```ts [get listeners]
import { define, HTML } from '@chialab/dna';

const Dialog = define(
    'x-dialog',
    class Dialog extends HTML.Dialog {
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
import { HTML, customElement } from '@chialab/idom';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends HTML.Dialog { ... }

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
import { HTML, customElement } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
class Button extends HTML.Button { ... }

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

## Custom events

When a component dispatches custom events, it’s helpful to include that information in the class’s type definitions. This offers two main benefits:

- you can define an `on<event name>` property—allowing developers to add event listeners the same way they do with native events (e.g., `onclick`), without using the `addEventListener` method.
- the typechecker will recognize that the event exists, improving the component's interoperability.

To achieve this, you can use the `@fires` decorator.

```ts
import { Component, customElement, fires, type EventHandler } from '@chialab/dna';

@customElement('x-paginator')
class Paginator extends Component {
    protected current = 1;

    @fires()
    onnext: EventHandler<CustomEvent<number>>;

    next() {
        this.dispatchEvent('next', this.current++);
    }
}
```

::: info

`@fires` may accept an optional `eventName` parameter, which will be used as the event name in the type definition. If not provided, it will default to the property name with the `on` prefix removed (e.g., `onnext` becomes `next`).

:::

### Retrieving the event type in listener

When a component event property is typed with `EventHandler`, the type of the event can be inferred from the property name using `EventType`.

```ts
import { Component, customElement, fires, type EventHandler, type EventType } from '@chialab/dna';

@customElement('x-paginator')
class Paginator extends Component {
    @fires()
    onnext: EventHandler<CustomEvent<number>>;
}

document.addEventListener('next', (event: EventType<Paginator, 'next'>) => {
    console.log(event.detail); // Type is inferred as CustomEvent<number>
});
```
