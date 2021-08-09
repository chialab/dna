# Use in Node.js

DNA is a component library based on the [Document Object Model](https://developer.mozilla.org/docs/Web/API/Document_Object_Model). In order to work in Node.js it uses the [`jsdom`](https://github.com/jsdom/jsdom) library to create a DOM environment.

```sh
$ npm i @chialab/dna jsdom
$ yarn add @chialab/dna jsdom
```

**Sample:**

```ts
import { Component, customElements, html, render } from '@chialab/dna';

class HelloWorld extends Component {
    render() {
        return html`<h1>Hello world!</h1>`;
    }
}

customElements.define('hello-world', HelloWorld);

const card = render(html`<${HelloWorld} />`);

console.log(card.outerHTML);
// -> "<hello-world><h1>Hello world!</h1></hello-world>"
```

The `card` reference in the example above is a Node instance, so you can use any `HTMLElement.prototype` methods or update a property and get the re-render result with `.outerHTML`.
