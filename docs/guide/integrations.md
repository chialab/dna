# Integrations

### Typescript, JSX, HTMLElementTagNameMap, IntrinsicElements

TypeScript supports JSX syntax, and it is able to provide typechecking and hints for component properties if you register the tag name to the DNA's `JSX.CustomElements` interface. The JSX typings provided by DNA will make it automatically available as [`IntrinsicElement`](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) and to the [`HTMLElementTagNameMap`](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html#documentcreateelement) interface.

::: code-group

```tsx [app.tsx]
import { render } from '@chialab/dna';
import './x-card';

render(
    <x-card
        firstName="Alan"
        age={24}
    />,
    document.body
);
```

```tsx [x-card.tsx]
import { builtin, Component, customElement } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    // ...
}

@customElement('x-link', { extends: 'a' })
class Link extends builtin.HTMLAnchorElement {
    // ...
}

declare module '@chialab/dna' {
    namespace JSX {
        interface CustomElements {
            'x-card': Card;
            'x-link': Link & {
                extends: 'a';
            };
        }
    }
}
```

:::

## Frameworks

DNA composition is based on Quantum, which is [tested across different frameworks](https://github.com/chialab/quantum/tree/main/tests).

| Framwework | Update a property | Slot text | Slot elements | Named slots |
| ---------- | :---------------: | :-------: | :-----------: | :---------: |
| React      |        ✅         |    ✅     |      ✅       |     ✅      |
| Lit        |        ✅         |    ✅     |      ✅       |     ✅      |
| Vue        |        ✅         |    ✅     |      ✅       |     ✅      |
| Angular    |        ✅         |    ✅     |      ✅       |     ✅      |
| Svelte     |        ✅         |    ✅     |      ✅       |     ✅      |

### Svelte integration

Import DNA typings in your `app.d.ts` in order to enable integrated support with svelte:

::: code-group

```ts [app.d.ts]
import '@chialab/dna/frameworks/svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
```

```ts [hello-world.ts]
import { Component, customElement, html, property } from '@chialab/dna';

@customElement('hello-world')
export class HelloWorld extends Component {
    @property({
        type: String,
    })
    name?: string;

    render() {
        return html`Hello ${this.name || 'world'}!`;
    }
}

declare module '@chialab/dna' {
    namespace JSX {
        interface CustomElements {
            'hello-world': HelloWorld;
        }
    }
}
```

```svelte [+page.svelte]
<script lang="ts">
    import './hello-world';
</script>

<hello-world
    name={2} // [!code error] Type 'number' is not assignable to type 'string'.
/>
```

:::

## View libraries

Sometimes you need to encapsulate in DNA another UI library, like [Mapbox](https://github.com/mapbox/mapbox-gl-js) or [Pickr](https://github.com/Simonwep/pickr). Since DNA components are DOM nodes, the integration is possible using the element context as library param:

```ts
import { Component, customElement } from '@chialab/dna';
import Pickr from '@simonwep/pickr';

@customElement('color-picker')
class ColorPicker extends Component {
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
