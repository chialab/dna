# Styles

DNA can render plain `<style>` tags in a template, but what about style encapsulation?

One of the best practice for Web Components is to use the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to render and stylize component's children.
Shadow DOM is a good choice for encapsulating styles which affects only nodes in the local tree, but its cross browser [support is poor](https://caniuse.com/#feat=shadowdomv1). Using the Virtual DOM life cycle, DNA is able to [replicate Shadow DOM implementation](./templating#shadow-dom) as well as for styles.

<aside class="tip">

You don't need to use DNA's scoped style if you are already using a styling strategy to build and distribuite your CSS files. Other good options are CSS-in-JS, CSS Modules and BEM with styles lazy loading.

</aside>

## Scoped styles

In order to create scoped styles, you should add the `scoped` attribute to the tag style:

```html
<template name="my-card">
    <style scoped>
        h1 { color: cadetblue; }
    <style>
    <h1>[[ title ]]</h1>
</template>

<!-- RESULT -->
<h1>Page title</h1>
<div is="my-card" title="Alan Turing">
    <style scoped>...</style>
    <h1>Alan Turing</h1>
<div>
```

In the resulting HTML of the example above, the first `H1` color will not be affected by the scoped style declaration.

### How does it work?

DNA uses the component definition name to prefix all CSS rules with an unique selector for the element. For example, the rule

```css
h1 { color: cadetblue; }
```

is transformed into

```css
[is="my-card"] h1 { color: cadetblue; }
```

### The `:host` pesudo selector

If you need to style the component root itself, you can use the `:host` selector as specified by Shadow DOM:

```css
:host {
    color: #333;
    font-family: sans-serif;
}
```

You can also define styles for component states with `:host(*selector*)` rule:

```css
:host(:hover) {
    background-color: #e5e5e5;
}

:host(:hover) span {
    color: red;
}
```

<aside class="note">

The `:host` selector value change for every element definition: if a component class extends another one and inherits its template with a scoped style, the `:host` will reflect the correct definition for each components instances.

</aside>

## Other styling strategies

Every component node has the `is` attribute populated with the defined name of the component class. You can use an attribute selector to scope your CSS, for example using the SASS nesting:

```scss
[is='my-card'] {
    h1 {
        color: cadetblue;
    }
    .avatar {
        width: 44px;
        height: 44px;
    }
}
```

If you are using a transpiler, you can also use [Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) and CSS imports to bind a stylesheet to a component:

```ts
import { Component } from '@chialab/dna';
import styleSheet from './my-card.css';

class MyCard extends Component {
    constructor(...args) {
        super(...args);
        this.adoptedStyleSheets = [styleSheet];
    }
}
```

Another transpiler-based solution is CSS Modules, which imports CSS classes as JavaScript references in order to use them in a template:

```css
.title {
    color: cadetblue;
}
```

```ts
import { Component, html } from '@chialab/dna';
import { title } from './my-card.css';

class MyCard extends Component {
    get template() {
        return html`<h1 class="${title}"></h1>`;
    }
}
```
