# Helpers

The DNA module exports a set of useful methods too. Sometimes those methods are based on Custom Elements specification, others they are internally used helpers with a completly custom logic.

## get

Like the [`CustomElementRegistry.get`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/get) method, it returns the component constructor defined for a given tag:

```ts
import { Component, customElements, get } from '@chialab/dna';

class CardElement extends Component {}

customElements.define('x-card', Card);

get('x-card') // -> Card
```

## whenDefined

Like the [`CustomElementRegistry.whenDefined`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined) method, it returns a Promise that resolves once a component has been defined with the name:

```ts
import { customElements } from '@chialab/dna';

customElements.whenDefined('x-card')
    .then(() => {
        // -> The x-card has been defined
    });

import('./x-card.js');
```

## upgrade

Like the [`CustomElementRegistry.upgrade`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/upgrade) method, it is used to upgrade nodes that had been created before element definition:

```ts
import { Component, customElements, DOM } from '@chialab/dna';

class Card extends Component {}

const element = DOM.createElement('x-card');
console.log(Object.getPrototypeOf(element)); // -> HTMLElement

customElements.define('x-card', Card);
customElements.upgrade(element);

console.log(Object.getPrototypeOf(element)); // -> Card
```

All children and descendants of the passed element will be upgraded too, so `customElements.upgrade` can be used for tag re-hydration after a server side rendering:

```ts
import { customElements } from '@chialab/dna';

document.addEventListener('DOMContentLoaded', (event) => {
    customElements.upgrade(document.body);
});
```

## extend

This function extends a native `HTMLElement` constructor with all DNA prototype capabilities. This is useful to extend native constructors instead of using the default `Component` class:

```ts
import { window, extend, DOM } from '@chialab/dna';

// mix DNA features with the base class
export class AnchorComponent extends extend(window.HTMLAnchorElement) {
    ...
}

// the component inherit the HTMLAnchorElement's href behavior
const a = new AnchorComponent();
a.setAttribute('href', '/demo');

console.log(a.href); // -> https://my.domain/demo
```

<aside class="note">

Use the `window` namespace instead of the global constructor to make sure to write Node compatible components.

</aside>

## css

The `css` helper is a method internally used by DNA convert a CSS string into its scoped Shadow DOM version. This can be used to add extra manipulation to the CSS string:

```ts
import { DOM, css } from '@chialab/dna';

const cssText = css('x-article', 'h1 { color: red; }')
        .replace(/red/g, 'blue');

const style = DOM.document.createElement('style');
style.textContent = cssText;

DOM.appendChild(DOM.document.head, style);
```

## Creating an adapter

An adapter is a compatibility layer between DNA and the environment where it runs. Since DNA is completely based on the DOM, in order to create an adapter we need to replace the methods of the `DOM` namespace:

```ts
import { DOM } from '@chialab/dna';

Object.assign(DOM, {
    window: windowImplementation,
    document: documentImplementation,
    createElement(tagName: string, options?: ElementCreationOptions): Element { ... },
    createElementNS(namespaceURI: string, tagName: string): Element { ... },
    createTextNode(data: string): Text { ... },
    createEvent(typeArg: string, eventInitDict?: CustomEventInit): CustomEvent { ... },
    appendChild(parent: Element, newChild: Node): Node { ... },
    removeChild(parent: Element, oldChild: Node): Node { ... },
    insertBefore(parent: Element, newChild: Node, refChild: Node | null): Node { ... },
    replaceChild(parent: Element, newChild: Node, oldChild: Node): Node { ... },
    getAttribute(element: Element, qualifiedName: string): string | null { ... },
    hasAttribute(element: Element, qualifiedName: string): boolean { ... },
    setAttribute(element: Element, qualifiedName: string, value: string): void { ... },
    removeAttribute(element: Element, qualifiedName: string) { ... },
    matches(element: Element, selectorString: string): boolean { ... },
    dispatchEvent(element: Node, event: Event): boolean { ... },
});
```
