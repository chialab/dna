# DNA

Progressive Web Components

[![NPM](https://img.shields.io/npm/v/@chialab/dna.svg)](https://www.npmjs.com/package/@chialab/dna)

## Features

DNA aims to unleash the power of [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) through **declarative** API, **customized built-in elements** and a **shadow-free composition**.

### Customized built-in elements

DNA makes it easy to create customized built-in elements that inherit HTML behavior, preserving usability and accessibility.

### Properties, states and attributes

With `@property` and `@state` decorators, DNA adds reactivity to class fields, syncing with attributes and triggering updates on change.

### Slots

DNA renders slotted content via a custom light DOM engine —no Shadow DOM— ensuring form compatibility and allowing `<slot>` inside built-in elements like `<button>`.

### Listeners and async events

Use the `@listen` decorator for delegated event handling, even for slotted content. Events can be async and dispatched from within the class.

### Cross-framework compatibility

Built with standard Web Components APIs, DNA works with any framework. Plasma can generate wrappers for React, Vue, Svelte, and Angular.

### Storybook and documentation

The DNA tools ecosystem includes a Storybook preset for Web Components, which automatically generates documentation and controls for your components.

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

[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=REPLACE_WITH_BROWSERSTACK_BADGE_KEY)](https://automate.browserstack.com/public-build/REPLACE_WITH_BROWSERSTACK_BADGE_KEY)

This project is tested with BrowserStack.

Run the `test` script:

```
yarn test
```

Cross-browser tests run on real devices and browsers thanks to [BrowserStack](https://www.browserstack.com/). To run them locally:

```
yarn test:browserstack
```

---

## License

**DNA** is released under the [MIT](https://github.com/chialab/dna/blob/main/LICENSE) license.
