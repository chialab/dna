# Tools

A list of tools and how-to that will improve your experience with DNA.

## Custom Elements Manifest

The [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) is a JSON file that describes Custom Elements definitions. It can be used to generate documentation or to provide hints to the IDE when using them. The [CEM Analyzer](https://www.npmjs.com/package/@custom-elements-manifest/analyzer) is a CLI to generate the manifest with support for JSDoc, TypeScript and a bunch of flavors based on most common frameworks. You can use the analyzer DNA plugin to correctly detect features by components interface.  
For example:

::: code-group

```js [custom-elements-manifest.config.js]
import dnaPlugins from '@chialab/manifest-analyzer-dna-plugin';

export default {
    plugins: [...dnaPlugins()],
};
```

```ts [src/dna-map.ts]
import { Component, customElement, property, fires, type EventHandler } from '@chialab/dna';

/**
 * A map component based on mapbox-gl.
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

    /**
     * The map zoom level changed.
     */
    @fires()
    onzoom: EventHandler<CustomEvent<number>>;

    /**
     * The map center point changed.
     */
    @fires()
    onmove: EventHandler<CustomEvent<{ latitude: number; longitude: number }>>
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
