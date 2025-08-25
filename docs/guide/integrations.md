# Integrations

## Frameworks

DNA composition is tested across different frameworks.

| Framwework      | Version | Update a property | Slot text | Slot elements | Named slots | Builtin elements |
| --------------- | :-----: | :---------------: | :-------: | :-----------: | :---------: | :--------------: |
| Angular         |   20    |       ✅         |    ✅     |      ✅       |      ✅      |         ⚠️¹      |
| Lit             |    3    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |
| Preact          |   10    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |
| React           |   19    |       ✅         |    ✅     |      ✅       |      ✅      |         ⚠️²      |
| Svelte          |    5    |       ✅         |    ✅     |      ✅       |      ✅      |         ⚠️³      |
| uhtml           |    4    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |
| Vue             |    3    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |


* ¹ does not create and handle builtin custom elements. [[issue](https://github.com/angular/angular/issues/63174)]
* ² does not correctly update proeprties for builtin custom elements. [[issue](https://github.com/facebook/react/issues/32135)]
* ³ does not correctly update camel case properties for builtin custom elements. [[issue](https://github.com/sveltejs/svelte/issues/16591)]

#### JSX

DNA has export specifiers for JSX integration with different frameworks.

::: code-group

```ts [React (global.d.ts)]
import '@chialab/dna/react';
```

```ts [Preact (global.d.ts)]
import '@chialab/dna/preact';
```

```ts [Svelte (src/app.d.ts)]
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
