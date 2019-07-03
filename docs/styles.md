# Styles

DNA can render plain `<style>` tags in a template, but what about style encapsulation?

One of the best practice for Web Components is to use the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to render and stylize component's children.
Shadow DOM is a good choice for encapsulating styles which affects only nodes in the local tree, but its cross browser [support is poor](https://caniuse.com/#feat=shadowdomv1). Using the Virtual DOM life cycle, DNA is able to [replicate Shadow DOM implementation](./templating#shadow-dom) as well as for styles.

<aside class="tip">

You don't need to use DNA's scoped style if you are already using a styling strategy to build and distribuite your CSS files. Other good options are CSS-in-JS or BEM with styles lazy loading.

</aside>

### Scoped styles

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

#### How does it work?

DNA uses the component definition name to prefix all CSS rules with an unique selector for the element. For example, the rule

```css
h1 { color: cadetblue; }
```

is transformed into

```css
[is="my-card"] h1 { color: cadetblue; }
```

#### The `:host` pesudo selector

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
