### Use with MutationObserver

This version of the library provides a lite polyfill for [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs using [MutationObserver API](https://developer.mozilla.org/it/docs/Web/API/MutationObserver) and without using the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) for element definition:

```js
import DNA from './dna-mutations.js';

class MyElem extends DNA.BaseComponent {
    // ...
}

DNA.define('my-elem', MyElem);
```

More:
* [native support](http://caniuse.com/#feat=mutationobserver)
* [polyfill](https://github.com/webcomponents/webcomponentsjs/tree/master/src/MutationObserver)
