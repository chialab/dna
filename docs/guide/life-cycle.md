# Life cycle

DNA components follow the Custom Element life cycle specification, with the addition of the `propertyChangedCallback` and `render` methods. The complete list of methods is:

-   [initialize](#initialize)
-   [connectedCallback](#connectedcallback)
-   [disconnectedCallback](#disconnectedcallback)
-   [attributeChangedCallback](#attributechangedcallback)
-   [propertyChangedCallback](#propertychangedcallback)
-   [stateChangedCallback](#statechangedcallback)

## initialize

The initialize method is invoked at the end of the final constructor. It initializes inital property values and observers, as well as listeners.

```ts
import { Component, customElement } from '@chialab/dna';
import './MyToc';

@customElement('my-article')
export class MyArticle extends Component {
    toc = new MyToc();

    initialize() {
        super.initialize();
        this.toc.observe('active', (oldValue, newValue) => {
            this.scrollToSelector(newValue);
        });
    }

    scrollToSelector(selector: string) {
        // ...
    }
}
```

## connectedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):

> Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed. `connectedCallback` may be called once your element is no longer connected, use `Node.isConnected` to make sure.

```ts
import { Component, customElement } from '@chialab/dna';

@customElement('my-article')
export class MyArticle extends Component {
    parentSection: HTMLElement | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.parentSection = this.closest('section');
    }
}
```

## disconnectedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):

> Invoked each time the custom element is disconnected from the document's DOM.

```ts
import { Component, customElement } from '@chialab/dna';

@customElement('my-article')
export class MyArticle extends Component {
    parentSection: HTMLElement | null = null;

    disconnectedCallback() {
        super.disconnectedCallback();
        this.parentSection = null;
    }
}
```

## attributeChangedCallback

From [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks):

> Invoked each time one of the custom element's attributes is added, removed, or changed.

The method receives the attribute name as first argument, as well as the new value and the previous value (default `null`).

```ts
import { Component, customElement } from '@chialab/dna';

@customElement('my-article')
export class MyArticle extends Component {
    static get observedAttributes() {
        return ['tabindex', ...super.observedAttributes];
    }

    attributedChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null) {
        switch (attributeName) {
            case 'tabindex':
                if (oldValue === '-1') {
                    this.style.opacity = '0.5';
                } else {
                    this.style.opacity = '1';
                }
                break;
            default:
                super.attributeChangedCallback(attributeName, oldValue, newValue);
        }
    }
}
```

## propertyChangedCallback

This method is very similar to `attributeChangedCallback` and it is invoked each time one of the element's property is changed.

The signature is equivalent too: it receives the property name as first argument, as well as the new value and the previous value (default `undefined`).

## stateChangedCallback

The same of `propertyChangedCallback`, but for state properties.

## render

This method is invoked each time the component should be rendered. It returns a `Template` that will be rendered in the component's realm.

```tsx
import { Component, customElement } from '@chialab/dna';

@customElement('my-article')
export class MyArticle extends Component {
    render() {
        return <article>
            <h1>{this.title}</h1>
            <slot></slot>
            <time>{this.lastUpdate}</time>
        </article>;
    }
}
```

## shouldUpdate

This method is invoked each time a property or state property is changed. It returns a boolean value that indicates if the component should be updated or not. By default, it returns `true`.

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('my-article')
export class MyArticle extends Component {
    @property({ type: Date })
    lastUpdate = new Date();

    shouldUpdate(property, oldValue, newValue) {
        if (property === 'lastUpdate') {
            return newValue.valueOf() !== oldValue.valueOf();
        }
        return super.shouldUpdate(property, oldValue, newValue);
    }
}
```

## requestUpdate

This method is invoked each time a property or state property is changed and the component needs a re-render. If a re-render is already scheduled, the method does nothing.

```ts
import { Component, customElement, listen } from '@chialab/dna';

@customElement('my-article')
export class MyArticle extends Component {
    @listen('click', 'button')
    showMore() {
        this.parentSection.style.overflow = 'visible';
        this.requestUpdate();
    }
}
```

## forceUpdate

This method is invoked each time a property or state property is changed and the component should perform a re-render.
