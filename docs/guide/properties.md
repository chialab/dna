# Reactive properties

Properties are class fields that are automatically in sync with element's DOM attributes. Every property change triggers a re-render of the component. Properties can be updated imperatively via JavaScript assignments or declaratively via template attributes. Every time a property had been update, it triggers the [`propertyChangedCallback`](./lifecycle#propertychangedcallback) method of the component.

State properties store component's data that can't be configured from the outside using attributes. Like properties, states changes trigger a new render cycle and they have the dedicated [`stateChangedCallback`](./lifecycle#statechangedcallback) method callback

## Declare a property

Properties can be defined using the `property` decorator on a class field declaration or using the static `properties` getter:

::: code-group

```ts [@property]
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property() age: number;
}
```

```ts [get properties]
import { Component, define } from '@chialab/dna';

const Card = define(
    'x-card',
    class Card extends Component {
        static get properties() {
            return {
                age: Number,
            };
        }
    }
);
```

:::

::: info

Once defined, the computed `observedAttributes` of the `Card` component will include the `age` attribute.

:::

## Declare a state

States can be defined using the `state` decorator on a class field declaration or using the static `properties` getter and configuring the field:

::: code-group

```ts [@state]
import { Component, customElement, state } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @state() collapsed: boolean;
}
```

```ts [get properties]
import { Component, define } from '@chialab/dna';

const Card = define(
    'x-card',
    class Card extends Component {
        static get properties() {
            return {
                collapsed: {
                    type: Boolean,
                    state: true,
                },
            };
        }
    }
);
```

:::

## Configuration

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
    age: number = null;
}
```

### attribute

The name of the attribute bound with the property. Every time the property had been updated, the new value is reflected to the specified attribute name in the DOM, as well as any attribute change will be synced with the property. If specified, it also works for `state` fields.

You can also customize the default converters between attributes and properties with `fromAttribute` and `toAttribute`.

```ts
import { Component, customElement, property } from '@chialab/dna';

class Card extends Component {
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
    age: number = null;
}
```

#### defaultValue

The initial value of the property.

::: info

If you are using class fields and decorators, probably you won't use this configuration key.

:::

#### type

A list of valid constructors for the property value. If the value is not an instance of the specified constructors, an exception is thrown.

#### validate

A custom validation function for the property value. If the method returns a falsy value, an exception is thrown.

#### event

The name of the event to trigger when property had been updated. If `true`, the event name will be composed by the property name with suffix `change` (eg. for the property `age`, the event name will be `agechange`). Also, `oldValue` and `newValue` properties are passed as event detail.

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({
        type: Number,
        event: true,
    })
    age: number;
}

const card = new Card();
card.addEventListener('agechange', (event) => {
    console.log(`Happy birthday! You are now ${event.detail.newValue}`);
}):
```

#### update

By default, every property change triggers a re-render of the component. If you want to avoid this behavior, you can set the `update` configuration key to `false`.

```ts
import { Component, customElement, state } from '@chialab/dna';

@customElement('x-toggle')
class Toggle extends Component {
    @state({
        update: false,
    })
    active: boolean;
}
```

## Accessors

### Decorated accessors

The `property` decorator can be used also for accessor fields. This is useful when you want to transform the value of an assignment before setting it, or you want to modify the inner value of a property when getted.  
For this scenario you need to use the `getInnerPropertyValue` and `setInnerPropertyValue` in order to execute the correct lifecycle:

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property()
    get phone(): string {
        return this.getInnerPropertyValue('phone');
    }
    set phone(value) {
        if (!value.startsWith('+') && !value.startsWith('00')) {
            value = `+44 ${value}`;
        }

        this.setInnerPropertyValue('phone', value);
    }
}
```

### Getter and setters

You can also configure a getter and a setter method along with the property declaration.

The **getter** function receives the actual property value as argument and it can return the same reference or any new value.  
The returned value of the getter does not represent the actual property value, but it is used for bound attribute update and property access. In order to actually trigger a property change, the new value should be different from the real property value and not from the one returned by the getter. The `propertyChangedCallback` will receive the inner property value too.

The **setter** function is invoked _before_ property validation and observers and it receives the assigned value as first argument. Any returned value will be use to update the inner property value.

```ts
import { Component, define } from '@chialab/dna';

const Card = define(
    'x-card',
    class Card extends Component {
        static get properties() {
            return {
                phone: {
                    type: String,
                    getter(innerValue) {
                        return innerValue;
                    },
                    setter(value) {
                        if (!value.startsWith('+') && !value.startsWith('00')) {
                            value = `+44 ${value}`;
                        }
                        return value;
                    },
                },
            };
        }
    }
);
```

## Observers

An observer is a function invoked each time the property had been updated. It receives the new value as first argument and the previous property value as second argument:

Components have two methods to dynamically add and remove property observers: `observe` and `unobserve`. This methods can be used in the class context (`this.observe(...)`) or externally (`element.observe()`):

```ts
import { Component, customElement, property } from '@chialab/idom';

@customElement('x-card')
class Card extends Component {
    @property({ type: Number }) age: number;
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

Observers can also be defined using the `observe` decorator:

```ts
import { Component, customElement, observe, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({ type: Number }) age: number;

    @observe('age')
    private ageChanged(oldValue: number, newValue: number) {
        console.log(`Happy birthday! You are now ${newValue}`);
    }
}
```

or directly using the property definition:

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
    age: number;
}
```

You can also observe multiple properties at one time:

```ts
import { Component, customElement, observe, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({ type: String }) firstName: string;
    @property({ type: String }) lastName: string;
    @property({ type: Date }) birthdate: Date;

    @observe('fisrtName')
    @observe('lastName')
    @observe('birthdate')
    private validateData() {
        // ...
    }
}
```

## Attributes

Attributes can be used to update the component properties and viceversa. Every time an attribute is added, removed or changed in a render cycle or using the `.setAttribute` method.

### Template and JSX attributes

If you are using the `html` helper or JSX templates, the value of an attribute will be reflected to the property using the following logic:

- passing a **string** value via attribute:

```ts
@property({ type: String }) firstName: string;
```

```html
<x-card firstName="Alan" />
```

```js
card.firstName; // "Alan"
```

- passing a **number** value:

```ts
@property({ type: Number }) age: number;
```

```html
<x-card age="24" />
```

```js
card.age; // 24
```

- passing a **boolean** value:

```ts
@property({ type: Boolean }) disabled: boolean = false;
```

```html
<x-button disabled />
```

```js
button.disabled; // true
```

- passing an **object** or **array** value:

```ts
@property({ type: Array }) items: string[] = [];
```

```html
<x-list items="['Alan','Bob','Charlie']" />
```

```js
list.items; // ["Alan", "Bob", "Charlie"]
```

- removing the attribute from the template will set the property value as `undefined`.

### Attribute updates

When the property is bound to an attribute, it will reflect the value to the DOM attribute on every change if the type of the value is of type **string**, **number** or **boolean**.
Falsy values (`null`, `undefined`, `false`) will completely remove the attribute from the DOM node, while `true` always set the DOM attribute with empty value. For example:

```ts
import { Component, customElement, property } from '@chialab/dna';

@customElement('x-card')
class Card extends Component {
    @property({ type: String, attribute: 'name' }) firstName: string;
    @property({ type: Number }) age: number;
    @property({ type: Boolean }) married: boolean = false;
}

const card = new Card().assign({
    firstName: 'Alan',
    age: 24,
    married: true,
});
```

will result in the DOM like:

```html
<x-card
    name="Alan"
    age="24"
    married />
```
