# Get started

The recommended way to use DNA is to setup a project with Babel or TypeScript which has a lot of life saver features like modules, decorators and typechecking, but it also works untranspiled in the browser.

## Install

DNA is published to the NPM registry

::: code-group

```bash [npm]
npm install @chialab/dna@alpha
```

```bash [yarn]
yarn add @chialab/dna@alpha
```

```bash [pnpm]
pnpm add @chialab/dna@alpha
```

:::

## Configure Typescript

This enables support for DNA decorators as well as correct transpilation of class property fields.

::: code-group

```json [tsconfig.json]
{
    "compilerOptions": {
        "useDefineForClassFields": false,
        "experimentalDecorators": true
    }
}
```

:::

## Configure JSX

### Typescript

::: code-group

```json [tsconfig.json]
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@chialab/dna"
    }
}
```

:::

### Babel

::: code-group

```json [babel.config.json]
{
    "plugins": [
        [
            "@babel/plugin-transform-react-jsx",
            {
                "pragma": "h",
                "pragmaFrag": "Fragment"
            }
        ]
    ]
}
```

:::

## Define a component

DNA components are classes which extends the base `HTMLElement``.

Defining a component means to link a HTML tag with the element's constructor, as described by the Custom Elements specification.
In this example we are going to use the `customElement` decorator method to register the component in the DNA registry:

::: code-group

```tsx [TypeScript]
import { Component, customElement, property } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    @property() name: string = '';

    render() {
        return <h1>Hello {this.name || 'world'}!</h1>;
    }
}
```

```ts [JavaScript]
import { Component, define, html } from '@chialab/dna';

const HelloWorld = define(
    'hello-world',
    class HelloWorld extends Component {
        static get properties() {
            return {
                name: {
                    type: String,
                    defaultValue: '',
                },
            };
        }

        render() {
            return html`<h1>Hello ${this.name || 'world'}!</h1>`;
        }
    }
);
```

:::

### Extending native elements

Custom Element specification allows to define an element using the `is` attribute instead of the tag.  
This is very useful when you want to extend a HTML tag, preserving its semanthic meaning. For example:

::: code-group

```tsx [TypeScript]
import { customElement, HTML, property } from '@chialab/dna';

@customElement('alert-dialog', {
    extends: 'dialog',
})
class AlertDialog extends HTML.Dialog {
    @property() title: string = '';

    render() {
        return <h1>{this.title}</h1>;
    }
}
```

```ts [JavaScript]
import { define, HTML, html } from '@chialab/dna';

const AlertDialog = define(
    'alert-dialog',
    class AlertDialog extends HTML.Dialog {
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
    },
    {
        extends: 'dialog',
    }
);
```

:::

In the example above, a new instance of `AlertDialog` inherits all class methods and properties, but its `tagName` will be `DIALOG`.

::: info

Extending builtin elements also preserves accessibility and usability features: extending `HTMLButtonElement` will make the component reachable and clickable via keyboard navigation without setting `role` and `tabindex`.

:::

## Render a component

The `render` helper is used by DNA components to generate their templates, but it can be used to add a component or a template in a specific point of the DOM tree, for example to instantiate the root component of your application:

```tsx
import { Component, customElement, render } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    ...
}

render(<Card />, document.body);
```

During the render cycle, DNA execs an in-place DOM diffing to update already existing nodes and remove the unused ones, so you can safely re-render a template. At the end of the render cycle, DNA will remove any node outside the template, including elements and texts of the original HTML document.

This function accepts the template as first argument and an optional render root node as second one. You can also use bound tag name instead of constructor reference:

::: code-group

```tsx [main.tsx]
import { render } from '@chialab/dna';
import './Card';
import './Article';

render(
    <>
        <x-card />
        <article is="x-article" />
    </>,
    document.body
);
```

```tsx [Card.tsx]
import { Component, customElement } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    // ...
}
```

```tsx [Article.tsx]
import { Component, customElement } from '@chialab/dna';

@customElement('x-article', {
    extends: 'article',
})
class Article extends Component {
    // ...
}
```

:::
