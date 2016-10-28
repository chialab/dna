### Use with Incremental DOM

DNA's TemplateMixin uses [Skin templates](https://github.com/chialab/skin-template), which implements [Google IncrementalDOM](https://github.com/google/incremental-dom). Using IDOM callbacks, DNA can replicate [Custom Elements v1](https://www.w3.org/TR/custom-elements/) specs (similar to the React way):

```js
import DNA from 'dna-skin-idom';

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
