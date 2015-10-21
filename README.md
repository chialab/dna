![Logo](https://gitlab.com/dna-components/dna-design/raw/master/logos/logo-raster-128.png)

# DNA Components

A set of Custom Elements written using `<template>`, [ES2015](https://github.com/lukehoban/es6features) and [Sass](http://sass-lang.com/).

* [DNA Component](#DNAComponent)
* [Event Component](#DNAEventComponent)
* [Mixed Component](#DNAMixedComponent)
* [Base Component](#DNABaseComponent)

### DNAComponent

This is a base model for custom components. Use and extend `DNAComponent` for all `DNA` elements.

** Example **

See a complete example [here](https://gitlab.com/dna-components/dna-seed-component).

*seed-component.next.js*

```js
export class SeedComponent extends DNAComponent {

    static get tagName() {
        return 'seed-component'
    }

    createdCallback() {
        //
    }

    attachedCallback() {
        //
    }

    myCustomMethod() {
        return 5 * 5;
    }

}

// Register the component
SeedComponent.init();
```

*seed-component.scss*

```scss
.seed-component {
    span {
        color: red;
    }
    p {
        font-size: 2em;
    }
}

```

*seed-component.html*

```html
<link rel="import" href="../../dna-components/dist/dna-components.html">
<link rel="stylesheet" href="seed-component.css" type="text/css">
<template>
	<span>Seed component :)</span>
</template>
<script type="text/javascript" src="seed-component.next.js"></script>
```

### DNAEventComponent
Simple Custom Component with `addEventListener` polyfill and a `dispatchEvent` wrapper named `trigger`.

** Interface **
* `trigger`: trigger an Event with some custom data.

** Example **

```js
export class SeedComponent extends DNAEventComponent {

    get tagName() {
        return 'seed-component'
    }

}

// Register the component
SeedComponent.init();

// --------

let seed = document.createElement('seed-component');
// or
let seed = new SeedComponent();
seed.addEventListener('sprout', function (ev) {
    console.log(ev.detail.owner + '\'s seed is growing!');
});
seed.trigger('sprout', { owner: 'Gustavo' });
```

This script will prompt: `Gustavo's seed is growing!`

### DNAMixedComponent
This is another model to use to create DNA Custom Components mixing a list of prototypes.

Add some some prototype to the `behaviors` property of the Class:

** Interface **
* `get behaviors`: a list of prototypes to mixin.

** Example **

```js
export class SeedComponent extends DNAMixedComponent {

    get behaviors() {
        return [DNAEventComponent];
    }

}

// Register the component
SeedComponent.init();
```

After the initialization, the `SeedComponent` prototype incorporates the `DNAEventComponent.trigger` method!

### DNABaseComponent

This is a base model which extends `DNAMixedComponent` and automatically add `DNAEventComponent` as behavior.

---

## Build

Have a look [here](https://gitlab.com/dna-components/dna-docs/blob/master/tutorials/build.md).
