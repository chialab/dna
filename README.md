<p align="center">
    <a href="https://chialab.github.io/dna/">
        <img alt="DNA logo" width="144" height="144" src="https://raw.githack.com/chialab/dna/main/logo.svg" />
    </a>
</p>

<p align="center">
    <strong>DNA</strong> • Progressive Web Components
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@chialab/dna"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/dna/alpha.svg"></a>
</p>

## Features

DNA aims to unleash the true power of [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) through a declarative definition API, with builtin elements extension support and a simpler composition mechanism (yes, it does not use ShadowDOM).

### Customized built-in elements

DNA simplifies and encourages the use of customized built-in elements, which inherit methods and properties from standard HTML, preserving usability and accessibility features.

### Properties, states and attributes

DNA offers `@property` and `@state` decorators for adding reactivity to a component's class fields, ensuring that any changes are reflected in the component's template. These properties and states can be monitored, synchronized with attributes, and trigger change events.

### Listeners and async events

DNA uses event delegation for listening to events from a component's elements or slotted contents, offering the `@listen` decorator to streamline the process. Events can be asynchronous and dispatched from the component's class.

### Slots

DNA uses [**Quantum**](https://chialab.github.io/quantum/) instead of ShadowDOM to render slotted children, simplifying the usage of custom elements inside forms and providing a more flexible management of slotted contents. Unlike ShadowDOM, Quantum also works for built-in elements, allowing you to use <slot> even inside buttons.

## Get the library

Install via NPM:

```
npm i @chialab/dna@alpha
```

```
yarn add @chialab/dna@alpha
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
