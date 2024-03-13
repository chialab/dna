# Tools

A list of tools and how-to that will improve your experience with DNA.

## Custom Elements Manifest

The [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) is a JSON file that describes Custom Elements definitions. It can be used to generate documentation or to provide hints to the IDE when using them. The [CEM Analyzer](https://www.npmjs.com/package/@custom-elements-manifest/analyzer) is a CLI to generate the manifest with suppoort for JSDoc, TypeScript and a bunch of flavors based on most common frameworks. You can use the analyzer DNA plugin to correctly detect features by components interface.  
For example:

::: code-group

```js [custom-elements-manifest.config.js]
import dnaPlugins from '@chialab/manifest-analyzer-dna-plugin';

export default {
    plugins: [...dnaPlugins()],
};
```

```ts [src/dna-map.ts]
import { Component, customElement, property } from '@chialab/dna';

/**
 * A map component based on mapbox-gl.
 * @fires zoom - The map zoom level changed.
 * @fires move - The map center point changed.
 */
@customElement('x-map')
class MapboxMap extends Component {
    /**
     * The latitude value for the map center.
     */
    @property() latitude: number;

    /**
     * The longitude value for the map center.
     */
    @property() longitude: number;
}
```

:::

Run:

```
cem analyze src/dna-map.ts
```

```md
# dna-map

A map component based on mapbox-gl.

## Properties

| Property    | Attribute   | Type     | Description                             |
| ----------- | ----------- | -------- | --------------------------------------- |
| `latitude`  | `latitude`  | `number` | The latitude value for the map center.  |
| `longitude` | `longitude` | `number` | The longitude value for the map center. |

## Events

| Event  | Description                   |
| ------ | ----------------------------- |
| `move` | The map center point changed. |
| `zoom` | The map zoom level changed.   |
```

## Storybook

[Storybook](https://storybook.js.org/) is a fantastic tool for components development. You can create samples for your elements, provide a documentation and an API reference, run accessibility tests and more. Since version 5.6 it also supports [Web Components](https://storybook.js.org/docs/web-components/get-started/introduction).

A DNA preset for Storybook is available with automatic Custom Elements Manifest scans that run across your components to generate documentation and controls.  
You can install it using the `@chialab/storybook-dna-vite` package from NPM:

::: code-group

```bash[npm]
npm i @chialab/storybook-dna-vite -D
```

```bash[yarn]
yarn add @chialab/storybook-dna-vite -D
```

```bash[pnpm]
pnpm add @chialab/storybook-dna-vite -D
```

:::

And load it in the **main.js** config file:

```ts
export default {
    framework: {
        name: '@chialab/storybook-dna-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
};
```

## Plasma

Plasma is a CLI tool developed by Chialab to generate frameworks wrappers for Web&nbsp;Components. It can be used to create a React, Vue, Svelte or Angular wrapper for your DNA components.

First of all, you need to [generate the Custom Elements Manifest](#custom-elements-manifest) for your components.

Then, you can install Plasma using NPM:

::: code-group

```bash[npm]
npm i @chialab/plasma -D
```

```bash[yarn]
yarn add @chialab/plasma -D
```

```bash[pnpm]
pnpm add @chialab/plasma -D
```

:::

And run the `plasma` command in your project root:

```bash
plasma
```

Read more about Plasma in the [documentation](https://chialab.github.io/plasma/).
