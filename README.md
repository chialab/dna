<p align="center">
    <a href="https://chialab.github.io/dna/">
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

DNA makes it easy to create customized built-in elements that inherit HTML behavior, preserving usability and accessibility.

### Properties, states and attributes

With `@property` and `@state` decorators, DNA adds reactivity to class fields, syncing with attributes and triggering updates on change.

### Slots

DNA renders slotted content via a custom light DOM engine —no Shadow DOM— ensuring form compatibility and allowing `<slot>` inside built-in elements like `<button>`.

### Listeners and async events

Use the `@listen` decorator for delegated event handling, even for slotted content. Events can be async and dispatched from within the class.

## Get the library

Install via NPM:

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
