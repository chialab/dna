# Helpers

The DNA module exports a set of useful methods too. Sometimes those methods are based on Custom Elements specification, others they are internally used helpers with a completly custom logic.

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

💁 Use the `window` namespace instead of the global constructor to make sure to write compatible components with the NodeJS environment.

## css

The `css` helper is a method internally used by DNA convert a CSS string into its scoped version. This can be used to add extra manipulation to the CSS string:

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
