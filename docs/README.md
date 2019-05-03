# Hello!

**DNA** is a 5kb (gizipped) component library which aims to replicate Web Components APIs in a lite cross browser way.

> DNA 3 is still in beta phase. Please report any issue you encounter in order to help us to reach a stable version.

### Web Components design

**DNA** Components follow the W3C's Custom Element and Shadow DOM specifications, in order to progressively remove this library once all browsers will support the spec. This strategy increases the interoperability with other frameworks without introducing any custom pattern.

### Fast and reliable

In order to efficiently update the DOM when data changes, **DNA** uses an in-place diffing algorithm which differs from othe Virtual DOM implementations by a top-to-bottom strategy, creating, moving and updating DOM nodes only when needed.

The render engine is also used to replicate the elements' life cycle, so a Custom Element polyfill is not required (Components will work only when used in a render context or through the DNA helpers).

### Interpolation and JSX

There are three ways to write **DNA** templates: the simpler one is to write `<template>` tags in your HTML, using interpolation helpers. You can also use the HTML string to the `template` accessor of the Component, as well as JSX syntax through a build step with the `h` pragma.

Checkout the [Templating](./templating) section for more informations.

### Properties, async render, slots... and more!

**DNA** offers a lot of optional helpers like properties declaration, `<slot>` support like in Shadow DOM specification, async rendering and Component lazy loading.

## Try it

[Get the library](./get-started) and [create your first Component](./define-a-component)!
