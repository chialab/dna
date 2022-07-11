DNA is a view library with first class support for reactive and functional Web Components. No polyfills are required: DNA uses its template engine to handle Custom Elements life cycle, resulting more efficient, reliable and light.

**Define the component (TypeScript)**

```tsx
import { Component, customElement, property, listen } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    // define an observed property
    @property() name = '';

    render() {
        return <>
            <input name="firstName" value={this.name} />
            <h1>Hello {this.name || 'World'}!</h1>
        </>;
    }

    // delegate an event
    @listen('change', 'input[name="firstName"]')
    private onChange(event: Event, target: HTMLInputElement) {
        this.name = target.value;
    }
}
```

**Define the component (JavaScript)**

```ts
import { Component, customElements, html, property, listen } from '@chialab/dna';

class HelloWorld extends Component {
    static get properties() {
        return {
            // define an observed property
            name: {
                type: String,
                defaultValue: '',
            },
        };
    }

    static get listeners() {
        return {
            // delegate an event
            'change input[name="firstName"]': function(event, target) {
                this.name = target.value;
            }
        };
    }

    render() {
        return html`
            <input name="firstName" value="${this.name}" />
            <h1>Hello ${this.name || 'World'}!</h1>
        `;
    }
}

customElements.define('hello-world', HelloWorld);
```

Then use the element in your HTML:

```html
<hello-world></hello-world>
```

## Features

### Web Components Design

DNA does not introduce any custom pattern for component definitions, since it is based on the standard Custom Elements specifications, so the life cycle is almost the same, with some helper methods.

### Fast and reliable

In order to be fast, predictive and easier to install, DNA uses a custom template engine. Components automatically re-render when the state change and only the necessary patches are applied to the DOM tree thanks to an in-place diffing algorithm.

### Tagged templates and JSX

If you are familiar with JSX, you can write your templates using the React syntax, but if you prefer to use standard JavaScript you can also use [template strings](./templates) to avoid the build step in your workflow.

### Properties, slots, Promises and Observables!

DNA comes with a lot of features in a very small package. You can use `<slot>` elements, observe properties changes and delegate events. It can also resolve `Promise`s and pipe `Observable`s directly in the template.

## Browsers support

Tests are run against all ever green browsers, Internet Explorer and old Safari versions. DNA itself does not require any polyfill and it is distribute as ES6 module (with untranspiled classes and `async`/`await` statements), but some Babel helpers if you want to use decorators need support for `Symbol`, `Object.assign` and `Array.prototype.find`. Also, a polyfill for `Promise`s is required in IE11 if you are using async methods.

![Browser compaitibility table](https://app.saucelabs.com/browser-matrix/chialab-sl-003.svg)

## Ok, I'm in!

Read the [Get started](./get-started) page or try out DNA in the [sandbox](https://stackblitz.com/edit/dna-3-sandbox?embed=1&file=index.ts&hideExplorer=1&hideNavigation=1)!
