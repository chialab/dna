<p align="center">
    <a href="https://www.chialab.io/p/dna">
        <img alt="DNA logo" width="144" height="144" src="https://raw.githack.com/chialab/dna/3.0.0/logo.svg" />
    </a>
</p>

<p align="center">
    <strong>DNA</strong> • Progressive Web Components
</p>

<p align="center">
    <a href="https://www.chialab.io/p/dna"><img alt="Documentation link" src="https://img.shields.io/badge/Docs-chialab.io-lightgrey.svg?style=flat-square"></a>
    <a href="https://github.com/chialab/dna"><img alt="Source link" src="https://img.shields.io/badge/Source-GitHub-lightgrey.svg?style=flat-square"></a>
    <a href="https://www.chialab.it"><img alt="Authors link" src="https://img.shields.io/badge/Authors-Chialab-lightgrey.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/@chialab/dna"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/dna.svg?style=flat-square"></a>
    <a href="https://github.com/chialab/dna/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@chialab/dna.svg?style=flat-square"></a>
</p>

---

DNA is a component library which aims to provide a temporarary interface to define declarative Web Components until browsers support is complete. Instead of requiring heavy polyfills in order to work in all browsers, DNA's philosophy is to use its template engine to handle Custom Elements life cycle and Shadow DOM flexibility, resulting more efficient, reliable and light.

### Design Web Components

DNA does not introduce any custom pattern for Component definitions, since it is based on the standard Custom Elements specifications, so the life cycle is almost the same, with some helper methods.

### Fast and reliable

In order to be fast, predictive and easier to install, DNA uses a custom template engine. Components automatically re-render when the state change and only the necessary patches are applied to the DOM tree thanks to an in-place diffing algorithm.

### Interpolation and JSX

If you are familiar with JSX, you can write your templates using the React syntax, but if you prefer to use standard JavaScript you can also use template strings to avoid the build step in your workflow.

### Properties, slots, Promises and Observables!

DNA comes with a lot of features in a very small package. You can use `<slot>` elements like in Shadow DOM contexts, observe properties changes and delegate events. It can also resolve `Promise`s and pipe `Observable`s directly in the template.

## Browsers support

Tests are run against all ever green browsers, Internet Explorer and old Safari versions. DNA itself does not require any polyfill and it is distribute as ES6 module (with untranspiled classes and `async`/`await` statements) and as UMD module (targeting ES5), but some Babel helpers if you want to use decorators need support for `Symbol`, `Object.assign` and `Array.prototype.find`. Also, a polyfill for `Promise` is required in IE11 if you are using async methods or the registry's `whenDefined` method.

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-003.svg)](https://app.saucelabs.com/u/chialab-sl-003)

## Get the library

Usage via [unpkg.com](https://unpkg.com/), as UMD package:
```html
<script src="https://unpkg.com/@chialab/dna" type="text/javascript"></script>
```

or as ES6 module:

```js
import { Component, customElements, html, ... } from 'https://unpkg.com/@chialab/dna?module';
```

Install via NPM:
```sh
$ npm i @chialab/dna
```

```ts
import { Component, customElements, html, ... } from '@chialab/dna';
```


## Define a Component

This is an example of Component defined via DNA. Please refer to the [documentation](https://www.chialab.io/p/dna) for more examples and cases of use.

**Define the Component**
```ts
import { Component, customElements, html, property } from '@chialab/dna';

class HelloWorld extends Component {
    static get observedAttributes() {
        return ['name'];
    }

    static get listeners() {
        return {
            // delegate an event
            'change input[name="firstName"]': function() {
                this.name = target.value;
            },
        };
    }

    // define an observable property
    @property() name = '';

    render() {
        return html`
            <input name="firstName" value="${this.name}" />
            <h1>Hello ${this.name || 'World'}!</h1>
        `;
    }
}

// link the Component class to a tag
customElements.define('hello-world', HelloWorld);
```

Then use the element in your HTML:

```html
<hello-world />
```

---

## Development

[![Build status](https://github.com/chialab/dna/workflows/Main/badge.svg)](https://github.com/chialab/dna/actions?query=workflow%3ABuild)
[![codecov](https://codecov.io/gh/chialab/dna/branch/3.0.0/graph/badge.svg)](https://codecov.io/gh/chialab/dna)


### Requirements

In order to build and test DNA, the following requirements are needed:
* [NodeJS](https://nodejs.org/) (>= 10.0.0)
* [Yarn](https://yarnpkg.com)
* [RNA](https://github.com/chialab/rna-cli) (>= 3.0.0)

### Build the project

Install the dependencies and run the `build` script:
```
$ yarn install
$ yarn build
```

This will generate the UMD and ESM bundles in the `dist` folder, as well as the declaration file.

### Test the project

Run the `test` script:

```
$ yarn test
```

---

## License

DNA is released under the [MIT](https://github.com/chialab/dna/blob/master/LICENSE) license.
