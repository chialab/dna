[![Logo](https://cdn.rawgit.com/Chialab/dna/next/logo.svg)](http://dna.chialab.io)

Just another components pattern.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.com)

[![Travis](https://img.shields.io/travis/Chialab/dna.svg?maxAge=2592000)](https://travis-ci.org/Chialab/dna)
[![Code coverage](https://codecov.io/gh/Chialab/dna/branch/next/graph/badge.svg)](https://codecov.io/gh/Chialab/dna/branch/next)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-012.svg)](https://saucelabs.com/u/chialab-sl-012)

## Principles

### 🚀 Standards first
Components are built using the same syntax of W3C Custom Elements specifications.

### 🍔 Modular system
Thanks to ES2015 classes and a [smart mixins implementation](https://github.com/justinfagnani/mixwith.js), it is easy to combine features and reuse code.

### 🍻 Interoperability
Moving away DOM strategies and focusing on the pattern, components can work with different implementations like Custom Elements, React, Incremental DOM and, ideally, any other javascript library.

## Usage

### Use with [Custom Elements v1](./packages/dna-custom-elements-v1/)

DNA is built on the top of [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs, so it is 100% compatible with the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) interface. Simply define the component and register it using `customElements.define`:
```js
import { BaseComponent } from '@dnajs/custom-elements-v1';

class MyElem extends BaseComponent {
    // ...
}

customElements.define('my-elem', MyElem);
```

### Use with [Incremental DOM](./packages/dna-idom/)

Using [Google IncrementalDOM](https://github.com/google/incremental-dom) notifications, DNA can replicate [Custom Elements v1](https://www.w3.org/TR/custom-elements/) callbacks without any polyfill:

```js
import '@dnajs/idom/observer.js';
import { BaseComponent, IDOM, define, render } from '@dnajs/idom';

class MyChild extends BaseComponent {
    // ...
}

class MyElem extends BaseComponent {
    get template() {
        // Using IDOM.h helper
        // return IDOM.h('my-child');
        // or JSX
        return <my-child />;
    }
}

// define
define('my-child', MyChild);
define('my-elem', MyElem);

// bootstrap
render(document.body, MyElem);
```

**Use with [Custom Elements v0 spec](./packages/dna-custom-elements-v0/).**

**Use with [React](./packages/dna-react/).**

**Use with [MutationObserver API](./packages/dna-mutation/).**
