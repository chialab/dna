# Rendering

Templates are the main part of a component definition because they are used to render the state as well as instantiate and update child elements. During a render cycle, DNA uses an in-place DOM diffing algorithm to check which nodes are to update, create or remove. In order to efficiently compare DOM nodes, templates cannot be plain HTML strings and must be expressed using jsx or tagged template literals.

::: code-group

```tsx [jsx]
import { Component, customElement, h } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    render() {
        return <h1>Hello world!</h1>;
    }
}
```

```ts [html]
import { Component, customElement, html } from '@chialab/dna';

@customElement('hello-world')
class HelloWorld extends Component {
    render() {
        return html`<h1>Hello world!</h1>`;
    }
}
```

:::

## Expressions

When interpolating an expression, the following rules (based on the type of the result and context) are applied:

| Type        | Content                     | Attribute                                     |
| ----------- | --------------------------- | --------------------------------------------- |
| `string`    | Add/update as Text node     | Add as value                                  |
| `number`    | Add/update as Text node     | Add as value                                  |
| `boolean`   | /                           | Add/remove attribute, reference as property   |
| `null`      | /                           | Remove attribute                              |
| `undefined` | /                           | Remove attribute                              |
| `Node`      | Add/update node             | `.toString()` as value, reference as property |
| `array`     | Add/update iterated content | `.toString()` as value, reference as property |
| `object`    | `.toString()` as Text node  | `.toString()` as value, reference as property |
| `function`  | `.toString()` as Text node  | `.toString()` as value, reference as property |

### Content expression

::: code-group

```tsx [jsx]
<span>
    {this.firstName} {this.lastName}
</span>
```

```ts [html]
html`<span>${this.firstName} ${this.lastName}</span>`;
```

```ts [vdom]
h('span', null, this.firstName, ' ', this.lastName);
```

:::

### Attribute expression

::: code-group

```tsx [jsx]
<input
    name={this.name}
    disabled={this.disabled}
    required
/>
```

```ts [html]
html`<input
    name=${this.name}
    disabled=${this.disabled}
    required />`;
```

```ts [vdom]
h('input', { name: this.name, disabled: this.disabled, required: true });
```

:::

### Loops

