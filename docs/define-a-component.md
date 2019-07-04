# Define a Component

Defining a Component means to link a HTML tag with the element's constructor, as described by the Custom Elements specification.
In this example we are going to use the `define` method to register the Component in the DNA registry:

```ts
import { Component, define } from '@chialab/dna';

// create a Component class
class HelloWorld extends Component {
    get template() {
        return html`<h1>Hello!</h1>`;
    }
}

// link the HTML tag with the class
define('hello-world', HelloWorld);
```

## Extending native elements

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

// extend the article tag
define('blog-post', BlogPost, {
    extends: 'article'
});
```

In the example above, a new instance of `BlogPost` inherits all class methods and properties, but its `tagName` will be `ARTICLE`.

<aside class="tip">

It also preserve accessibility and usability features: extending the `BUTTON` element will make the component reachable and clickable via keyboard navigation.

</aside>
