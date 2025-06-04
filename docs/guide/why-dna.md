# Why DNA

DNA is a library built to create Web Components in a **declarative and extensible** way through the use of JavaScript classes.

Unlike other libraries, it allows extending other Web Components and even native HTML elements, such as `<input>`, `<button>`, and so on.

```tsx
import { customElement, HTML, listen } from '@chialab/dna';

@customElement('x-input')
class XInput extends HTML.Input {
    @listen('change')
    customValidationOnChange() {
        if (this.value === 'DNA') {
            this.setCustomValidity('Great!');
        } else {
            this.setCustomValidity('');
        }
    }
}
```

Another unique feature of DNA is the use of a custom rendering engine to slot the content of a Web Component without using the Shadow DOM.

```tsx
import { customElement, Component, render } from '@chialab/dna';

@customElement('x-card')
class XCard extends Component {
    render() {
        return <article>
            <header>
                <slot name="title" />
            </header>
            <section>
                <slot />
            </section>
        <article>;
    }
}

render(
    <x-card>
        <h1 slot="title">Hello World</h1>
        <p>This is a custom card component.</p>
    </x-card>
);
```

### About the choice of not to use the Shadow DOM

Shadow DOM is great for a great number of scenarios, but it lacks of some features that are required to create custom elements with specific semantic, accessibility and styling purposes:

-   doesn't work for most of the builtin elements
-   heavy style encapsulation (class utilities must be imported in each shadow root)
-   cannot decorate nor wrap slotted children
-   sometimes causes headaches when working with forms, accessibility tree, DOM traversing and events handling

:::info
Please note that some of the points above are not issues with the technology, indeed they are extremely useful for different uses cases.
:::
