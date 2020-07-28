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

The DNA's render algorithm has builtin support for `Promise`s in template: it interpolates the result of a `Promise` as if you were using the `await` statement and provides the helper `until` for status handling:

```ts
import { until } from '@chialab/dna';

const json = fetch('/data.json')
    .then(() => response.json())
    .then((data) => data.map(({ name }) => html`<li>${name}</li>`));

html`
    ${until(json, 'Loading...')}
    ${json
        .then((data) => html`<ul>${data}</ul>`)
        .catch((error) => html`<div>Error: ${error}</div>`)
    }
`
```

<details>
<summary>JSX</summary>
<div>

```ts
import { until } from '@chialab/dna';
<>
    {until(json, 'Loading...')}
    {json
        .then((data) => <ul>{data}</ul>)
        .catch((error) => <div>Error: {error}</div>)}
</>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>


```ts
h(Fragment, null,
    until(json, 'Loading...'),
    json
        .then((data) => h('ul', null, data))
        .catch((error) => h('div', null, 'Error ', error)),
)
```
</div>
</details>

### Observables

As well as `Promise`s, DNA treats [`Observable`](https://rxjs-dev.firebaseapp.com/)s like as first class references. You can interpolate [`Observable`]s' values or pipe a template:

```ts
import { timer, interval } from 'rxjs';
import { take } from 'rxjs/operators';

const clock$ = timer(Date.now());
const numbers$ = interval(1000).pipe(take(4));

html`
    Timer: ${timer$},
    Numbers: ${numbers$.pipe((val) => val % 2 ? html`<strong>${val}</strong>` : val)}
`
```

<details>
<summary>JSX</summary>
<div>

```ts
<>
    Timer: {timer$},
    Numbers: {numbers$.pipe((val) => val % 2 ? <strong>{val}</strong> : val)}
</>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>


```ts
h(Fragment, null,
    'Timer: ',
    timer$,
    ', Numbers',
    numbers$.pipe((val) => val % 2 ? h('strong', null, val) : val)
)
```
</div>
</details>

### Functions

Sometimes, you may want to break up templates in smaller parts without having to define new Custom Elements. In this cases, you can pass properties to template functions:

```ts
function Row({ children, id }) {
    return html`<tr id=${id}>${children}</tr>`;
}

html`<table>
    <tbody>
        ${store.data.map((item) => html`<${Row} ...${item}>
            <td>${item.id}</td>
            <td>${item.label}</td>
        </>`)}
    </tbody>
</table>`
```

<details>
<summary>JSX</summary>
<div>

```ts
function Row({ children, id }, context, refresh) {
    return <tr id=${id}>${children}</tr>;
}

<table>
    <tbody>
        {store.data.map((item) => <Row ...item>
            <td>{item.id}</td>
            <td>{item.label}</td>
        </Row>}
    </tbody>
</table>
```

</div>
</details>

<details>
<summary>Raw</summary>
<div>


```ts
function Row({ children, id }, context, update) {
    return h('tr', { id: id }, ...children);
}

h('table', null,
    h('tbody', null
        store.data.map((item) => h(Row, ...item,
            h('td', null, item.id)
            h('td', null, item.label)
        ))
    ),
)
```
</div>
</details>

Template functions are also useful for micro views updates: similar to React Hooks, they receive a context and an updater function in order to refresh a part of the DOM:

```ts
function Row({ children, store, id }, context, update) {
    const select = () => {
        store.select(id);
        update();
    };

    return html`
        <tr id=${id} onclick=${select}>
            ${children}
        </tr>
    `;
}
```

### Nodes

DNA can handle `Node` instances as children and hyper nodes as well. When passed as children, the very same node is positioned "as is" to the right place in the template:

```ts
import { DOM, render } from '@chialab/dna';

let paragraph = DOM.createElement('p');
paragraph.textContent = 'Lorem Ipsum';

render(document.body, html`<div>${paragraph}</div>`);
```

will render:

```html
<body>
    <div>
        <p>Lorem Ipsum</p>
    </div>
</body>
```

If you want to add some properties to the instance, you can pass it as hyper node. This is useful if you want to reference some nodes in your component:

```ts
import { DOM, Component, html, customElements } from '@chialab/dna';

class Form extends Component {
    static get listeners() {
        return {
            'change input'(this: Form) {
                console.log(this.input.value);
            },
        };
    }

    input = DOM.createElement('input');

    render() {
        return html`<form>
            <${this.input} name="firstName" placeholder="Alan" />
        </form>`;
    }
}

customElements.define('x-form', Form);
```

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
