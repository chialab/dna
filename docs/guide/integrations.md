# Integrations

## Frameworks

DNA composition is tested across different frameworks.

| Framework       | Version | Update a property | Slot text | Slot elements | Named slots | Builtin elements |
| --------------- | :-----: | :---------------: | :-------: | :-----------: | :---------: | :--------------: |
| Angular         |   20    |       ✅         |    ✅     |      ✅       |      ✅      |         ⚠️¹      |
| Lit             |    3    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |
| Preact          |   10⁴   |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |
| React           |   19    |       ✅         |    ✅     |      ✅       |      ✅      |         ⚠️²      |
| Svelte          |    5    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅³      |
| uhtml           |    4    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |
| Vue             |    3    |       ✅         |    ✅     |      ✅       |      ✅      |         ✅       |


* ¹ does not create and handle builtin custom elements. [[issue](https://github.com/angular/angular/issues/63174)]
* ² does not correctly update properties for builtin custom elements. [[issue](https://github.com/facebook/react/issues/32135)]
* ³ full support since v5.38.5
* ⁴ full typings support from v11

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

#### Hydration

Many frameworks support hydration of server-rendered HTML. DNA elements rendering starts once the node is connected, so it may interfere with the hydration process. To avoid this, you can delay DNA rendering until the framework is ready. For example, in Svelte

::: code-group

```ts [hooks.client.ts]
import { isHydrating } from '@chialab/dna';

export const init = () => {
	isHydrating(true);
};
```

```svelte [+layout.svelte]
<script lang="ts">
	import { onMount } from 'svelte';
	import { isHydrating } from '@chialab/dna';

	onMount(() => {
		isHydrating(false);
	});
</script>
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
