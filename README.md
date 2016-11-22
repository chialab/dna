[![Logo](docs/logo.png)](http://dna.chialab.io)

Just another components pattern.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.com)

[![Travis](https://img.shields.io/travis/Chialab/dna.svg?maxAge=2592000)](https://travis-ci.org/Chialab/dna)
[![Code coverage](https://codecov.io/gh/Chialab/dna/branch/next/graph/badge.svg)](https://codecov.io/gh/Chialab/dna/branch/next)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-012.svg)](https://saucelabs.com/u/chialab-sl-012)

## Usage

### Use with Custom Elements v1 🚀

DNA is built on the top of [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs, so it is 100% compatible with the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) interface. Simply define the component and register it using `customElements.define`:
```js
import { BaseComponent } from '@dnajs/custom-elements-v1';

class MyElem extends BaseComponent {
    // ...
}

customElements.define('my-elem', MyElem);
```

[package](./packages/dna-custom-elements-v1/) |
[tutorial](./tutorials/interop/custom-elements-v1.md) |
[native support](http://caniuse.com/#feat=custom-elementsv1) |
[polyfill](https://github.com/webcomponents/custom-elements/)


### Use with Incremental DOM 🌟

Using [Google IncrementalDOM](https://github.com/google/incremental-dom) callbacks, DNA can replicate [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs (similar to the React way):

```js
import { BaseComponent, IDOM, define, render } from '@dnajs/idom';

class MyChild extends BaseComponent {
    // ...
}

class MyElem extends BaseComponent {
    get template() {
        return () => {
            IDOM.elementOpen('my-child');
            IDOM.elementClose('my-child');
        }
    }
}

// define
define('my-child', MyChild);
define('my-elem', MyElem);

// bootstrap
render(document.body, MyElem);
```

[package](./packages/dna-idom/) |
[tutorial](./tutorials/interop/idom.md)

### Others

**Use with Custom Elements v0 spec.**

[package](./packages/dna-custom-elements-v0/)

**Use with React.**

[package](./packages/dna-react/)

**Use with MutationObserver API.**

[package](./packages/dna-mutation/) |
[tutorial](./tutorials/interop/mutation-observer.md)
