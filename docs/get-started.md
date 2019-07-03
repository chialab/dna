# Get the library

DNA is distribuited as UMD package, ES module and CommonJS (Node) module. Follow the [Github release](https://github.com/chialab/dna/releases) page for changelog, new features and bug fixes.

Usage via [unpkg.com](https://unpkg.com/):
```html
<!-- As UMD package -->
<script src="https://unpkg.com/@chialab/dna" type="text/javascript"></script>
<script>
    class MyComponent extends DNA.Component {}
</script>

<!-- As module -->
<script type="module">
    import('https://unpkg.com/@chialab/dna?module')
        .then(({ Component }) => {
            class MyComponent extends Component {}
        });
</script>
```

Install via NPM:
```sh
# NPM
$ npm install @chialab/dna
# Yarn
$ yarn add @chialab/dna
```

If you are using Webpack, Rollup or Parcel:

```ts
import { Component } from '@chialab/dna';

class MyComponent extends Component { ... }
```

If you prefer Browserify:

```ts
const { Component } = require('@chialab/dna');

class MyComponent extends Component { ... }
```

In Node:

```js
const DNA = require('@chialab/dna');
require('@chialab/dna/dist/adapters/node').adapter(DNA);

class MyComponent extends DNA.Component { ... }
```
