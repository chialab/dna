[![Logo](https://raw.githubusercontent.com/Chialab/dna/next/docs/logo.png)](http://dna.chialab.io)

Just another components pattern with IncrementalDOM templates.

[Documentation](http://dna.chialab.io/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://dna.chialab.io) | [Author home page](http://www.chialab.com)

## Install

[![NPM](https://img.shields.io/npm/v/@dnajs/idom.svg)](https://www.npmjs.com/package/@dnajs/idom)
```
$ npm i @dnajs/idom --save
```

## Usage

### Defining a template using IncrementalDOM
An IncrementalDOM template for DNA components is a wrapping function around the api calls:
```js
// my-component.js
import { BaseComponent, IDOM } from '@dnajs/idom';

export class MyComponent extends BaseComponent {
    get template() {
        return () => {
            IDOM.elementOpen('span');
            IDOM.text('Hello!');
            IDOM.elementClose('span');
        };
    }
}
```
it will look like:
```html
<my-component>
    <span>Hello!</span>
</my-component>
```

JSX support is provided too, thanks to the  [babel-plugin-incremental-dom](https://github.com/jridgewell/babel-plugin-incremental-dom):
```js
// .babelrc
...
    "plugins": [
        ...,
        ["incremental-dom", { "prefix": "IDOM" }],
        ...
    ]
...
```
```js
// my-component.js
import { BaseComponent, IDOM } from '@dnajs/idom';

export class MyComponent extends BaseComponent {
    get template() {
        return () => <span>Hello!</span>;
    }
}
```

### IncrementalDOM notifications
You can use IncrementalDOM notifications to trigger components' life cycle callbacks. This will save you from import heavy polyfills for Custom Elements support if your application is built entirely with DNA or IncrementalDOM.

In order to activate IncrementalDOM notifications, import the `observer.js` file in your application:
```js
import '@dnajs/idom/observer.js';
```
