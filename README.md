<p align="center">
    <a href="https://www.chialab.io/p/dna">
        <img alt="DNA logo" width="144" height="144" src="https://raw.githack.com/chialab/dna/main/logo.svg" />
    </a>
</p>

<p align="center">
    <strong>DNA</strong> • Progressive Web Components
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@chialab/dna"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/dna.svg"></a>
</p>

## Features

DNA aims to unleash the true power of [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) through a declarative definition API, with builtin elements extension support and a simpler composition mechanism (yes, it does not use ShadowDOM).

### Customized built-in elements

DNA simplifies and promotes the usage of customized built-in elements. Customized built-in elements inherit methods and properties from standard HTML, preserving usability and accessibility features.

### Properties, states and attributes

DNA provides `@property` and `@state` decorators to add reactivity to component's class fields. Every change is reflected to the component's template. Properties and states can be watched, synced with attributes and dispatch changes as events.

### Listeners and async events

DNA uses event delegation to listen events from component's elements or slotted contents. It also provides a `@listen` decorator to simplify the event delegation process. Events can be async and can be dispatched from the component's class.

### Slots

DNA does not use ShadowDOM to render slotted children, but a custom implementation named [**Quantum**](https://chialab.github.io/quantum/). This simplifies the usage of custom elements inside forms and provides a more flexible management of slotted contents. In fact, you can iterate, wrap, map or alter slotted elements. And differently from ShadowDOM, it also works for builtin elements, so you can use `<slot>` even inside buttons.

## Get the library

Usage via [unpkg.com](https://unpkg.com/) as ES6 module:

```js
import { Component, define, html, ... } from 'https://unpkg.com/@chialab/dna?module';
```

Or install via NPM:

```
npm i @chialab/dna
```

```
yarn add @chialab/dna
```

## Define a Component

```tsx
import { Component, customElement, listen, property } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    // define an observed property
    @property() name: string = '';

    render() {
        return (
            <>
                <input
                    name="firstName"
                    value={this.name}
                />
                <h1>Hello {this.name || 'World'}!</h1>
            </>
        );
    }

    // delegate an event
    @listen('change', 'input[name="firstName"]')
    private onChange(event: Event, target: HTMLInputElement) {
        this.name = target.value;
    }
}
```

Then use the element in your HTML:

```html
<hello-world></hello-world>
```

## Development

[![Build status](https://github.com/chialab/dna/workflows/Main/badge.svg)](https://github.com/chialab/dna/actions?query=workflow%3AMain)
[![codecov](https://codecov.io/gh/chialab/dna/branch/main/graph/badge.svg)](https://codecov.io/gh/chialab/dna)

### Build the project

Install the dependencies and run the `build` script:

```
yarn install
```

```
yarn build
```

This will generate the bundles in the `dist` folder, as well as the declaration files.

### Test the project

Run the `test` script:

```
yarn test
```

---

## License

**DNA** is released under the [MIT](https://github.com/chialab/dna/blob/main/LICENSE) license.
