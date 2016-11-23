[![Logo](https://cdn.rawgit.com/Chialab/dna/next/logo.svg)](http://dna.chialab.io)

Just another components pattern.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.com)

## Install

[![NPM](https://img.shields.io/npm/v/@dnajs/mutation.svg)](https://www.npmjs.com/package/@dnajs/mutation)
```
$ npm i @dnajs/mutation --save
```

## Usage

This version of the library provides a lite polyfill for [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs using [MutationObserver API](https://developer.mozilla.org/it/docs/Web/API/MutationObserver) and without using the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) for element definition:

```js
import '@dnajs/mutation/observer.js';
import { prop, BaseComponent } from '@dnajs/core';

class MyElem extends BaseComponent {
    static get observedAttributes() {
        return ['message']
    }
    get properties() {
        return {
            helloMessage: prop.STRING.attribute('message'),
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.helloMessage = 'Hi!';
    }
}

customElements.define('my-elem', MyElem);

// RENDER
document.body.appendChild(new MyElem());
```
```html
<!-- result -->
<body>
    <my-elem message="Hi!"></my-elem>
</body>
```

More:
* [native support](http://caniuse.com/#feat=mutationobserver)
* [polyfill](https://github.com/webcomponents/webcomponentsjs/tree/master/src/MutationObserver)
