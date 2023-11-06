DNA aims to unleash the true power of [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) through a declarative definition API, with builtin elements extension support and a simpler composition mechanism (yes, it does not use ShadowDOM).

```tsx
import { Component, customElement, listen, property } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    // define an observed property
    @property() name: string = '';

    render() {
        return (
            <>
                <input
                    name="firstName"
                    value={this.name}
                />
                <h1>Hello {this.name || 'World'}!</h1>
            </>
        );
    }

    // delegate an event
    @listen('change', 'input[name="firstName"]')
    private onChange(event: Event, target: HTMLInputElement) {
        this.name = target.value;
    }
}
```

Then use the element in your HTML:

```html
<hello-world></hello-world>
```

## Features

### Customized built-in elements

DNA simplifies and promotes the usage of customized built-in elements. Customized built-in elements inherit methods and properties from standard HTML, preserving usability and accessibility features / [more ➪](./get-started#extending-native-elements)

### Properties, states and attributes

DNA provides `@property` and `@state` decorators to add reactivity to component's class fields. Every change is reflected to the component's template. Properties and states can be watched, synced with attributes and dispatch changes as events / [more ➪](./properties)

### Listeners and async events

DNA uses event delegation to listen events from component's elements or slotted contents. It also provides a `@listen` decorator to simplify the event delegation process. Events can be async and can be dispatched from the component's class / [more ➪](./events)

### Slots

DNA does not use ShadowDOM to render slotted children, but a custom implementation named **Quantum**. This simplifies the usage of custom elements inside forms and provides a more flexible management of slotted contents. In fact, you can iterate, wrap, map or alter slotted elements. And differently from ShadowDOM, it also works for builtin elements, so you can use `<slot>` even inside buttons / [more ➪](./templates#slotted-children)

## Ok, I'm in!

Read the [Get started](./get-started) page or try out DNA in the [sandbox](https://stackblitz.com/edit/dna-sandbox?embed=1&file=HelloWorld.ts&hideExplorer=1&hideNavigation=1)!
