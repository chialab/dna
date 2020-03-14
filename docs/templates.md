# Templates

Templates are the main part of a component definition because they are used to render the state as well as instantiate and update child elements. During a render cycle, DNA uses an in-place DOM diffing algorithm to check which nodes are to update, create or remove. In order to efficiently compare DOM nodes, templates cannot be plain HTML strings. Use the `render` method and the `html` helper to return the template for the element:

```ts
import { Component, html, define } from '@chialab/dna';

class MyElement extends Component {
    render() {
        return html`<h1>Hello world!</h1>`;
    }
}

define('my-element', MyElement);
```

### Using JSX

If you familiar with JSX, you can also use it since DNA templates are 100% compatible with JSX transpiled output:

```ts
import { Component, h, define } from '@chialab/dna';

class MyElement extends Component {
    render() {
        return <h1>Hello world!</h1>;
    }
}

define('my-element', MyElement);
```

Please rember to configure the `@babel/plugin-transform-react-jsx` in roder to use the DNA's `h` and `Fragment` helpers:

```json
{
    "plugins": [
        ["@babel/plugin-transform-react-jsx", {
            "pragma": "h",
            "pragmaFrag": "Fragment",
        }]
    ]
}
```

### Using template tags

Unless you are using JSX, writing and maintaining templates like the example above can be pain. Since a computational performance problem should not be a problem for a components author, DNA template can be created using template strings or `<template>` nodes interpolation. Anyway, each of this solutions internally uses the `h` helper so they are 100% equivalent.

If the `template` property is not defined, the DNA component will try to automatically detect a `<template>` tag in the document with the same `name`:

```ts
define('my-element', MyElement);
```

```html
<head>
    <template name="my-element">
        <div>Hello</div>
    </template>
</head>
```

You can also directly pass a `HTMLTemplateElement` reference to the property:

```ts
import { Component, define } from '@chialab/dna';

class MyElement extends Component {
    readonly template = document.querySelector('template#my-element);
}

define('my-element', MyElement);
```

## Interpolation rules

When interpolating an expression, the following rules (based on the type of the result and context) are applied:

| Type | Content | Attribute |
| ---- | ---- | --------- |
| `string` | Add/update as Text node | Add as value |
| `number` | Add/update as Text node | Add as value |
| `boolean` | / | Add/remove attribute, reference as property |
| `null` | / | Remove attribute |
| `undefined` | / | Remove attribute |
| `Node` | Add/update node | `.toString()` as value, reference as property |
| `array` | Add/update iterated content | `.toString()` as value, reference as property |
| `object` | `.toString()` as Text node | `.toString()` as value, reference as property |
| `function` | `.toString()` as Text node | `.toString()` as value, reference as property |

### Content interpolation

```ts
html`<span>${this.firstName} ${this.lastName}</span>`
```

<details>
<summary>JSX</summary>
<div>

```ts
<span>{this.firstName} {this.lastName}</span>
```

</div>
</details>

<details>
<summary>Template tag</summary>
<div>

```html
<template>
    <span>{{firstName}} {{lastName}}</span>
</template>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>

```ts
h('span', null, this.firstName, ' ', this.lastName)
```
</div>
</details>

### Attribute interpolation

```ts
html`<input name=${this.name} disabled=${this.disabled} required />`
```

<details>
<summary>JSX</summary>
<div>

```ts
<input name={this.name} disabled={this.disabled} required />
```

</div>
</details>

<details>
<summary>Template tag</summary>
<div>

```html
<template>
    <input name={{name}} disabled={{disabled}} required />
</template>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>


```ts
h('input', { name: this.name, disabled: this.disabled, required: true })
```
</div>
</details>

### Loops

