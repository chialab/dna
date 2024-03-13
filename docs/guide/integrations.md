# Integrations

## Frameworks

DNA composition is based on Quantum, which is [tested across different frameworks](https://github.com/chialab/quantum/tree/main/tests).

| Framwework | Update a property | Slot text | Slot elements | Named slots |
| ---------- | :---------------: | :-------: | :-----------: | :---------: |
| React      |        ✅         |    ✅     |      ✅       |     ✅      |
| Lit        |        ✅         |    ✅     |      ✅       |     ✅      |
| Vue        |        ✅         |    ✅     |      ✅       |     ✅      |
| Angular    |        ✅         |    ✅     |      ✅       |     ✅      |
| Svelte     |        ✅         |    ✅     |      ✅       |     ✅      |

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