When using loops it is necessary to keep in mind the [expressions](#expressions): in order to correctly render a table or a list of data, we need to interpolate an array of templates:

::: code-group

```tsx [jsx]
<ul>
    {this.items.map((item, index) => (
        <li>
            {index}. {item}
        </li>
    ))}
</ul>
```

```ts [html]
html`<ul>
    ${this.items.map((item, index) => html`<li>${index}. ${item}</li>`)}
</ul>`;
```

```ts [vdom]
h(
    'ul',
    null,
    this.items.map((item, index) => h('li', null, index, '. ', item))
);
```

:::

### Conditionals

You can create conditional expressions based on a boolean value using ternary operator or logical expression which results in a template or any other value:

::: code-group

```tsx [jsx]
<>
    {this.avatar && <img src={this.avatar} />}
    <h1>{this.title || 'Untitled'}</h1>
    {this.members.length ? `${this.members.length} members` : 'No members'}
</>
```

```ts [html]
html`
    ${this.avatar && html`<img src=${this.avatar} />`}
    <h1>${this.title || 'Untitled'}</h1>
    ${this.members.length ? html`${this.members.length} members` : 'No members'}
`;
```

```ts [vdom]
h(
    Fragment,
    null,
    this.avatar && h('img', { src: this.avatar }),
    h('h1', null, this.title || 'Untitled'),
    this.members.length ? `${this.members.length} members` : 'No members'
);
```

:::

### Promises

DNA exposes two directives to handle promises: the `$await` directive can be used to render a `Promise` result in the template as if you were using the `await` statement, while the `$until` directive is useful for status handling.

```tsx
import { $await, $until } from '@chialab/dna';

const json = fetch('/data.json')
    .then(() => response.json())
    .then((data) => data.map(({ name }) => html`<li>${name}</li>`));

<>
    {$until(json, 'Loading...')}
    {$await(json.then((data) => <ul>{data}</ul>).catch((error) => <div>Error: {error}</div>))}
</>;
```

## HTML content

By default, HTML strings will be interpolated as plain content. It means that a property `content` valorized as `"<h1>Hello</h1>"` will not create a H1 element, but it will print the code as is. In order to render dynamic html content, you can use the `$parse` directive:

```diff
import { html, $parse } from '@chialab/dna';

const content = '<h1>Hello</h1>';

-html`<x-label>${content}</x-label>`;
+html`<x-label>${$parse(content)}</x-label>`;
```

::: warning

Injecting uncontrolled HTML content may exposes your application to XSS vulnerabilities. Always make sure you are rendering secure code!

:::

## Signals

DNA templates can interpolate signals. When a signal changes, DNA updates **only the nodes bound to it**, without re-rendering the component that owns the template.

### The built-in implementation

DNA carries its own signals, so there is nothing to install and nothing to configure:

```ts
import { Signal } from '@chialab/dna';

const count = new Signal.State(0);
const double = new Signal.Computed(() => count.get() * 2);

const dispose = Signal.effect(() => {
    document.title = `${count.get()} items`;
});
```

`Signal.State` and `Signal.Computed` follow the shape of the [TC39 proposal](https://github.com/tc39/proposal-signals) — a value is read with `get()` and written with `set()` — with one difference that matters here: **changes are delivered synchronously**. The DOM is patched before the assignment that caused it returns, which is the same guarantee a component property gives.

`Signal.effect` runs a callback whenever one of the signals it reads changes, and returns a function that stops it. `Signal.untrack` reads without subscribing, `peek()` does the same for a single signal, and `Signal.batch` holds the effects back until a group of writes is done, so they settle once.

A derived value is computed only when something reads it, and an effect below it does not run when the computation returns the same result as before.


### Content

A signal interpolated as content is unwrapped and kept up to date:

::: code-group

```tsx [jsx]
const count = new Signal.State(0);
const double = new Signal.Computed(() => count.get() * 2);

render(
    <p>
        {count} doubled is {double}
    </p>,
    document.body
);

count.set(21); // renders "21 doubled is 42"
```

```ts [html]
const count = new Signal.State(0);
const double = new Signal.Computed(() => count.get() * 2);

render(html`<p>${count} doubled is ${double}</p>`, document.body);

count.set(21); // renders "21 doubled is 42"
```

:::

The `$signal` directive does the same thing explicitly, which is useful when a value may or may not be a signal.

### Attributes and properties

A signal can also be bound to an attribute, a property or an event listener. Only that attribute is updated on change: the node is never recreated.

```tsx
const label = new Signal.State('Save');
const disabled = new Signal.State(false);

<button
    disabled={disabled}
    aria-label={label}>
    {label}
</button>;
```

### The signals of a property

Every declared property is held by a signal, and a component reaches it through `signals`:

```tsx
@customElement('user-card')
class UserCard extends Component {
    @property() first = '';
    @property() last = '';

    // built once, and it follows both properties from then on
    private readonly full = new Signal.Computed(() => `${this.signals.first.get()} ${this.signals.last.get()}`);

    render() {
        return <h1>{this.full}</h1>;
    }
}
```

It is the property itself rather than a copy of it, so a derived value stays in step without an observer, and only the nodes bound to it are patched when it changes.

Reading a property the usual way inside a computation depends on it just the same — `new Signal.Computed(() => this.title.toUpperCase())` follows `title` — so `signals` is what you reach for when you need the signal as a value: to hand it to a template, to a child component, or to `Signal.effect`.

Assignment is unchanged: `this.title = 'x'` still validates the value, reflects the attribute, runs the observers and fires the event. Signals are read there, not written.

### What a render depends on

A component computes its template inside a computation, so it renders again when one of the signals it read has changed — the properties it touched, and any other signal it read along the way:

```tsx
const theme = new Signal.State('light');

@customElement('themed-box')
class ThemedBox extends Component {
    render() {
        return <div class={theme.get()} />;
    }
}
```

A property the template never reads no longer renders the component, and a group of writes made together — through `assign`, or between `collectUpdatesStart` and `collectUpdatesEnd` — renders it once.

`requestUpdate` and `forceUpdate` are unchanged: they ask for a render that no change caused.

Two declarations stop a render, as they always have. A property declared `update: false` says that changing it drives nothing, so reading it never depends on it and changing it leaves the DOM as it was — its signal is still there through [`signals`](#the-signals-of-a-property) for whoever wants to follow it on purpose. And `shouldUpdate` refusing a change leaves the DOM alone for the render that change would have caused.

### Computed properties

A property declared with `compute` derives its value from the signals its computation reads, instead of holding one:

```tsx
@customElement('user-card')
class UserCard extends Component {
    @property() first = '';
    @property() last = '';

    @property({
        compute(this: UserCard) {
            return `${this.first} ${this.last}`.trim();
        },
    })
    readonly full!: string;

    render() {
        return <h1>{this.signals.full}</h1>;
    }
}
```

The computation runs with the component as its `this`, so it reads the other properties the way the component would. It runs only when something reads the property, and only when one of the values it read has changed — reading `full` twice in a row computes it once.

The property is read-only: assigning it throws. It also cannot declare `attribute`, `event`, `observe`, `observers`, `defaultValue`, `setter`, `set` or `validate`, since each of those needs a write to hang off, and a computed property has none.

It replaces the pattern of a getter recomputed on every read paired with an observer that keeps something in sync: the value is memoized, and what it depends on is worked out on its own.

### Updates are synchronous

A signal is written and the DOM is patched before the assignment returns, the same way a component property behaves:

```ts
count.set(1);
element.textContent; // already up to date
```

Use `Signal.batch` when a group of writes belongs together, so that what depends on them runs once instead of once per write:

```ts
import { Signal } from '@chialab/dna';

Signal.batch(() => {
    firstName.set('Ada');
    lastName.set('Lovelace');
});
```

## Function components

Sometimes, you may want to break up a template into smaller parts without having to define new Custom Elements. In this case, you can use function components.

Function components are plain functions that receive properties as first argument and modifier methods as second argument. The function must return a template to render.

### The `useState` hook

The `useState` hook is a function that returns a tuple with the current state and a function to update it. The first argument is the initial state. When the state is updated, the function component is re-rendered.

The setter also accepts a function that receives the current state and returns the new one. Since it always reads the up-to-date value, this is the safest way to update a state that depends on its previous value:

```ts
const [count, setCount] = useState(0);
const increment = () => setCount((current) => current + 1);
```

::: code-group

```tsx [jsx]
function Row({ children, id }, { useState }) {
    const [selected, setSelected] = useState(false);
    const toggle = () => setSelected(!selected);

    return (
        <tr
            id={id}
            class={selected}
            onclick={toggle}>
            {...children}
        </tr>
    );
}

<table>
    <tbody>
        {items.map((item) => (
            <Row {...item}>
                <td>{item.id}</td>
                <td>{item.label}</td>
            </Row>
        ))}
    </tbody>
</table>;
```

```ts [html]
function Row({ children, id }, { useState }) {
    const [selected, setSelected] = useState(false);
    const toggle = () => setSelected(!selected);

    return html`<tr
        id=${id}
        class="${{ selected }}"
        onclick=${toggle}
        >${children}</tr
    >`;
}

html`<table>
    <tbody>
        ${items.map(
            (item) =>
                html`<${Row} ...${item}>
                    <td>${item.id}</td>
                    <td>${item.label}</td>
                </${Row}>`
        )}
    </tbody>
</table>`;
```

```ts [vdom]
function Row({ children, id }, { useState }) {
    const [selected, setSelected] = useState(false);
    const toggle = () => setSelected(!selected);

    return h(
        'tr',
        {
            id,
            class: { selected },
            onclick: toggle,
        },
        children
    );
}

h(
    'table',
    null,
    h(
        'tbody',
        null,
        items.map((item) => h(Row, item, h('td', null, item.id), h('td', null, item.label)))
    )
);
```

:::

### The `useRef` hook

The `useRef` hook returns a mutable object with a `current` property, preserved across renders. Unlike a state, updating `current` does **not** trigger a new render, so it is the right place for values that must survive a render without being part of the output: timer handles, previous values, instances of external libraries.

```ts
function Timer({}, { useRef, useEffect }) {
    const timer = useRef<number>();

    useEffect(() => {
        timer.current = setInterval(tick, 1000);
        return () => clearInterval(timer.current);
    }, []);

    return html`<button onclick=${() => clearInterval(timer.current)}>Stop</button>`;
}
```

::: tip

To keep a reference to a DOM element created by the component itself, prefer the [`useElement`](#the-useelement-hook) hook: it creates and memoizes the node in one step.

:::

### The `useMemo` hook

The `useMemo` hook is a function that returns a memoized value. The first argument is a function that returns the value to memoize. The second argument is an array of dependencies. When the dependencies change, the memoized value is re-computed.

::: code-group

```tsx [jsx]
function Rows({ items, filter }, { useMemo }) {
    const rows = useMemo(() => items.filter((item) => item.title.includes(filter)), [filter]);

    return rows.map(({ id }) => <Row id={id} />);
}

<table>
    <tbody>
        <Rows
            items={items}
            filter={filter}
        />
    </tbody>
</table>;
```

```ts [html]
function Rows({ items, filter }, { useMemo }) {
    const rows = useMemo(() => items.filter((item) => item.title.includes(filter)), [filter]);

    return rows.map(({ id }) => html`<${Row} id=${id} />)`;
}

html`<table>
    <tbody>
        <${Rows} items=${items} filter=${filter} />
    </tbody>
</table>`;
```

```ts [vdom]
function Rows({ items, filter }, { useMemo }) {
    const rows = useMemo(() => items.filter((item) => item.title.includes(filter)), [filter]);

    return rows.map(({ id }) => h(Row, { id });
}

h('table', null,
    h('tbody', null
        h(Rows, { items, filter })
    ),
)
```

:::

### The `useCallback` hook

The `useCallback` hook returns a memoized function: the same reference is returned across renders until one of the dependencies changes. It is the equivalent of `useMemo(() => callback, deps)`.

```ts
function Search({ onSearch }, { useCallback }) {
    const onInput = useCallback((event) => onSearch(event.target.value), [onSearch]);

    return html`<input type="search" oninput=${onInput} />`;
}
```

::: tip

DNA patches the real DOM and does not skip renders based on referential equality, so `useCallback` is not needed to "optimize" child components. Use it when the identity of the function matters: as a dependency of a `useEffect`, or to be able to remove a listener added manually.

:::

### The `useEffect` hook

The `useEffect` hook is a function that allows you to run side effects in your function component. The first argument is a function that will be called after the component has been rendered. The second argument is an array of dependencies. When the dependencies change, the effect is re-run.

It can also return a cleanup function that will be called before the effect is re-run or when the component is unmounted.

::: code-group

```tsx [jsx]
function Timer({ interval }, { useState, useEffect }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTime((t) => t + 1), interval);
        return () => clearInterval(id);
    }, [interval]);

    return <span>{time} seconds</span>;
}
```

```ts [html]
function Timer({ interval }, { useState, useEffect }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTime((t) => t + 1), interval);
        return () => clearInterval(id);
    }, [interval]);

    return html`<span>${time} seconds</span>`;
}
```

```ts [vdom]
function Timer({ interval }, { useState, useEffect }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTime((t) => t + 1), interval);
        return () => clearInterval(id);
    }, [interval]);

    return h('span', null, time, ' seconds');
}
```

:::

### The `useSignal` hook

The `useSignal` hook creates a [signal](#signals) that is preserved across renders.

Writing it does not render the function component by itself: what follows it is whatever reads it. This is what makes it different from `useState`, whose value belongs to that fragment alone and always re-renders it.

::: code-group

```tsx [jsx]
function Counter(props, { useSignal }) {
    const count = useSignal(0);

    return (
        <button
            type="button"
            on:click={() => count.set(count.peek() + 1)}>
            clicked {count} times
        </button>
    );
}
```

```ts [html]
function Counter(props, { useSignal }) {
    const count = useSignal(0);

    return html`<button
        type="button"
        @click=${() => count.set(count.peek() + 1)}>
        clicked ${count} times
    </button>`;
}
```

:::

Here `count` is interpolated, so only the text node is patched when it changes, and the handler reads it with `peek()` so that the component does not subscribe to it. Use [`useSignalValue`](#the-usesignalvalue-hook) when you need the value itself.

### The `useComputed` hook

The `useComputed` hook creates a [signal](#signals) derived from the ones its computation reads, preserved across renders.

Like `useMemo`, the computation is captured once: a computation that reads the props of the function component needs them in its dependency list. The signals it reads are tracked on their own and do not belong there.

::: code-group

```tsx [jsx]
function Total({ items, taxRate }, { useComputed }) {
    const total = useComputed(() => items.get().length * taxRate, [taxRate]);

    return <span>{total}</span>;
}
```

```ts [html]
function Total({ items, taxRate }, { useComputed }) {
    const total = useComputed(() => items.get().length * taxRate, [taxRate]);

    return html`<span>${total}</span>`;
}
```

:::

### The `useSignalValue` hook

The `useSignalValue` hook reads a [signal](#signals) and re-renders the function component whenever it changes.

Interpolating a signal already keeps a template up to date, but it only fills a hole in it. A signal read directly in the body is just a value: the function does not run inside a computation, so nothing notices it changing. `useSignalValue` gives you the value **and** the subscription, which is what a condition or a computation needs.

::: code-group

```tsx [jsx]
function Status({ connection }, { useSignalValue }) {
    const online = useSignalValue(connection);

    return online ? <span class="on">Connected</span> : <button type="button">Reconnect</button>;
}
```

```ts [html]
function Status({ connection }, { useSignalValue }) {
    const online = useSignalValue(connection);

    return online
        ? html`<span class="on">Connected</span>`
        : html`<button type="button">Reconnect</button>`;
}
```

:::

Only the fragment of the function component is re-rendered, not the component that contains it.

### The `useSignalEffect` hook

The `useSignalEffect` hook runs a callback whenever one of the [signals](#signals) it reads changes, for as long as the fragment lives. It runs once immediately, and the callback may return its own cleanup function.

It is the lifecycle-aware counterpart of `Signal.effect`: the subscription is stopped when the function component is unmounted, so you do not have to dispose of it yourself. The second argument is the usual list of dependencies, which tells when the effect has to be created again — the signals it reads are tracked automatically and do not belong there.

::: code-group

```tsx [jsx]
function Title({ prefix, count }, { useSignalEffect }) {
    useSignalEffect(() => {
        document.title = `${prefix}: ${count.get()} items`;
    }, [prefix]);

    return null;
}
```

```ts [html]
function Title({ prefix, count }, { useSignalEffect }) {
    useSignalEffect(() => {
        document.title = `${prefix}: ${count.get()} items`;
    }, [prefix]);

    return null;
}
```

:::

### The `useElement` hook

The `useElement` hook accepts the same arguments of `document.createElement` and returns a memoized element: the node is created once and preserved across renders, unless the tag name (or the `is` option) changes. It is useful for elements that own an internal state that must survive re-renders, like a `<canvas>` or a `<video>`.

::: code-group

```tsx [jsx]
function Chart({ data }, { useElement, useEffect }) {
    const canvas = useElement('canvas');

    useEffect(() => {
        draw(canvas.getContext('2d'), data);
    }, [data]);

    return canvas;
}
```

```ts [html]
function Chart({ data }, { useElement, useEffect }) {
    const canvas = useElement('canvas');

    useEffect(() => {
        draw(canvas.getContext('2d'), data);
    }, [data]);

    return html`${canvas}`;
}
```

```ts [vdom]
function Chart({ data }, { useElement, useEffect }) {
    const canvas = useElement('canvas');

    useEffect(() => {
        draw(canvas.getContext('2d'), data);
    }, [data]);

    return canvas;
}
```

:::

### The `useId` hook

The `useId` hook is a function that returns a unique ID for the component instance. This can be useful for associating form fields with their labels or for generating unique IDs for other purposes.

::: code-group

```tsx [jsx]
function MenuButton({}, { useId }) {
    const menuId = useId('menu');
    return <>
        <button aria-controls={menuId} aria-haspopup="menu">
            Menu
        </button>
        <ul id={menuId} role="menu">
            <li role="menuitem">Item 1</li>
            <li role="menuitem">Item 2</li>
            <li role="menuitem">Item 3</li>
        </ul>
    </>;
}
```

```ts [html]
function MenuButton({}, { useId }) {
    const menuId = useId('menu');
    return html`<>
        <button aria-controls=${menuId} aria-haspopup="menu">
            Menu
        </button>
        <ul id=${menuId} role="menu">
            <li role="menuitem">Item 1</li>
            <li role="menuitem">Item 2</li>
            <li role="menuitem">Item 3</li>
        </ul>
    </>`;
}
```

```ts [vdom]
function MenuButton({}, { useId }) {
    const menuId = useId('menu');
    return h(Fragment, null,
        h('button', { 'aria-controls': menuId, 'aria-haspopup': 'menu' }, 'Menu'),
        h('ul', { id: menuId, role: 'menu' },
            h('li', { role: 'menuitem' }, 'Item 1'),
            h('li', { role: 'menuitem' }, 'Item 2'),
            h('li', { role: 'menuitem' }, 'Item 3'),
        )
    );
}
```

:::

### The `useRenderContext` hook

The `useRenderContext` hook is a function that returns the current context of the DNA render cycle. The render context is an object that contains the informations about the virtual node as well as its position in the tree.

::: warning

It is highly discouraged to use the `useRenderContext` hook in function components.

:::

## Nodes and references

DNA can handle `Node` instances as children and hyper nodes as well. When passed as children, the very same node is positioned "as is" to the right place in the template:

```tsx
import { render } from '@chialab/dna';

const paragraph = document.createElement('p');
paragraph.textContent = 'Lorem Ipsum';

render(<div>{paragraph}</div>, document.body);
```

will render:

```html
<body>
    <div>
        <p>Lorem Ipsum</p>
    </div>
</body>
```

If you want to add some properties to the instance, you can pass it as an hyper node using the `ref` property. This is useful if you want to reference some nodes in your component:

```tsx
import { Component, customElement, listen } from '@chialab/dna';

@customElement('x-form')
class Form extends Component {
    input = this.onwenrDocument.createElement('input');

    render() {
        return (
            <form>
                <input
                    ref={this.input}
                    name="firstName"
                    placeholder="Alan"
                />
            </form>
        );
    }

    @listen('change', this.input)
    private onChange() {
        console.log(this.input.value);
    }
}
```

## Slotted children

Slotted children are nodes that semantically are children of the component, but they are rendered in a different position in the template.

For example, we may declare a custom `<dialog is="x-dialog">` tag with some layout features:

```tsx
import { customElement, HTML, property } from '@chialab/dna';

@customElement('x-dialog', {
    extends: 'dialog',
})
class Dialog extends HTML.Dialog {
    @property() title: string = '';
    @property() content: string = '';

    render() {
        return (
            <div class="layout-container">
                <div class="layout-header">
                    <h1>{this.title}</h1>
                </div>
                <div class="layout-content">{this.content}</div>
            </div>
        );
    }
}
```

This example has two problems:

- content is passed as property, which is not good for semantic
- body is interpolated as string, so HTML code is rendered as plain text.

DNA solves those two issues, rendering "soft" children of an element into the `<slot>` tag:

```diff
class Dialog extends extend(window.HTMLDialogElement) {
-    @property() title: string = '';
-    @property() content: string = '';

    render() {
        return <div class="layout-container">
-            <div class="layout-header">
-                <h1>${this.title}</h1>
-            </div>
            <div class="layout-content">
-               {this.content}
+               <slot />
            </div>
        </div>;
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

We can also define multiple `<slot>` using a `name`, and reference them in the "soft" DOM using the `slot="name"` attribute, in order to handle more complex templates. The "unnamed" `<slot>` will collected any element which does not specify a slot.

```diff
class Dialog extends extend(window.HTMLDialogElement) {
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

```tsx
<select>
    {this.items.map((item) => (
        <option
            key={item}
            value={item}>
            {item}
        </option>
    ))}
    <option
        key="last"
        value="other">
        Other
    </option>
</select>
```

In this example, once the last `<option>` element has been created, it never changes its DOM reference, since previous `<option>` generations always re-create the element instead of re-using the keyed one.

## Use unique IDs

Sometimes, you may need to generate unique IDs for your component instances, for example when associating form fields with their labels. DNA provides a `getUniqueId` utility function that can be used to generate such IDs.

```tsx
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-menu-button')
class MenuButton extends Component {
    render() {
        return <>
            <button aria-controls={this.getUniqueId('menu')} aria-haspopup="menu">
                Menu
            </button>
            <ul id={this.getUniqueId('menu')} role="menu">
                <li role="menuitem">Item 1</li>
                <li role="menuitem">Item 2</li>
                <li role="menuitem">Item 3</li>
            </ul>
        </>;
    }
}
```
