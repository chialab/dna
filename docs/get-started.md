# Get started

The recommended way to use DNA is to setup a project with Babel or TypeScript which has a lot of life saver features like modules, decorators and typechecking, but it also works untranspiled in the browser.

### Use a CDN

You can use DNA via CDN thanks to the [Unpkg](https://unpkg.com/):

```ts
import { Component, customElements } from 'https://unpkg.com/@chialab/dna?module';
```

### Setup a bundler

The DNA environment is pretty common (if you are familiar with other libraries like React, Angular, LitElement etc.):

1. Make sure you have a recent [Node.js](https://nodejs.org/en/) version installed
2. Setup a bundler ([Rollup](https://rollupjs.org) is recommended, but [Webpack](https://webpack.js.org/) and [Parcel](https://parceljs.org/) are equally good choices)
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

        If you want to use React JSX instead of template strings, you will also need to install the [`@babel/plugin-transform-react-jsx`](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx):

        **Classic**

        ```json
        {
            "plugins": [
                ["@babel/plugin-transform-react-jsx", {
                    "pragma": "h"
                }]
            ]
        }
        ```

        **Automatic**

        ```json
        {
            "plugins": [
                ["@babel/plugin-transform-react-jsx", {
                    "runtime": "automatic",
                    "importSource": "@chialab/dna"
                }]
            ]
        }
        ```
        
        Since the DNA `html` method is provided by the [`htm`](https://github.com/developit/htm) module by [Jason Miller](https://github.com/developit), you can also use the [`babel-plugin-htm`](https://www.npmjs.com/package/babel-plugin-htm) to preprocess templates. 

        ```json
        {
            "plugins": [
                ["babel-plugin-htm", {
                    "pragma": "h",
                    "import": {
                        "module": "@chialab/dna"
                    }
                }]
            ]
        }
        ```
4. Install DNA
    ```sh
    $ npm i @chialab/dna
    ```

## Define a component

DNA components are classes which extends the base HTMLElement with helpers for [templating](./templates), [styling](./styles), [events delegation](./events) and [life cycle](./life-cycle).

Defining a component means to link a HTML tag with the element's constructor, as described by the Custom Elements specification.
In this example we are going to use the `customElement` decorator method to register the component in the DNA registry:

```ts
import { Component, customElement, html, property } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    @property() name = '';

    // define a template
    render() {
        return html`<h1>Hello ${this.name || 'world'}!</h1>`;
    }
}
```

<details>
<summary>JavaScript</summary>
<div>

You can use the class decorator if you are using TypeScript or this Babel plugin, otherwise you have to fallback directly using `customElements.define`:

```ts
import { Component, customElements, html } from '@chialab/dna';

class HelloWorld extends Component {
    static get properties() {
        return {
            name: {
                type: String,
                defaultValue: '',
            },
        };
    }

    // define a template
    render() {
        return html`<h1>Hello ${this.name || 'world'}!</h1>`;
    }
}

customElements.define('hello-world', HelloWorld);
```

</div>
</details>

### Extending native elements

In the Custom Element specification it is possible to define an element using the `is` attribute instead of the tag (unfortunately, no browser vendor had implemented it at the moment).
This is very useful when you want to extend a HTML tag, preserving its semanthic meaning. An example:

```ts
import { Component, customElement, html, property } from '@chialab/dna';

@customElement('blog-post', {
    extends: 'article'
})
class BlogPost extends Component {
    @property() title = '';

    render() {
        return html`<h1>${this.title}</h1>`;
    }
}
```

<details>
<summary>JavaScript</summary>
<div>

```ts
import { Component, customElements, html } from '@chialab/dna';

class BlogPost extends Component {
    static get properties() {
        return {
            title: {
                type: String,
                defaultValue: '',
            },
        };
    }

    render() {
        return html`<h1>${this.title}</h1>`;
    }
}

customElements.define('blog-post', BlogPost, {
    extends: 'article'
});
```

</div>
</details>

In the example above, a new instance of `BlogPost` inherits all class methods and properties, but its `tagName` will be `ARTICLE`.

<aside class="note">

It also preserve accessibility and usability features: extending the `BUTTON` element will make the component reachable and clickable via keyboard navigation.

</aside>

## Render a component

The `render` helper is used by DNA components to generate their templates, but it can be used to add a component or a template in a specific point of the DOM tree, for example to instantiate the root component of your application:

```ts
import { Component, customElement, render, html } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    ...
}

render(html`<${Card} />`, document.body);
```

During the render cycle, DNA execs an in-place DOM diffing to update already existing nodes and remove the unused ones, so you can safely re-render a template.

<aside class="note">

Make sure to render the component in an empty root: at the end of the cycle, DNA will remove any node outside the template, including elements and texts of the original HTML document.

</aside>

This function accepts the render root node as first argument and a node or a template as second one. Another way to instantiate the `Card` component is:

```ts
import { Component, customElement, html, render } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    ...
}

render(html`<x-card />`, document.body);
```

It also work for extended native tags:

```ts
import { Component, customElement, html, render } from '@chialab/dna';

@customElement('x-article', {
    extends: 'article',
})
class Article extends Component {
    ...
}

render(html`<article is="x-article" />`, document.body);
```

You can use the `render` method to inject more complex templates too:

```ts
import { render, html } from '@chialab/dna';

render(html`<div class="wrapper">
    <h1>Title</h1>
</div>`, document.body);
```
