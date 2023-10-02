# Helpers

The DNA module exports a set of useful methods too. Sometimes those methods are based on Custom Elements specification, others they are internally used helpers with a completly custom logic.

## extend

This function extends a native `HTMLElement` constructor with all DNA prototype capabilities. This is useful to extend native constructors instead of using the default `Component` class:

```ts
import { window, extend } from '@chialab/dna';

// mix DNA features with the base class
export class AnchorComponent extends extend(window.HTMLAnchorElement) {
    ...
}

// the component inherit the HTMLAnchorElement's href behavior
const a = new AnchorComponent();
a.setAttribute('href', '/demo');

console.log(a.href); // -> https://my.domain/demo
```

> **Note**
> Use the `window` namespace instead of the global constructor to make sure to write compatible components with the NodeJS environment.

## css

The `css` helper is a method internally used by DNA convert a CSS string into its scoped version. This can be used to add extra manipulation to the CSS string:

```ts
import { css, document } from '@chialab/dna';

const cssText = css('x-article', 'h1 { color: red; }').replace(/red/g, 'blue');

const style = document.createElement('style');
style.textContent = cssText;

DOM.appendChild(document.head, style);
```
