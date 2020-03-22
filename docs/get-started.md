# Get started

The recommended way to use DNA is to setup an ES7 project with Babel or TypeScript which has a lot of life saver features like modules, decorators and typechecking, but it can also work without transpilers and bundlers directly in the browser.

### Use a CDN

You can use DNA via CDN thanks to the [Unpkg](https://unpkg.com/) project, which exposes a global `DNA` namespace if fetched via script tag, or the ES module with `?module` param:

```html
<script src="https://unpkg.com/@chialab/dna"></script>
```

```ts
import { Component, define } from 'https://unpkg.com/@chialab/dna?module';
```

### Setup a bundler

The DNA environment is pretty simple and common (if you are familiar with other libraries like React, Angular, LitElement etc.):

1. Make sure you have a recent [Node.js](https://nodejs.org/en/) version installed
2. Setup a bundler ([Rollup](https://rollupjs.org) is recommended, but [Webpack](https://webpack.js.org/) and [Parcel](https://parceljs.org/) are just as good choices)
3. Setup Babel ([Rollup](https://github.com/rollup/rollup-plugin-babel), [Webpack](https://github.com/babel/babel-loader), [Parcel](https://parceljs.org/transforms.html#babel)) or TypeScript ([Rollup](https://github.com/rollup/rollup-plugin-typescript), [Webpack](https://webpack.js.org/guides/typescript/), [Parcel](https://parceljs.org/transforms.html#typescript)):
    * if your choice is Babel, please make sure all this plugins are loaded in order to use all DNA features:
        ```sh
        $ npm i -D \
            @babel/plugin-proposal-decorators \
            @babel/plugin-proposal-class-properties
        ```

        **.babelrc**

        ```json
        {
            "plugins": [
                "@babel/plugin-proposal-decorators",
                "@babel/plugin-proposal-class-properties"
            ]
        }
        ```

        If you want to use React JSX instead of template strings, you will also need to install the [`@babel/plugin-transform-react-jsx`](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx) configuring `h` as pragma.
        
        Since the DNA `html` method is provided by the [`htm`](https://github.com/developit/htm) module by [Jason Miller](https://github.com/developit), you can also use the [`babel-plugin-htm`](https://www.npmjs.com/package/babel-plugin-htm) to preprocess templates. 
4. Install DNA
    ```sh
    $ npm i @chialab/dna
    ```

## Define a component

DNA components are classes which extends the base HTMLElement with helpers for [templating](./templates), [styling](./styles), [events delegation](./events) and [life cycle](./life-cycle).

Defining a component means to link a HTML tag with the element's constructor, as described by the Custom Elements specification.
In this example we are going to use the `define` method to register the component in the DNA registry:

```ts
import { Component, define, html } from '@chialab/dna';

// create a component class
class HelloWorld extends Component {
    // define a template
    render() {
        return html`<h1>Hello world!</h1>`;
    }
}

// link the HTML tag with the class
define('hello-world', HelloWorld);
```

### Extending native elements

In the Custom Element specification it is possible to define an element using the `is` attribute instead of the tag (unfortunately, no browser vendor had implemented it at the moment).
This is very useful when you want to extend a HTML tag, preserving its semanthic meaning. An example:

```ts
import { Component, define, html, property } from '@chialab/dna';

class BlogPost extends Component {
    static get observedAttributes() {
        return ['title'];
    }

    @property()
    title = '';

    render() {
        return html`<h1>${this.title}</h1>`;
    }
}

// extend the article tag
define('blog-post', BlogPost, {
    extends: 'article'
});
```

In the example above, a new instance of `BlogPost` inherits all class methods and properties, but its `tagName` will be `ARTICLE`.

<aside class="note">

It also preserve accessibility and usability features: extending the `BUTTON` element will make the component reachable and clickable via keyboard navigation.

</aside>

## Render a component

The `render` helper is used by DNA components to generate their templates, but it can be used to add a component or a template in a specific point of the DOM tree, for example to instantiate the root component of your application:

```ts
import { Component, define, render } from '@chialab/dna';

class Card extends Component {
    ...
}

define('x-card', Card);

render(document.body, new Card());
```

During the render cycle, DNA execs an in-place DOM diffing to update already existing nodes and remove the unused ones, so you can safely re-render a template.

<aside class="note">

Make sure to render the component in an empty root: at the end of the cycle, DNA will remove any node outside the template, including elements and texts of the original HTML document.

</aside>

This function accepts the render root node as first argument and a node or a template as second one. Another way to instantiate the `Card` component is:

```ts
import { Component, define, html, render } from '@chialab/dna';

class Card extends Component {
    ...
}

define('x-card', Card);

render(document.body, html`<x-card />`);
```

It also work for extended native tags:

```ts
import { Component, define, html, render } from '@chialab/dna';

class Article extends Component {
    ...
}

define('x-article', Article, { extends: 'article' });

render(document.body, html`<article is="x-article" />`);
```

You can use the `render` method to inject more complex templates too:

```ts
import { render, html } from '@chialab/dna';

render(document.body, html`<div class="wrapper">
    <h1>Title</h1>
</div>`);
```