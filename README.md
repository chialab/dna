[![Logo](docs/logo.png)](http://dna.chialab.io)

Just another components pattern.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.com)

[![Travis](https://img.shields.io/travis/Chialab/dna.svg?maxAge=2592000)](https://travis-ci.org/Chialab/dna)
[![Code coverage](https://codecov.io/gh/Chialab/dna/branch/next/graph/badge.svg)](https://codecov.io/gh/Chialab/dna/branch/next)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-012.svg)](https://saucelabs.com/u/chialab-sl-012)

\* *tests executed using dna-idom implementations*

## Install

[![NPM](https://img.shields.io/npm/v/dna-components.svg)](https://www.npmjs.com/package/dna-components)
```
$ npm i dna-components --save
```
[![Bower](https://img.shields.io/bower/v/dna-components.svg)](https://github.com/chialab/dna)
```
$ bower i dna-components --save
```

## Usage

**Use with Custom Elements v1** 🚀

DNA is built on the top of [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs, so it is 100% compatible with the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) interface. Simply define the component and register it using `customElements.define`:
```js
import DNA from './dna.js';

class MyElem extends DNA.BaseComponent {
    // ...
}

customElements.define('my-elem', MyElem);
```

see also:
* [tutorial](./tutorials/interop/custom-elements-v1.md)
* [native support](http://caniuse.com/#feat=custom-elementsv1)
* [polyfill](https://github.com/webcomponents/custom-elements/)

---

**Use with Incremental DOM** 🌟

DNA's TemplateMixin uses [Skin templates](https://github.com/chialab/skin-template), which implements [Google IncrementalDOM](https://github.com/google/incremental-dom). Using IDOM callbacks, DNA can replicate [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs (similar to the React way):

```js
import DNA from './dna-idom.js';

class MyChild extends DNA.BaseComponent {
    // ...
}

class MyElem extends DNA.BaseComponent {
    get template() {
        return '<my-child></my-child>';
    }
}

// define
DNA.define('my-child', MyChild);
DNA.define('my-elem', MyElem);

// bootstrap
DNA.render(document.body, MyElem);
```

see also:
* [tutorial](./tutorials/interop/incremental-dom.md)

---

**Use with:**

React (coming soon...)

[MutationObserver](./tutorials/interop/mutation-observer.md)

---
