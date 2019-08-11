# Samples

This is a collection of snippets and use cases for DNA 3.

## SSR with Node

First of all, install the DNA package from the NPM registry:

```sh
$ npm install @chialab/dna
```

Create a new JavaScript file, import the DNA module namespace and use the Node adapter.

<aside class="note">

Node does not know anything about the DOM. With the adapter, we are using [`jsdom`](https://github.com/jsdom/jsdom) to create a fake DOM environment.

</aside>

```js
// get the module namespace
const DNA = require('@chialab/dnajs');
// inject Node adapters for DOM
require('@chialab/dna/dist/adapters/node').adapter(DNA);
```

Now we are ready to define our component and to render it:

```js
const { Component, DOM, html, define, render } = DNA;

class HelloWorld extends Component {
    get template() {
        return html`<h1>Hello world!</h1>`;
    }
}

define('hello-world', HelloWorld);

const card = new HelloWorld();
render(DOM.document, card);
console.log(card.outerHTML);
// "<hello-world><h1>Hello world!</h1></hello-world>"
```

<aside class="tip">

The `card` reference in the example above is full DOM Node instance, so you can use any `Element.prototype` methods or update a property and get the re-render result with `.outerHTML`.

</aside>
