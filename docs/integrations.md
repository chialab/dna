# Integrations

## Frameworks

DNA uses its own render to handle slotted nodes in the light DOM. So, we run tests for integration with other frontend frameworks like React, Angular, Lit and Vue. Here is a list of passing tests and known issues:

| Framwework | Update a property | Slot text | Slot elements | Named |
| ---------- | :---------------: | :-------: | :-----------: | :---: |
| React      |        🚧         |    🚧     |      🚧       |  🚧   |
| Lit        |        🚧         |    🚧     |      🚧       |  🚧   |
| Vue        |        🚧         |    🚧     |      🚧       |  🚧   |
| Angular    |        🚧         |    🚧     |      🚧       |  🚧   |

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
