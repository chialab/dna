[![Logo](https://cdn.rawgit.com/Chialab/dna/master/logo.svg)](http://dna.chialab.io)

Just another components pattern.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.com)

## Install

[![NPM](https://img.shields.io/npm/v/@dnajs/custom-elements-v1.svg)](https://www.npmjs.com/package/@dnajs/custom-elements-v1)
```
$ npm i @dnajs/custom-elements-v1 --save
```

## Usage

DNA is built on the top of [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs, so it is 100% compatible with the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) interface. Simply define the component and register it using `customElements.define`:
```js
import { prop, BaseComponent } from '@dnajs/custom-elements-v1';

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
* [native support](http://caniuse.com/#feat=custom-elementsv1)
* [polyfill](https://github.com/webcomponents/custom-elements/)
