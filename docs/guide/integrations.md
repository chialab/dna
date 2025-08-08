# Integrations

## Frameworks

DNA composition is tested across different frameworks.

| Framwework | Update a property | Slot text | Slot elements | Named slots | Typings |
| ---------- | :---------------: | :-------: | :-----------: | :---------: | :-----: |
| React      |        ✅         |    ✅     |      ✅       |      ✅      |    🚧   |
| Lit        |        ✅         |    ✅     |      ✅       |      ✅      |    🚧   |
| Vue        |        ✅         |    ✅     |      ✅       |      ✅      |    🚧   |
| Angular    |        ✅         |    ✅     |      ✅       |      ✅      |    🚧   |
| Svelte     |        ✅         |    ✅     |      ✅       |      ✅      |    ✅   |

### Svelte and SvelteKit

Enable DNA components typings in Svelte by adding the following to your global declaration file:

::: code-group

```ts [src/app.d.ts]
import '@chialab/dna/svelte';

declare global {
	namespace App {
        // ...
    }
}
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
