# Backward compatibility and migration

DNA 3 comes with a compatibility layer with the 2.x version. It is called `compat` and it is available as module importing the `@chialab/dna/compat.js` script:

```sh
$ npm uninstall @dnajs/idom
$ npm install @chialab/dna @chialab/proteins htm
```

```diff
- import { BaseComponent, define } from '@dnajs/idom';
+ import { BaseComponent, define } from '@chialab/dna/compat.js';
```

You can also use module alias in your bundler ([webpack](https://webpack.js.org/configuration/resolve/), [rollup](https://github.com/rollup/plugins/tree/master/packages/alias)) in order to try out the new version without code changes.

⚠️⚠️⚠️ Some features are not available in the compatibility layers and some breaking changes were needed, so we recommend to follow the [migration path](#migration).

### Deprecations in the compatibility layer

* `mix` have been deprecated. Import the reference directly from `@chialab/proteins`.
* Function templates have been deprecated and will log a warn in the console
* Zero and empty string values are NOT rendered in templates but they will log a warn in the console
* `events` getter has been deprecated in favour of the `listeners` getter
* `props` helper has been deprecated in favour of the property descriptor
* stringed prototype references for property observer or event listener have been deprecated and will log a warn in the console
* Component `trigger` method has been deprecated in favour of the `dispatchEvent` method and will log a warn in the console
* Component `delegate` method has been deprecated in favour of the `delegateEventListener` method and will log a warn in the console
* Component `undelegate` method has been deprecated in favour of the `undelegateEventListener` method and will log a warn in the console
* Component `observeProperty` method has been deprecated in favour of the `observe` method and will log a warn in the console
* Component `unobserveProperty` method has been deprecated in favour of the `unobserve` method and will log a warn in the console

### Changes in the compatibility layer

* Removing a node from the document will not remove its event listeners
* Some event validation error messages have been changed
* Some component constructor error messages have been changed
* Some properties validation error messages have been changed

## Migration

This is a list of changes requested to completely migrate to the DNA 3.0 version.

* Install and use the new `@chialab/dna` instead of the `@dnajs/idom` module
* Extends the `Component` constructor instead of the `BaseComponent` class

```diff
- import { BaseComponent } from '@dnajs/idom';
+ import { Component } from '@chialab/dna';

- class Card extends BaseComponent {
+ class Card extends Component {
```

* Replace stringed prototype references with real references

```diff
get events() {
    return {
-        'click': 'method',
+        'click': this.method,
    };
}
```

* Replace `events` getters with the new [`listeners` getter](./events#declarative-event-listeners)

```diff
- get events() {
+ get listeners() {
```

* Replace the `prop` helper with a [property descriptor]([Declare a property](./properties-and-attributes#declare-a-property))

```diff
get properies() {
    return {
-        name: prop(String).default('Hello').observe('onNameChanged').dispatch('changename'),
+        name: {
+           types: [String],
+           defaultValue: 'Hello',
+           observers: [
+               this.onNameChanged,
+               (oldValue, newValue) => this.dispatchEvent('changename', { oldValue, newValue })
+           ]
+        },
    };
}
```

* Replace `trigger` calls

```diff
- this.trigger('event', details);
+ this.dispatchEvent('event', details);
```

* Replace `delegate` calls with `delegateEventListener`

```diff
- this.delegate('event', 'button' , listener);
+ this.delegateEventListener('event', 'button' , listener);
```

* Replace `undelegate` calls with `undelegateEventListener`

```diff
- this.undelegate('event', 'button' , listener);
+ this.undelegateEventListener('event', 'button' , listener);
```

* Replace `observeProperty` calls with `observe`

```diff
- this.observeProperty('name', () => {});
+ this.observe('name', () => {});
```

* Replace `unobserveProperty` calls with `unobserve`

```diff
- this.unobserveProperty('name', () => {});
+ this.unobserve('name', () => {});
```

* Convert `template` getter to `render` method

```diff
-get template() {
-    return () => <div>Hello</div>;
-}
+render() {
+    return <div>Hello</div>;
+}
```

* Remove all `DOM.getNodeComponent`, `DOM.getComponentNode` and `.node` references

```diff
-DOM.getNodeComponent(document.querySelector('.x-input')).value = 'Web Components';
+document.querySelector('.x-input').value = 'Web Components';
-DOM.getComponentNode(app).setAttribute('title', 'Web Components');
+app.setAttribute('title', 'Web Components');
-app.node.setAttribute('title', 'Web Components');
+app.setAttribute('title', 'Web Components');
```

* Life cycle hook invokations have been align with specification: now the `attributeChangedCallback` is called on every `setAttribute` even if the new value is the same of the old one, as well as `connectedCallback` is invoked on `appendChild` event if the node is already the last of the parent.
