# Integrations

## Frameworks

DNA uses its own render to handle slotted nodes in the light DOM. So, we run tests for integration with other frontend frameworks like React, Angular, Lit and Vue. Here is a list of passing tests and known issues:

| Framwework | Update a property |   Slot text    | Slot elements  |     Named      |
| ---------- | :---------------: | :------------: | :------------: | :------------: |
| React      |  ⚠️<sup>1</sup>   |       ✅       |       ✅       |       ✅       |
| Lit        |  ✅<sup>2</sup>   |       ✅       |       ✅       | ⚠️<sup>3</sup> |
| Vue        |  ✅<sup>2</sup>   | ⚠️<sup>5</sup> | ⚠️<sup>5</sup> | ⚠️<sup>5</sup> |
| Angular    |        🚧         |       🚧       |       🚧       |       🚧       |

<sup>1</sup> partial support in React is granted primitive properties, but not for reference values before React 19.

<sup>2</sup> support in Lit is granted using [property expressions](https://lit.dev/docs/templates/expressions/#property-expressions).

<sup>3</sup> partial support in Lit is granted for first render, but inserting/removing children may lead to render issues.

<sup>4</sup> support in Vue is granted using [property expressions](https://vuejs.org/guide/extras/render-function.html).

<sup>5</sup> partial support in Vue is granted for first render and insterted children, but removing children may lead to render issues.

## View libraries

Sometimes you need to encapsulate in DNA another UI library, like [Mapbox](https://github.com/mapbox/mapbox-gl-js) or [Pickr](https://github.com/Simonwep/pickr). Since DNA components are DOM nodes, the integration is possible using the element context as library param:

```ts
import { Component, customElement } from '@chialab/dna';
import Pickr from '@simonwep/pickr';

@customElement('color-picker')
export class ColorPicker extends Component {
    private pickr: Pickr;

    connectedCallback() {
        super.connectedCallback();
        this.pickr = new Pickr({
            el: this,
        });
    }

    disconnectedCallback() {
        this.pickr.destroyAndRemove();
        super.disconnectedCallback();
    }
}
```

## Manipulating the DOM

Since DNA does not require any Custom Elements polyfill, the [life cycle](./life-cycle) is delegated to the render cycle which uses the `DOM` helper under the hood. This helper invokes the life cycle methods for each DOM operation like `appendChild`, `removeChild` etc.
If you want to manipulate the DOM tree outside of a render cycle, always use `DOM` methods instead of the `HTMLElement` prototype:

```ts
import { ChildComponent } from './child-component';

const child = new ChildComponent();

// ✘ DON'T
document.body.appendChild(child);
// ✔︎ DO!
DOM.appendChild(document.body, child);
```

All methods inherit the prototype signature with the context node as first argument:

| `HTMLElement.prototype`                             | `DOM` helper                                                |
| :-------------------------------------------------- | :---------------------------------------------------------- |
| `appendChild(newChild)`                             | `appendChild(parent, newChild)`                             |
| `removeChild(oldChild)`                             | `removeChild(parent, oldChild)`                             |
| `insertBefore(newChild, refChild)`                  | `insertBefore(parent, newChild, refChild)`                  |
| `replaceChild(newChild, oldChild)`                  | `replaceChild(parent, newChild, oldChild)`                  |
| `insertAdjacentElement(position, instertedElement)` | `insertAdjacentElement(parent, position, instertedElement)` |
| `getAttribute(qualifiedName)`                       | `getAttribute(element, qualifiedName)`                      |
| `hasAttribute(qualifiedName)`                       | `hasAttribute(element, qualifiedName)`                      |
| `setAttribute(qualifiedName, value)`                | `setAttribute(element, qualifiedName, value)`               |
| `removeAttribute(qualifiedName)`                    | `removeAttribute(element, qualifiedName)`                   |
| `dispatchEvent(event)`                              | `dispatchEvent(element, event)`                             |
| `matches(selector)`                                 | `matches(element, selector)`                                |

</aside>
