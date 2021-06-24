# Styles

DNA can render plain `<style>` tags in a template, but what about style encapsulation?

Since components can be extended and stylesheets inherited, we need to be able to scope CSS rules based on the final component definition.

<aside class="note">

You don't need to use DNA's scoped style if you are already using a styling strategy to build and distribuite your CSS files. Other good options are CSS-in-JS, CSS Modules and BEM with styles lazy loading.

</aside>

## Scoped styles

Every `<style>` tag rendered to a component is scoped.

```ts
import { Component, customElement, html, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property() title = '';

    render() {
        return html`
            <style>
                h1 { color: cadetblue; }
            </style>
            <h1>${this.title}</h1>
        `;
    }
}
```

The previous component will br rendered as follow:

```html
<h1>Unaffected heading</h1>
<div is="x-card" title="Alan Turing">
    <style>
        [is='x-card'] h1 { color: cadetblue; }
    </style>
    <h1>Alan Turing</h1>
<div>
```

In the resulting HTML of the example above, the first `H1` color will not be affected by the scoped style declaration.

### How does it work?

DNA uses the component definition name to prefix all CSS rules with an unique selector for the element. For example, the rule

```css
h1 { color: cadetblue; }
```

is transformed into

```css
[is="x-card"] h1 { color: cadetblue; }
```

### The `:host` pesudo selector

If you need to style the component root itself, you can use the `:host` selector like in Shadow DOM contexts:

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

<!-- 
## Native CSS modules [WIP]

With the [CSS Module Spec](#native-css-modules-spec) you can import CSS files as `StyleSheet` object and link the reference to a component using setting the `adoptedStyleSheets` property:

```ts
import { Component } from '@chialab/dna';
import style from './x-card.css';

class Card extends Component {
    adoptedStyleSheets = [style];
}
```

<aside id="native-css-modules-spec" class="note">

\* Please note tha Native CSS modules still are a specification draft, but some bundlers may let you to use them. Follow [this thread](https://github.com/w3c/webcomponents/issues/759) for more informations.

</aside>
-->


## Other styling techniques

Every component node has the `is` attribute populated with the defined name of the component class. You can use an attribute selector to scope your CSS, for example using the SASS nesting:

```scss
/* CUSTOM ELEMENT */
x-card {
    h1 {
        color: cadetblue;
    }
}

/* BUILT IN ELEMENT */
[is='x-card'] {
    h1 {
        color: cadetblue;
    }
}
```

### Plain CSS

Some bundlers import CSS files in JavaScript and auto-append `<link>` tags. In this case, you have to manually set the scope for your rules:

```css
/* CUSTOM ELEMENT */
x-card .title {
    color: cadetblue;
}

/* BUILT IN ELEMENT */
[is='x-card'] .title {
    color: cadetblue;
}
```

```html
<link href="x-card.css" rel="stylesheet" />
```

### CSS Modules

If you are using a transpiler, you can also use CSS Modules, which imports CSS classes as JavaScript references in order to use them in a template:

```css
.title {
    color: cadetblue;
}
```

```ts
import { Component, customElement, html, property } from '@chialab/dna';
import { title } from './x-card.css';

@customElement('x-card', {
     extends: 'div',
})
class Card extends Component {
    @property() title = '';

    render() {
        return html`<h1 class="${title}"></h1>`;
    }
}
```
