# Get the library

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

```ts
import { Component } from '@chialab/dna';

class MyComponent extends Component {}
```
