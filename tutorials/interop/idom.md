### Use with Incremental DOM

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

You can also use JSX for the template getter, thanks to (babel-plugin-incremental-dom)[https://github.com/jridgewell/babel-plugin-incremental-dom]:
```js
import { BaseComponent, IDOM } from '@dnajs/idom';

class MyElem extends BaseComponent {
    get template() {
        return () => {
            () => <my-child></my-child>
        }
    }
}
```
