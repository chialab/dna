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

### Typescript, JSX, IntrinsicElements, HTMLElementTagNameMap

TypeScript supports JSX syntax, and it is able to provide typechecking and hints for component properties automatically if you use class constructors as tag name:

```tsx
import { render } from '@chialab/dna';
import { Card } from './x-card';

render(<Card firstName="Alan" age={24} />, document.body);
```

But how does it work with defined custom elements? It is possibile to declare `IntrinsicElements` (for JSX) and `HTMLElementTagNameMap` (for DOM methods) in order to bind element's tag name with its prototype:

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

declare global {
    interface HTMLElementTagNameMap {
        'x-card': Card;
    }
}

```
