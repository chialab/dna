DNA is a component library which aims to provide a temporarary interface to define declarative Web Components until browsers support is complete. Instead of requiring heavy polyfills in order to work in all browsers, DNA's philosophy is to use its template engine to handle Custom Elements life cycle and Shadow DOM flexibility, resulting more efficient, reliable and light.

```ts
import { Component, customElements, html, property, render } from '@chialab/dna';

class HelloWorld extends Component {
    static get observedAttributes() {
        return ['name'];
    }

    // define an observable property
    @property() name = '';

    render() {
        return html`
            <input name="firstName" value="${this.name}" />
            <h1>Hello ${this.name || 'World'}!</h1>
        `;
    }
}

// link the component class to a tag
customElements.define('hello-world', HelloWorld);

// render the component
render(document.body, new HelloWorld);
```

Then use the element in your HTML:

```html
<hello-world />
```

## Features

### Web Components Design

DNA does not introduce any custom pattern for component definitions, since it is based on the standard Custom Elements specifications, so the life cycle is almost the same, with some helper methods.

### Fast and reliable

In order to be fast, predictive and easier to install, DNA uses a custom template engine. Components automatically re-render when the state change and only the necessary patches are applied to the DOM tree thanks to an in-place diffing algorithm.

### Template string and JSX

If you are familiar with JSX, you can write your templates using the React syntax, but if you prefer to use standard JavaScript you can also use [template strings](./templates) to avoid the build step in your workflow.

### Properties, slots, Promises and Observables!

DNA comes with a lot of features in a very small package. You can use `<slot>` elements like in Shadow DOM contexts, observe properties changes and delegate events. It can also resolve `Promise`s and pipe `Observable`s directly in the template.

## Browsers support

Tests are run against all ever green browsers, Internet Explorer and old Safari versions. DNA itself does not require any polyfill and it is distribute as ES6 module (with untranspiled classes and `async`/`await` statements) and as UMD module (targeting ES5), but some Babel helpers if you want to use decorators need support for `Symbol`, `Object.assign` and `Array.prototype.find`. Also, a polyfill for `Promise`s is required in IE11 if you are using async methods.

![Browser compaitibility table](https://app.saucelabs.com/browser-matrix/chialab-sl-003.svg)

## Ok, I'm in!

Read the [Get started](./get-started) page or try out DNA in the [sandbox](https://stackblitz.com/edit/dna-3-sandbox?embed=1&file=index.ts&hideExplorer=1&hideNavigation=1)!
