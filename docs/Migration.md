# Backward compatibility and migration

DNA 3 comes with a compatibility layer with the 2.x version. It is called `compat` and it is available as module importing the `@chialab/dna/compat` script:

```sh
$ npm uninstall @dnajs/idom
$ npm install @chialab/dna @chialab/proteins
```

```diff
- import { BaseComponent, define } from '@dnajs/idom';
+ import { BaseComponent, define } from '@chialab/dna/compat';
```

You can also use module alias in your bundler ([webpack](https://webpack.js.org/configuration/resolve/), [rollup](https://github.com/rollup/plugins/tree/master/packages/alias)) in order to try out the new version without code changes.

⚠️⚠️⚠️ Some features are not available in the compatibility layers and some breaking changes were needed, so we recommend to follow the [migration path](#migration).

## Deprecations in the compatibility layer

#### `PREFER_RENDER`

The `template` getter has been deprecated. Use the `render` method instead.

```diff
-get template() {
-    return () => <div>Hello</div>;
-}
+render() {
+    return <div>Hello</div>;
+}
```

#### `PREFER_STYLE`

The `css` getter has been deprecated. Use the `render` method instead.

```diff
-get css() {
-    return ':host { color: red; }';
-}
+render() {
+    return <style>:host { color: red; }</style>;
+}
```

#### `PREFER_PROPERTY_DESCRIPTOR`

The `prop` helper has been deprecated in favour of the [property descriptor](./properties-and-attributes#property-descriptor).

```diff
get properies() {
    return {
-        name: prop(String).default('Hello').observe('onNameChanged').dispatch('changename'),
+        name: {
+           type: [String],
+           defaultValue: 'Hello',
+           observers: [
+               this.onNameChanged,
+               (oldValue, newValue) => this.dispatchEvent('changename', { oldValue, newValue })
+           ]
+        },
    };
}
```

#### `PREFER_LISTENERS`

The `events` getter has been deprecated in favour of the [`listeners` getter](./events#declarative-event-listeners).

```diff
- get events() {
+ get listeners() {
    return {
        click: this.onClick,
    }
}
```

#### `LISTENER_STRING_REFERENCE`

References to class methods using the name as string has been deprecated. Use direct reference to prototype methods.

```diff
get listeners() {
    return {
-        'click': 'onClick',
+        'click': this.onClick,
    };
}
```

#### `PREFER_OBSERVE`

The `observeProperty` method has been deprecated in favour of the [`observe` method](./properties-and-attributes#property-observers).

```diff
- this.observeProperty('name', () => {});
+ this.observe('name', () => {});
```

#### `PREFER_UNOBSERVE`

The `unobserveProperty` method has been deprecated in favour of the [`unobserve` method](./properties-and-attributes#property-observers).

```diff
- this.unobserveProperty('name', () => {});
+ this.unobserve('name', () => {});
```

#### `PREFER_DISPATCH_EVENT`

The `trigger` method has been deprecated in favour of the [`dispatchEvent` method](./events#dispatching-events).

```diff
- this.trigger('event', details);
+ this.dispatchEvent('event', details);
```

#### `PREFER_DELEGATE_EVENT_LISTENER`

The `delegate` method has been deprecated in favour of the [`delegateEventListener` method](./events#delegation).

```diff
- this.delegate('event', 'button' , listener);
+ this.delegateEventListener('event', 'button' , listener);
```

#### `PREFER_UNDELEGATE_EVENT_LISTENER`

The `undelegate` method has been deprecated in favour of the [`undelegateEventListener` method](./events#delegation).

```diff
- this.undelegate('event', 'button' , listener);
+ this.undelegateEventListener('event', 'button' , listener);
```

#### `RENDER_HELPER`

The `render` helper changed the signature, now it accepts element instances instead of constructors:

```diff
- render(document.body, Article, { title: 'My first blog post' });
+ render(document.body, new Article({ title: 'My first blog post' }));
```

#### `TEMPLATE_FUNCTIONS`

Template function have been deprecated since they are now useless (invoking the `h` helper is now side-effects free).

```diff
- return () => <h1>Hello</h1>;
+ return <h1>Hello</h1>;
```

#### `TEMPLATE_EMPTY_VALUES`

Zero and empty strings are no more considered falsy values. It means that while in DNA 2 the interpolation of `0` results as an empty template, DNA 3 will print `'0'` in text nodes and attributes.

#### `PREFER_INSTANCE`

Helpers `DOM.getNodeComponent` and `DOM.getComponentNode` and `node` getter have been deprecated since they are now useless. The node **is** the component.

```diff
-DOM.getNodeComponent(document.querySelector('.x-input')).value = 'Web Components';
+document.querySelector('.x-input').value = 'Web Components';

-DOM.getComponentNode(app).setAttribute('title', 'Web Components');
+app.setAttribute('title', 'Web Components');

-app.node.setAttribute('title', 'Web Components');
+app.setAttribute('title', 'Web Components');
```

#### `AVOID_MIXINS`

Base class composability using mixins has been deprecated. Always use the `Component` class.

#### `PROXY_HELPER`

The `proxy` helper have been deprecated since it is now useless, see the [`extend` method](./helpers#extend).

#### `TRUST_HELPER`

The `trust` helper has been deprecated. Use the `html` helper instaed.

```diff
-import { trust } from '@chialab/dna/compat';
+import { html } from '@chialab/dna/compat';

-<div>{trust('<h1>Title</h1'>')}</div>;
+<div>{html('<h1>Title</h1'>')}</div>;
```

#### `MIX_HELPER`

The `mix` has been deprecated. Import the reference directly from [`@chialab/proteins`](https://www.npmjs.com/package/@chialab/proteins).

```diff
-import { mix } from '@chialab/dna/compat';
+import { mix } from '@chialab/proteins';
```

#### `EXTEND_BUILTIN`

Custom Elements that extend builtin elements should also extend their constructors.

```diff
-import { BaseComponent } from '@chialab/dna/compat';
+import { mixin, extend, window } from '@chialab/dna/compat';

-export class XButton extends BaseComponent {
+export class XButton extends mixin(extend(window.HTMLButtonElement)) {
```

#### `USE_REGISTRY`

Custom Elements should be defined using the `customElements` registry.

```diff
-import { define } from '@chialab/dna/compat';
+import { customElements } from '@chialab/dna/compat';

-define('x-dialog', Dialog);
+customElements.define('x-dialog', Dialog);
```

## Breaking changes in the compatibility layer

* Removing a node from the document will not remove its event listeners
* Some event validation error messages have been changed
* Some component constructor error messages have been changed
* Some properties validation error messages have been changed
* Life cycle hook invokations have been align with specification: now the `attributeChangedCallback` is called on every `setAttribute` even if the new value is the same of the old one, as well as `connectedCallback` is invoked on `appendChild` event if the node is already the last of the parent.

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

* Convert `template` getter to `render` method ([PREFER_RENDER](./#prefer_render))

* Convert `css` getter to `<style>` elements in `render` method ([PREFER_STYLE](./#prefer_style))

* Replace the `prop` helper with a property descriptor ([PREFER_PROPERTY_DESCRIPTOR](./#prefer_property_descriptor))

* Replace `events` getters with the new `listeners` getter ([PREFER_LISTENERS](./#prefer_listeners))

* Replace stringed prototype references with real references in event listeners ([LISTENER_STRING_REFERENCE](./#listener_string_reference))

* Replace `trigger` references with `dispatchEvents` ([PREFER_DISPATCH_EVENT](./#prefer_dispatch_event))

* Replace `delegate` calls with `delegateEventListener` ([PREFER_DELEGATE_EVENT_LISTENER](./#prefer_delegate_event_listener))

* Replace `undelegate` calls with `undelegateEventListener` ([PREFER_UNDELEGATE_EVENT_LISTENER](./#prefer_undelegate_event_listener))

* Replace `observeProperty` calls with `observe` ([PREFER_OBSERVE](./#prefer_observe))

* Replace `unobserveProperty` calls with `unobserve` ([PREFER_UNOBSERVE](./#prefer_unobserve))

* Update `render` invokations ([RENDER_HELPER](./#render_helper))

* Remove template functions ([TEMPLATE_FUNCTIONS](./#template_functions))

* Check that your templates does not rely on the falsity of zero and empty string values ([TEMPLATE_EMPTY_VALUES](./#template_empty_values))

* Replace all core mixins with the `Component` class ([AVOID_MIXINS](./#avoid_mixins))

* Remove all `proxy` occurrences ([PROXY_HELPER](./#proxy_helper))

* Replace `trust` occurrences with `html` ([TRUST_HELPER](./#trust_helper))

* Import the `mix` helper from `@chialab/proteins` ([MIX_HELPER](./#mix_helper))

* Remove all `DOM.getNodeComponent`, `DOM.getComponentNode` and `.node` references ([PREFER_INSTANCE](./#prefer_instance))

* Correctly extend builtin elements using the `extend` helper ([EXTEND_BUILTIN](./#extend_builtin))

* Replace `define` invokations with `customElements.define` ([USE_REGISTRY](./#use_registry))
