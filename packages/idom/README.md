[![Logo](https://cdn.rawgit.com/Chialab/dna/master/logo.svg)](http://chialab.io/p/dna)

Evolution-based components with IncrementalDOM templates.

[Documentation](http://chialab.io/p/dna/docs) | [Issue tracker](https://github.com/Chialab/dna/issues) | [Project home page](http://chialab.io/p/dna) | [Author home page](https://www.chialab.it)

## Install

[![NPM](https://img.shields.io/npm/v/@dnajs/idom.svg)](https://www.npmjs.com/package/@dnajs/idom)
```
$ npm i @dnajs/idom --save
```

## Usage

### Defining a template using `IDOM.h`
`IDOM.h` is a wrapper for IncrementalDOM api:
```js
// my-component.js
import { BaseComponent, IDOM } from '@dnajs/idom';

export class MyComponent extends BaseComponent {
    get template() {
        return () => IDOM.h('span', 'Hello!');
    }
}
```
it will look like:
```html
<my-component>
    <span>Hello!</span>
</my-component>
```

### With JSX!
JSX support is provided too, passing `IDOM.h` as `pragma`.
```sh
$ npm install babel-plugin-transform-react-jsx -D
```
```js
// .babelrc
...
    "plugins": [
        ...,
        ["transform-react-jsx", { "pragma": "IDOM.h" }],
        ...
    ]
...
```
```js
// my-component.js
import { BaseComponent, IDOM } from '@dnajs/idom';

export class MyComponent extends BaseComponent {
    get template() {
        return <span>Hello!</span>;
    }
}
```
