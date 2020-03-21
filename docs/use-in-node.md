# Use in Node.js

DNA is a component library based on DOM, but it is abstract enough to work in other environments or with different configurations. The Node.js adapter is distribuited along with the core library and it uses [`jsdom`](https://github.com/jsdom/jsdom) to create a fake DOM environment.

```sh
$ npm i @chialab/dna jsdom
```

**Sample:**

```js
// get the module namespace
const { Component, DOM, html, define, render } = require('@chialab/dna/node');

class HelloWorld extends Component {
    render() {
        return html`<h1>Hello world!</h1>`;
    }
}

define('hello-world', HelloWorld);

const card = render(DOM.document, new HelloWorld());

console.log(card.outerHTML);
// -> "<hello-world><h1>Hello world!</h1></hello-world>"
```

<aside class="note">

The `card` reference in the example above is full (js)DOM Node instance, so you can use any `HTMLElement.prototype` methods or update a property and get the re-render result with `.outerHTML`.

</aside>
