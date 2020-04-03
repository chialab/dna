# Use in React

Web Components support in React is [really poor](https://it.reactjs.org/docs/web-components.html): you can instantiate simple nodes with simple attributes, but you can't give them referenced properties or slotted children. DNA exposes a module that automatically wrap the Custom Element into a React Component, with a full TypeScript support.

First of all, make sure you have DNA installed, as well as the React peer dependency.

```sh
$ npm i @chialab/dna react react-dom
```

Then, somewhere in your app root import the React adapter:

```ts
import '@chialab/dna/react';
```

Now, you can access the `.React` function from the component constructor:

**dialog.ts**
```ts
import { Component, html, property, define } from '@chialab/dna';

class Dialog extends Component {
    static get observedAttributes() {
        return ['title'];
    }

    @property() title = '';

    render() {
        return html`
            <div class="layout-container">
                <div class="layout-header">
                    <h1>${this.title}</h1>
                </div>
                <div class="layout-content">
                    <slot />
                </div>
            </div>
        `;
    }
}

define('x-dialog', Dialog, { extends: 'dialog' });
```

**app.ts**
```ts
import React from 'react';
import ReactDOM from 'react-dom';
import '@chialab/dna/react';
import { Dialog } from './dialog';

ReactDOM.render(
    <Dialog.React title="Hello world!">
        <p>...</p>
    </Dialog.React>,
    document.body
);
```

<aside class="note">

Probably, your app is configured to use React JSX, please make sure to use already compiled templates or the `html` helper in DNA components in order to avoid conflicts.

</aside>
