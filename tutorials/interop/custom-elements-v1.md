### Use with Custom Elements (v1)

DNA is built on the top of [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs, so it is 100% compatible with the [CustomElementsRegistry](https://www.w3.org/TR/custom-elements/#custom-elements-api) interface. Simply define the component and register it using `customElements.define`:
```js
import DNA from 'dna-custom-elements-v1';

class MyElem extends DNA.BaseComponent {
    // ...
}

customElements.define('my-elem', MyElem);
```

More:
* [native support](http://caniuse.com/#feat=custom-elementsv1)
* [polyfill](https://github.com/webcomponents/custom-elements/)
