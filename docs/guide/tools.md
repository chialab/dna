# Tools

A list of tools and how-to that will improve your experience with DNA.

### Syntax highlighting for templates

If you are using the `html` helper to generate template, you can install the [lit-html](https://github.com/mjbvz/vscode-lit-html) VSCode extension to enable HTML syntax highlightinh.

### Custom Elements Manifest

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

### Storybook

[Storybook](https://storybook.js.org/) is a fantastic tool for components development. You can create samples for your elements, provide a documentation and an API reference, run accessibility tests and more. Since version 5.6 it also supports [Web Components](https://storybook.js.org/docs/web-components/get-started/introduction).

A DNA addon for Storybook is available with automatic Custom Elements Manifest scans that run across your components to generate documentation and controls.  
You can install it using the `@chialab/storybook-addon-dna` package from NPM:

::: code-group

```[npm]
npm i @chialab/storybook-addon-dna -D
```

```[yarn]
yarn add @chialab/storybook-addon-dna -D
```

```[pnpm]
pnpm add @chialab/storybook-addon-dna -D
```

:::

And load it in the **main.js** config file:

```js
module.exports = {
    addons: ['@storybook/addon-a11y', '@storybook/addon-essentials', '@chialab/storybook-addon-dna'],
};
```

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
