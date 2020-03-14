# Tools

A list of tools and how-to that will improve your experience with DNA.

### Syntax highlighting for templates

If you are using the `html` helper to generate template, you can install the [lit-html](https://github.com/mjbvz/vscode-lit-html) VSCode extension to enable HTML syntax highlightinh.

### Web Components Analyzer

[WCA](https://www.npmjs.com/package/web-component-analyzer) is a CLI that analyzes Web components and generates a report in many formats like JSON and Markdown in order to provide component documentation. It natively supports JSDoc comments and TypeScript syntax so a lot of informations are infered from the source code. WCA supports a large variety of frameworks and a DNA specific flavor is something we are considering. By the way, you can use JSDoc comments and some native features to properly get a report:

**src/dna-map.ts**
```ts
import { define, Component } from '@chialab/dna';

/**
 * A map component based on mapbox-gl.
 * @element dna-map
 * @fires zoom - The map zoom level changed.
 * @fires move - The map center point changed.
 */
export class DNAMap extends Component {
    static get observedAttributes() {
        return ['latitude', 'longitude'];
    }

    /**
     * The latitude value for the map center.
     */
    latitude: number;

    /**
     * The longitude value for the map center.
     */
    longitude: number;
}

define('dna-map', DNAMap);
```

Run:

```sh
$ wca analyze src/dna-map.ts
```

```md
# dna-map

A map component based on mapbox-gl.

## Properties

| Property    | Attribute   | Type     | Description                             |
|-------------|-------------|----------|-----------------------------------------|
| `latitude`  | `latitude`  | `number` | The latitude value for the map center.  |
| `longitude` | `longitude` | `number` | The longitude value for the map center. |

## Events

| Event  | Description                   |
|--------|-------------------------------|
| `move` | The map center point changed. |
| `zoom` | The map zoom level changed.   |
```


#### Storybook

Storybook is a fantastic tool for components development: you can create samples for your elements, provide a documentation and an API reference, run accessibility tests and more. Since version 5.6, it also supports Web Components.

Use `npx` (installed with Node) to setup the project and follow the [official guide](https://storybook.js.org/docs/basics/introduction/):

```sh
$ npx -p @storybook/cli sb init -t web_components
```

Storybook is compatible with the Web Components Analyzer JSON output in order to beautifilly works with the [docs addon](https://github.com/storybookjs/storybook/tree/master/addons/docs):

* Generate a JSON report:

```sh
$ wca analyze src --format json --outFile custom-elements.json
```

* Import `custom-elements.json` in the Storybook preview file:

**.storybook/preview.js**
```ts
import { setCustomElements } from '@storybook/web-components';
import customElements from '../custom-elements.json';

setCustomElements(customElements);
```

* Add the properties table to the documentation page:

**my-card.stories.mdx**

```ts
import { Props } from '@storybook/addon-docs/blocks';

<Props of="my-card" />
```

### Typescript JSX IntrinsicElements

TypeScript supports JSX syntax, and it is able to provide typechecking and hints for component properties automatically if you use class constructors as tag name:

```ts
import { render } from '@chialab/dna';
import { MyCard } from './my-card';

render(document.body, <MyCard firstName="Alan" age={24} />);
```

But how does it work with defined custom elements? It is possibile to declare `IntrinsicElements` in order to bind element's tag name with its prototype:

```ts
import { Component, define } from '@chialab/dna';

class MyCard extends Component {
    ...
}

define('my-card', MyCard);

declare namespace JSX {
    interface IntrinsicElements {
        'my-card': MyCard;
    }
}
```