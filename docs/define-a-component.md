# Define a Component

Defining a Component means to link a HTML tag with the element's constructor, as described by the Custom Elements specification.
In this example we are going to use the `define` method to register the Component in the DNA registry, in order to use it via the `render`:

```ts
import { Component, define, render, html } from '@chialab/dna';

// create a Component class
class HelloWorld extends Component {
    get template() {
        return html`<h1>Hello!</h1>`;
    }
}

// link the HTML tag with the class
define('hello-world', HelloWorld);

// render the element via the HTML tag
render(document.body, html`<hello-world />`);
// or render the element via class initialization
render(document.body, new HelloWorld());
```

In the Custom Element specification it is possible to define an element using the `is` attribute instead of the tag (unfortunately, no browser vendor had implemented it at the moment). This is very useful when you want to extend a HTML tag, preserving its semanthic meaning. An example:

```ts
import { Component, define, render } from '@chialab/dna';

class BlogPost extends Component {
    get template() {
        return html`<h1>[[ title ]]</h1>`;
    }

    @property
    title: null;
}

define('blog-post', BlogPost, {
    extends: 'article'
});

// render the element via the HTML tag
render(document.body, html`<article is="blog-post" title="My first blog post" />`);
```
