![Logo](https://gitlab.com/dna-components/dna-design/raw/master/logos/logo-raster-128.png)

# DNA Components

A set of Custom Elements written using `<template>`, [ES2015](https://github.com/lukehoban/es6features) and [Sass](http://sass-lang.com/).

## DNABaseComponent

This is a base model for custom components. Use and extend `DNABaseComponent` for all `DNA` elements.

### Interface
* `created`: a callback triggered when the component is created.
* `attached`: a callback triggered when the component is attached to the DOM tree.
* `attributeChanged`: a callback triggered when the component's attribute changed.

### Example

See a complete example [here](https://gitlab.com/dna-components/seed-component).

*seed-component.next.js*

```js
export class SeedComponent extends DNABaseComponent {

    created() {
        //
    }

    attached() {
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

## Build

* Install [Node.js](https://nodejs.org)
* Install [Grunt](http://gruntjs.com/):

        (sudo) npm install grunt -g

* Install [Babel](https://babeljs.io/):

        (sudo) npm install babel -g


* Locate the project:

        cd /path/to/project

* Install Node dependencies:

        npm install

* Build:

        npm run build