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

For example, you may want to add an `icon` property support to a native `<button>` element, to display an icon before the button text. This is not possible with Shadow DOM, because you cannot create a custom `<button>` element with Shadow DOM, because the specification doesn't allow it. On other hand, if you define a `<custom-button>` you will loose all the semantics and behaviors of a native button, such as being focusable, submittable, and so on.
With DNA you can extend the native button element, preserving all its semantics and behaviors, and adding the icon support thanks to its rendering system.

```tsx
import { customElement, HTML, property } from '@chialab/dna';

@customElement('x-button', {
    extends: 'button',
})
class XButton extends HTML.Button {
    @property() icon?: string;

    render() {
        return (
            <>
                {this.icon && <img src={this.icon} alt="" />}
                <slot />
            </>
        );
    }
}
```

### When to consider alternatives

Although the DNA rendering system can be used to create Single Page Applications, we do not recommend using the library for building apps. Many frameworks, such as SvelteKit, Next.js, or Solid, are much better suited for structuring a Web Application, as they support Server-Side Rendering and automatically optimize application routes.

Use DNA only to create libraries of custom elements to distribute and re-use in your applications.
