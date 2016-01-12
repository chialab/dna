![Logo](https://gitlab.com/dna-components/dna-design/raw/master/logos/logo-raster-128.png)

# DNA Components
Write your set of (Web) Components using [ES2015](https://github.com/lukehoban/es6features), [templates](http://www.2ality.com/2015/01/template-strings-html.html) and (optionally) [Sass](http://sass-lang.com/).
- [DNA Component](#DNAComponent)
- [Event Component](#DNAEventComponent)
- [Attributes Component](#DNAAttributesComponent)
- [Template Component](#DNATemplateComponent)
- [Style Component](#DNAStyleComponent)
- [Mixed Component](#DNAMixedComponent)
- [Base Component](#DNABaseComponent)

## DNAComponent
This is a base model for custom components. Use and extend `DNAComponent` for all `DNA` elements.

## DNAEventComponent
Simple Custom Component with `addEventListener` polyfill, a `dispatchEvent` wrapper named `trigger` and children event delagation.

**Interface**
- `trigger`: trigger an Event with some custom data.

**Example**

seed-component.next.js

```js
import { DNAEventComponent } from 'dna/components';
export class SeedComponent extends DNAEventComponent {
    get tagName() {
        return 'seed-component'
    }
}
```

app.next.js

```js
import { DNAComponents } from 'dna/components';
import { SeedComponent } from './components/seed-component.next.js';
// Register the component
var Seed = DNAComponents.register(SeedComponent);
// Instantiate a new Seed
let seed = new Seed();
// Attach event
seed.addEventListener('sprout', function (ev) {
    console.log(ev.detail.owner + '\'s seed is growing!');
});
// Dispatch event
seed.trigger('sprout', { owner: 'Gustavo' });
```

This script will prompt: `Gustavo's seed is growing!`.

## DNAAttributesComponent

TODO

## DNATemplateComponent

TODO

## DNAStyleComponent

TODO

## DNAMixedComponent
This is another model to use to create DNA Custom Components mixing a list of prototypes.

Add some some prototype to the `behaviors` property of the Class:

**Interface**
- `get behaviors`: a list of prototypes to mixin.

**Example**

seed-component.next.js

```js
import { DNAMixedComponent, DNAEventComponent } from 'dna/components';
export class SeedComponent extends DNAMixedComponent {
    get behaviors() {
        return [DNAEventComponent];
    }
}
```

app.next.js

```js
import { DNAComponents } from 'dna/components';
import { SeedComponent } from './components/seed-component.next.js';
// Register the component
var Seed = DNAComponents.register(SeedComponent);
```

After the initialization, the `SeedComponent` prototype incorporates the `DNAEventComponent.trigger` method!

## DNABaseComponent
This is a base model which extends `DNAMixedComponent` and automatically add `DNAEventComponent`, `DNAAttributesComponent` and `DNATemplateComponent` as behavior.

**Example**

seed-component.next.js

```js
import { DNABaseComponent, DNAComponents } from 'dna/components';
import template from './seed-component.html';
import css from './seed-component.scss';

export class SeedComponent extends DNABaseComponent {
    static get tagName() {
        return 'seed-component'
    }

    static get template() {
        return template;
    }

    static get css() {
        return css;
    }

    createdCallback() {
        DNABaseComponent.prototype.createdCallback.apply(this, arguments);
        this.classList.add('seed-component-scope');
    }

    attachedCallback() {
        DNABaseComponent.prototype.attachedCallback.apply(this, arguments);
        this.style.width = this.parentNode.offsetWidth + 'px';
    }

    myCustomMethod() {
        return 5 * 5;
    }
}

```

seed-component.scss

```scss
.seed-component {
    font-family: sans-serif;
    span {
        color: red;
    }
    p {
        font-size: 2em;
    }
}
```

seed-component.html

```html
<h1>Seed component :)</h1>
<span>${this.myCustomMethod()}</span>
```

app.next.js

```js
import { DNAComponents } from 'dna/components';
import { SeedComponent } from './components/seed/seed-component.next.js';
// Register the component
var Seed = DNAComponents.register(SeedComponent);
document.body.appendChild(new Seed());
```

--------------------------------------------------------------------------------

## Build
Have a look [here](https://gitlab.com/dna-components/dna-docs/blob/master/tutorials/build.md).