When using loops it is necessary to keep in mind the [interpolation rules](#interpolation-rules): in order to correctly render a table or a list of data, we need to interpolate an array of templates:

```ts
html`<ul>
    ${this.items.map((item, index) => html`<li>${index}. ${item}</li>`)}
</ul>`
```

<details>
<summary>JSX</summary>
<div>

```ts
<ul>
    {this.items.map((item, index) => <li>{index}. {item}</li>)}
</ul>
```

</div>
</details>

<details>
<summary>Template tag</summary>
<div>

```html
<template>
    <ul>
        <template repeat={{items}} item="item" key="index">
            <li>{{index}}. {{item}}</li>
        </template>
    </ul>
</template>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>


```ts
h('ul', null, this.items.map((item, index) => 
    h('li', null, index, '. ', item)
))
```
</div>
</details>

### Conditionals

You can create conditional interpolations based on a boolean value using ternary operator or logical expression which results in a template or any other value:

```ts
html`
    ${this.avatar && html`<img src=${this.avatar} />`}
    <h1>${this.title || 'Untitled'}</h1>
    ${this.members.length ?
        html`${this.members.length} members` :
        'No members'
    }
`
```

<details>
<summary>JSX</summary>
<div>

```ts
<>
    {this.avatar && <img src={this.avatar} />}
    <h1>{this.title || 'Untitled'}</h1>
    {this.members.length ?
        `${this.members.length} members` :
        'No members'
    }
</>
```

</div>
</details>

<details>
<summary>Template tag</summary>
<div>

```html
<template>
    <template if={{avatar}}>
        <img src={{avatar}} />
    </template>
    <h1>{title || 'Untitled'}</h1>
    <template if={{members.length}}>
        {{members.length}} members
    </template>
    <template if={{!members.length}}>
        No members
    </template>
</template>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>


```ts
h(Fragment, null,
    this.avatar && h('img', { 'src': this.avatar }),
    h('h1', null, this.title || 'Untitled'),
    this.members.length ?
        `${this.members.length} members` :
        'No members'
)
```
</div>
</details>

## HTML content

By default, HTML strings will be interpolated as plain content. It means that a property `content` valorized as `"<h1>Hello</h1>"` will not create a H1 element, but it will print the code as is. In order to render dynamic html content, you need to pass the code to the `html` helper:

```diff
import { html } from '@chialab/dna';

const content = '<h1>Hello</h1>';

-<my-label>{content}</my-label>;
+<my-label>{html(content)}</my-label>;
```

<aside class="note">

Injecting uncontrolled HTML content may exposes your application to XSS vulnerabilities. Please always make sure you are rendering secure code!

</aside>

## Shadow DOM

One of the best practice for Web Components is to use the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to render and stylize component's children.
Shadow DOM is a good choice for encapsulating styles and handling components children, but its cross browser [support is poor](https://caniuse.com/#feat=shadowdomv1). During the render cycle, DNA is able to replicate ShadowDOM implementation as well as for [styles](./styles).

For example, we may declare a custom `<article is="my-article">` tag with some layout features:

```ts
import { Component, html, property, define } from '@chialab/dna';

class MyArticle extends Component {
    static get observedAttributes() {
        return ['title', 'body'];
    }

    @property() title = '';
    @property() body = '';

    render() {
        return html`
            <div class="layout-header">
                <h1>${this.title}</h1>
            </div>
            <div class="layout-body">
                ${this.body}
            </div>
        `;
    }
}

define('my-article', MyArticle, { extends: 'article' });
```

This example has two problems:

* Content is passed as property, which is not good for semantic
* Body is interpolated as string, so HTML code is rendered as plain text.

Shadow DOM solves those two issues, rendering "soft" children of an element into the `<slot>` tag:

```diff
class MyArticle extends Component {
    static get observedAttributes() {
        return ['title'];
    }

-    @property() title = '';
-    @property() body = '';

    render() {
        return html`
-            <div class="layout-header">
-                <h1>${this.title}</h1>
-            </div>
-            <div class="layout-body">
-                ${this.body}
-            </div>
+            <div class="layout-body">
+                 <slot />
+            </div>
        `;
    }
}
```

Now, every "soft" child of the `<article is="my-article">` element is rendered into the layout:

```html
<article is="my-article">
    <h1>How to use DNA</h1>
    <img src="https://placekitten.com/300/200" />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
</article>
```

results

```html
<article is="my-article">
    <div class="layout-body">
        <h1>How to use DNA</h1>
        <img src="https://placekitten.com/300/200" />
        <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
    </div>
</article>
```

We can also define multiple `<slot>` using a `name`, and reference them in the "soft" DOM using the `slot="name"` attribute, in order to handle more complex templates. The "unnamed" `<slot>` will colleced any element which does not specify a slot.

```diff
class MyArticle extends Component {
    render() {
        return html`
-            <div class="layout-body">
+            <div class="layout-header">
+                <slot name="title" />
+            </div>
+            <div class="layout-body">
                <slot />
            </div>
        `;
    }
}
```

Update the HTML sample adding `<h1>` to the `title` slot.

```diff
<article is="my-article">
-    <h1>How to use DNA</h1>
+    <h1 slot="title">How to use DNA</h1>
    <img src="https://placekitten.com/300/200" />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
</article>
```

Now the resulting DOM would be:

```html
<article is="my-article">
    <div class="layout-header">
        <h1>How to use DNA</h1>
    </div>
    <div class="layout-body">
        <img src="https://placekitten.com/300/200" />
        <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
    </div>
</article>
```

## Keyed elements

DNA optimizes rendering re-using elements when possible, comparing the tag name for elements, content for text nodes and constructor for components. Sometimes, you may prefer re-create a node instead of reusing the previous one. In this cases, you can use the `key` attribute to define an unique slug for the component that will be used for comparisons.

```ts
html`
    <select>
        ${this.items.map((item) => html`
            <option value=${item}>${item}</option>
        `)}
        <option key="last" value="other">Other</option>
    </select>
`
```

In this example, once the last `<option>` element has been created, it never changes its DOM reference, since previous `<option>` generations always re-create the element instead of re-using the keyed one.

Keyed elements are also added to the component's render scope (the `$` getter):

```ts
import { Component, html, define } from '@chialab/dna';

class MyForm extends Component {
    render() {
        return html`<input key="firstName" placeholder="Eg. Alan" />`;
    }

    logValue() {
        console.log(this.$.firstName.value);
    }
}

define('my-form', MyForm, { extends: 'form' });
```

<aside class="note">

However, since reading and writing from the render scope can be dangerous for the DOM reliability, [properties](./properties-and-attributes) are the recommended solution.

</aside>