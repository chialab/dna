# Properties and attributes

Component's properties are class fields that can be configured with the `property` decorator. As they represent the state of the element, every property change triggers a re-render of the component. Properties can be updated imperatively via JavaScript assignments or declaratively via template attributes. Every time a property had been update, it trigger the [`propertyChangedCallback`](./life-cycle#propertychangedcallback) method of the component.

## Declare a property

The preferred way to define a property is to use the `property` decorator on a class field declaration:

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property() age = null;
}
```

In the example above, the `age` field of every `Card` instance is observed.

Since class fields are supported by TypeScript and they are a proposal for JavaScript (Babel has a plugin for that), properties can be declared with the static `properties` getter:

```ts
import { Component, customElement } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    static get properties() {
        return {
            age: {},
        };
    }
}
```

You can also define properties programmatically with the prototyped `defineProperty` method:

```ts
import { Component, customElement } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    static get properties() {
        return {
            age: {},
        };
    }
}

const card = new Card();
card.defineProperty('age', {
    type: Number,
});
```

## Property descriptor

Properties can be configured passing a configuration object to the `property` decorator or as field value in the `properties` dictionary:

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({
        type: Number,
        validate(value) {
            return !isNaN(value) && value >= 0;
        },
    })
    age = null;
}
```

<aside class="note">

Keys of the configuration objects are all optional.

</aside>

### attribute

The DOM attribute bound to the property: every time the property had been updated, the new value is reflected to the specified attribute name in the DOM, as well as any attribute change will be synced with the property. Properties are automatically added to the `observedAttributes` list if using the `@property` decorator or `state` is a falsy value.

<aside class="note">

You can still set or update component's property value via attributes even when the property is not bound to any attribute.

</aside>

You can also customize the default converters between attributes and properties with `fromAttribute` and `toAttribute`.

```ts
@property({
    type: Date,
    attribute: 'birthdate',
    fromAttribute(value) {
        // attribute has been set as timestamp
        return new Date(parseInt(value));
    },
    toAttribute(value) {
        // set attribute as timestamp
        return value.getTime().toString();
    },
})
age = null;
```

### defaultValue

The initial value of the property. This will not trigger a `propertyChangedCallback` but it will update the bound attribute.

<aside class="note">

If you are using class fields, probably you won't use this configuration key.

</aside>

### type

A list of valid constructors for the property value. If the value is not an instance of the specified constructors, an exception is thrown.

### validate

A custom validation function for the property value. If the method returns a falsy value, an exception is thrown.

### observe

A function invoked each time the property had been updated. It receives the new value as first argument and the previous property value as second argument:

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({
        type: Number,
        observe(oldValue, newValue) {
            console.log(`Happy birthday! You are now ${newValue}`);
        },
    })
    age = null;
}
```

You can also pass an array of property observers using the **observers** configuration key instead of **observe**.

```ts
@property({
    type: Number,
    observers: [
        function(oldValue, newValue) {
            console.log(`Happy birthday! You are now ${newValue}`);
        },
    ],
})
age = null;
```

### event

The name of the event to trigger when property had been updated. If `true`, the event name will be composed by the property name with suffix `change` (eg. for the property `age`, the event name will be `agechange`). Also, `oldValue` and `newValue` properties are passed as event detail.

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({
        type: Number,
        event: true,
    })
    age = null;
}

const card = new Card();
card.addEventListener('agechange', (event) => {
    console.log(`Happy birthday! You are now ${event.detail.newValue}`);
}):
```

### getter

Define a custom getter function for the property. It receives the actual property value as argument and it can return the same reference or any new value.

<aside class="note">

The returned value of the **getter** function does not represent the actual property value, but it is used for bound attribute update and property access. In order to actually trigger a property change, the new value should be different from the real property value and not from the one returned by the **getter**. The `propertyChangedCallback` will receive the real property value too.

</aside>

### setter

Define a custom setter function for the property. It is invoked *before* property validation and observers and it receives the assigned value as first argument. Any returned value will be use to update the real property value.

## Property observers

Components have two methods to dynamically add and remove property observers: `observe` and `unobserve`. This methods can be used in the class context (`this.observe(...)`) or externally (`element.observe()`):

```ts
import { Component, customElement, property } from '@chialab/idom';

@customElement('x-card')
class Card extends Component {
    @property({ type: Number }) age;
}

const element = new Card();
const logChanges = (newValue, previousValue) => {
    console.log('age changed from', previousValue, 'to', newValue);
};

// add an observer listener
element.observe('age', logChanges);
// remove an observer listener
element.unobserve('age', logChanges);
// remove all listeners
element.unobserve('age');
```

## Sync with attributes

Attributes can be used to update the component properties and viceversa. Every time an attribute is added, removed or changed in a render cycle or using the [`DOM`](./render-a-component#manipulating-the-dom) helper.

### Template and JSX attributes

If you are using the `html` helper or JSX templates, the value of an attribute will be reflected to the property using the following logic:

* passing a **string** value via attribute:

```ts
@property({ type: String }) firstName;
```
```html
<x-card firstName="Alan" />
```
```js
console.log(element.firstName); // 'Alan'
```

* passing a **number** value:

```ts
@property({ type: Number }) age;
```
```html
<x-card age="24" />
```
```js
console.log(element.age); // 24
```

* passing a **boolean** value:

```ts
@property({ type: Boolean }) disabled = false;
```
```html
<x-button disabled />
```
```js
console.log(element.disabled); // true
```

* passing an **object** or **array** value:

```ts
@property({ type: Array }) items = [];
```
```html
<x-list items="['Alan','Bob','Charlie']" />
```
```js
console.log(element.items); // ['Alan', 'Bob', 'Charlie']
```

<aside class="note">

Removing the attribute from the template, the property will be set as `undefined`.

</aside>

### Attribute updates

When the property is bound to an attribute, it will reflect the value to the DOM attribute on every change if the type of the value is of type **string**, **number** or **boolean**.
Falsy values (`null`, `undefined`, `false`) will completely remove the attribute from the DOM node, while `true` always set the DOM attribute with empty value. For example:

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({ type: String, attribute: 'name' }) firstName;
    @property({ type: Number }) age;
    @property({ type: Boolean }) married = false;
}

const card = new Card();
card.firstName = 'Alan';
card.age = 24;
card.married = true;
```

will result in the DOM like:

```html
<x-card name="Alan" age="24" married />
```
