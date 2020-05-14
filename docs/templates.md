# Templates

Templates are the main part of a component definition because they are used to render the state as well as instantiate and update child elements. During a render cycle, DNA uses an in-place DOM diffing algorithm to check which nodes are to update, create or remove. In order to efficiently compare DOM nodes, templates cannot be plain HTML strings. Use the `render` method and the `html` helper to return the template for the element:

```ts
import { Component, customElements, html } from '@chialab/dna';

class HelloWorld extends Component {
    render() {
        return html`<h1>Hello world!</h1>`;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Using JSX

If you familiar with JSX, you can also use it since DNA templates are 100% compatible with JSX transpiled output:

```ts
import { Component, customElements, h } from '@chialab/dna';

class HelloWorld extends Component {
    render() {
        return <h1>Hello world!</h1>;
    }
}

customElements.define('hello-world', HelloWorld);
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

If a component does not provide a `render` method, DNA will try to automatically detect in the document a `<template>` with the same `name` of the component:

```ts
customElements.define('hello-world', HelloWorld);
```

```html
<head>
    <template name="hello-world">
        <div>Hello world!</div>
    </template>
</head>
```

You can also directly pass a `HTMLTemplateElement` reference to the property:

```ts
import { Component, customElements } from '@chialab/dna';

class HelloWorld extends Component {
    readonly template = document.querySelector('template#hello-world);
}

customElements.define('hello-world', HelloWorld);
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

### Promises

The DNA's render algorithm has builtin support for `Promise`s in template: it interpolates the result of a `Promise` just like using the `await` statement and provides the helpers `until` and `wait` for status handling:

```ts
import { until, wait } from '@chialab/dna';

const json = fetch('/data.json')
    .then(() => response.json())
    .then((data) => data.map(({ name }) => html`<li>${name}</li>`));

html`
    ${until(json, 'Loading...')}
    ${wait(json,
        html`<ul>${json}</ul>`,
        html`<div>Error: ${json}</div>`
    )}
`
```

<details>
<summary>JSX</summary>
<div>

```ts
import { until, wait } from '@chialab/dna';
<>
    {until(json, 'Loading...')}
    {wait(json,
        <ul>{json}</ul>,
        <div>Error {json}</div>,
    )}
</>
```

</div>
</details>

<details>
<summary>Template tag</summary>
<div>

```html
<template>
    <template until={{json}}>
        Loading...
    </template>
    <template then={{json}}>
        <ul>{{json}}</ul>
    </template>
    <template catch={{json}}>
        <div>Error {{json}}</div>
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
    until(json, 'Loading...'),
    wait(json,
        h('ul', null, json),
        h('div', null, 'Error ', json),
    )
)
```
</div>
</details>

## HTML content

By default, HTML strings will be interpolated as plain content. It means that a property `content` valorized as `"<h1>Hello</h1>"` will not create a H1 element, but it will print the code as is. In order to render dynamic html content, you need to pass the code to the `html` helper:

```diff
import { html } from '@chialab/dna';

const content = '<h1>Hello</h1>';

-<x-label>{content}</x-label>;
+<x-label>{html(content)}</x-label>;
```

<aside class="note">

Injecting uncontrolled HTML content may exposes your application to XSS vulnerabilities. Always make sure you are rendering secure code!

</aside>

## Shadow DOM

One of the best practice for Web Components is to use the [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to render and stylize component's children.
Shadow DOM is a good choice for encapsulating styles and handling components children, but its cross browser [support is poor](https://caniuse.com/#feat=shadowdomv1). During the render cycle, DNA is able to replicate ShadowDOM implementation as well as for [styles](./styles).

For example, we may declare a custom `<dialog is="x-dialog">` tag with some layout features:

```ts
import { Component, customElements, html, property } from '@chialab/dna';

class Dialog extends Component {
    static get observedAttributes() {
        return ['title', 'content'];
    }

    @property() title = '';
    @property() content = '';

    render() {
        return html`
            <div class="layout-container">
                <div class="layout-header">
                    <h1>${this.title}</h1>
                </div>
                <div class="layout-content">
                    ${this.content}
                </div>
            </div>
        `;
    }
}

customElements.define('x-dialog', Dialog, { extends: 'dialog' });
```

This example has two problems:

* Content is passed as property, which is not good for semantic
* Body is interpolated as string, so HTML code is rendered as plain text.

Shadow DOM solves those two issues, rendering "soft" children of an element into the `<slot>` tag:

```diff
class Dialog extends Component {
-    static get observedAttributes() {
-        return ['title', 'content'];
-    }

-    @property() title = '';
-    @property() content = '';

    render() {
        return html`
            <div class="layout-container">
-                <div class="layout-header">
-                    <h1>${this.title}</h1>
-                </div>
                <div class="layout-content">
-                   ${this.content}
+                   <slot />
                </div>
            </div>
        `;
    }
}
```

Now, every "soft" child of the `<dialog is="x-dialog">` element is rendered into the layout:

```html
<dialog is="x-dialog">
    <h1>How to use DNA</h1>
    <img src="https://placekitten.com/300/200" />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
</dialog>
```

results

```html
<dialog is="x-dialog">
    <div class="layout-container">
        <div class="layout-content">
            <h1>How to use DNA</h1>
            <img src="https://placekitten.com/300/200" />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
        </div>
    </div>
</dialog>
```

We can also define multiple `<slot>` using a `name`, and reference them in the "soft" DOM using the `slot="name"` attribute, in order to handle more complex templates. The "unnamed" `<slot>` will colleced any element which does not specify a slot.

```diff
class Dialog extends Component {
    render() {
        return html`
            <div class="layout-container">
+               <div class="layout-header">
+                   <slot name="title" />
+               </div>
                <div class="layout-content">
                    <slot />
                </div>
            </div>
        `;
    }
}
```

Update the HTML sample adding `<h1>` to the `title` slot.

```diff
<dialog is="x-dialog">
-    <h1>How to use DNA</h1>
+    <h1 slot="title">How to use DNA</h1>
    <img src="https://placekitten.com/300/200" />
    <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
</dialog>
```

Now the resulting DOM would be:

```html
<dialog is="x-dialog">
    <div class="layout-container">
        <div class="layout-header">
            <h1>How to use DNA</h1>
        </div>
        <div class="layout-content">
            <img src="https://placekitten.com/300/200" />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing <em>elit</em>.</p>
        </div>
    </div>
</dialog>
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

Keyed elements are also added to the component's render context (the `$` getter):

```ts
import { Component, customElements, html } from '@chialab/dna';

class Form extends Component {
    render() {
        return html`<input key="firstName" placeholder="Eg. Alan" />`;
    }

    logValue() {
        console.log(this.$.firstName.value);
    }
}

customElements.define('x-form', Form, { extends: 'form' });
```

<aside class="note">

However, since reading and writing from the render context can be dangerous for the DOM reliability, [properties](./properties-and-attributes) are the recommended solution.

</aside>
