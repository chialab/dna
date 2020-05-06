# Use in React

Web Components support in React is [really poor](https://it.reactjs.org/docs/web-components.html): you can instantiate simple nodes with simple attributes, but you can't give them referenced properties or slotted children. DNA exposes a module that automatically wrap the Custom Element into a React Component, with a full TypeScript support.

First of all, make sure you have DNA installed, as well as the React peer dependency.

```sh
$ npm i @chialab/dna react react-dom
```

Then, you can import the DNA `Root` component and use it as wrapper for DNA components:

**dialog.ts**
```ts
import { Component, customElements, html, property } from '@chialab/dna';

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

customElements.define('x-dialog', Dialog, { extends: 'dialog' });

declare namespace JSX {
    interface IntrinsicElements {
        'x-dialog': Dialog;
    }
}
```

**app.ts**
```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from '@chialab/dna/react';
import './dialog';

ReactDOM.render(
    <Root>
        <dialog is="x-dialog" title="Hello world!">
            <p>...</p>
        </dialog>
    </Root>,
    document.body
);
```

<aside class="note">

Probably, your app is configured to use React JSX, please make sure to use already compiled templates or the `html` helper in DNA components in order to avoid conflicts.

</aside>


<aside class="note">

In order to enable type checking on JSX you need to [declare `IntrinsicElements`](./Tools#typescript-jsx-intrinsicelements).

</aside>
