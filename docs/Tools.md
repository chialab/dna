# Tools

A list of tools and how-to that will improve your experience with DNA.

### Syntax highlighting for templates

If you are using the `html` helper to generate template, you can install the [lit-html](https://github.com/mjbvz/vscode-lit-html) VSCode extension to enable HTML syntax highlightinh.

### Web Components Analyzer

[WCA](https://www.npmjs.com/package/web-component-analyzer) is a CLI that analyzes Web components and generates a report in many formats like JSON and Markdown in order to provide component documentation. It natively supports JSDoc comments and TypeScript syntax so a lot of informations are infered from the source code. WCA supports a large variety of frameworks and a DNA specific flavor is something we are considering. By the way, you can use JSDoc comments and some native features to properly get a report:

**src/dna-map.ts**
```ts
import { Component, customElement, property } from '@chialab/dna';

/**
 * A map component based on mapbox-gl.
 * @fires zoom - The map zoom level changed.
 * @fires move - The map center point changed.
 */
@customElement('x-map')
export class MapboxMap extends Component {
    static get observedAttributes() {
        return ['latitude', 'longitude'];
    }

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


### Storybook

Storybook is a fantastic tool for components development: you can create samples for your elements, provide a documentation and an API reference, run accessibility tests and more. Since version 5.6, it also supports Web Components.

A DNA preset for storybook is available with full [docs addon](https://github.com/storybookjs/storybook/tree/master/addons/docs) support and automatic Web Components Analyzer runs across your components for documentation and knobs. You can install it using the `@chialab/storybook-dna` package from NPM:

```sh
$ npm i @chialab/storybook-dna -D
```

Please follow the instructions in the preset [README](https://github.com/chialab/storybook-dna) for the full configuration.

### Typescript JSX IntrinsicElements

TypeScript supports JSX syntax, and it is able to provide typechecking and hints for component properties automatically if you use class constructors as tag name:

```ts
import { render } from '@chialab/dna';
import { Card } from './x-card';

render(<Card firstName="Alan" age={24} />, document.body);
```

But how does it work with defined custom elements? It is possibile to declare `IntrinsicElements` in order to bind element's tag name with its prototype:

```ts
import { Component, customElement } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    ...
}

declare namespace JSX {
    interface IntrinsicElements {
        'x-card': Card;
    }
}
```
