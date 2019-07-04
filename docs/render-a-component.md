# Render a Component

The `render` helper is used by DNA components to generate their templates, but it can be used to add a component or a template in a specific point of the DOM tree, for example to instantiate the root component of your application:

```ts
import { render, define, Component } from '@chialab/dna';

class MyApp extends Component { ... }

define('my-app', MyApp);
const element = new MyApp();
render(document.body, element);
```

During the render cycle, DNA execs an in-place DOM diffing to update already existing nodes and remove the unused ones, so you can safely re-render a template.

<aside class="note">

Make sure to render the component in an empty root: at the end of the cycle, DNA will remove any node outside the template, including elements and texts of the original HTML document.

</aside>

This function accepts the render root node as first argument and a node or a template as second one. Another way to instantiate the `MyApp` component is:

```ts
import { render, define, html, Component } from '@chialab/dna';

class MyApp extends Component { ... }

define('my-app', MyApp);
render(document.body, html`<my-app />`);
```

It also work for [native tag extensions](./define-a-component#extending-native-elements):

```ts
define('my-app', MyApp, { extends: 'article' });
render(document.body, html`<article is="my-app" />`);
```

You can use the `render` method to inject more complex templates too:

```ts
import { render, html } from '@chialab/dna';

render(document.body, html`<div class="wrapper">
    <h1>Title</h1>
</div>`);
```

## Manipulating the DOM

Since DNA does not require any Custom Elements polyfill, the [life cycle](./life-cycle) is delegated to the Virtual DOM which uses the `DOM` helper under the hood. This helper invokes the life cycle methods for each DOM operation like `appendChild`, `removeChild` etc.
If you want to manipulate the DOM tree outside of a render cycle, always use `DOM` methods instead of the `Element` prototype:

```ts
// ✘ DON'T
parentElement.appendChild(childElement);
// ✔︎ DO!
DOM.appendChild(parentElement, childElement);
```

All methods inherit the prototype signature with the context node as first argument:

| `Element.prototype` | `DOM` helper |
| :------------------- | :------------ |
| `appendChild(newChild)` | `appendChild(parent, newChild)` |
| `removeChild(newChild)` | `removeChild(parent, newChild)` |
| `insertBefore(newChild, refChild)` | `removeChild(parent, newChild, refChild)` |
| `replaceChild(newChild, oldChild)` | `removeChild(parent, newChild, oldChild)` |
| `getAttribute(qualifiedName)` | `getAttribute(element, qualifiedName)` |
| `hasAttribute(qualifiedName)` | `hasAttribute(element, qualifiedName)` |
| `setAttribute(qualifiedName, value)` | `setAttribute(element, qualifiedName, value)` |
| `removeAttribute(qualifiedName)` | `removeAttribute(element, qualifiedName)` |

<aside class="note">

Please note that all DNA Components already wrap those methods with the `DOM` helper.

</aside>
