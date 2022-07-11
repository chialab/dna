## From v3 to v4

**Changes**

* Function Component signature has changed:

```diff
- function Card(properties, store, requestUpdate) {
+ function Card(properties, { store, requestUpdate }) {
```

* Typings improvements

* Using the `compile` function is now the preferred way to compile on the fly an HTML string into a virtual DOM template: 

```diff
-import { html } from '@chialab/dna';
+import { compile } from '@chialab/dna';

- ${html(model.title)}
+ ${compile(model.title)}
```

Please note that VDOM convertion does not handle HTML entities and it can lead to unexpected output, reason why the default behavior changed.

**Removed**

Hooks, React and compatibility modules are now out of the scope of the DNA library and have been removed.

## From v2 to v3

This is a list of changes requested to completely migrate to the DNA 3.0 version.

* Install and use the new `@chialab/dna` instead of the `@dnajs/idom` module

* Extends the `Component` constructor instead of the `BaseComponent` class

```diff
- import { BaseComponent } from '@dnajs/idom';
+ import { Component } from '@chialab/dna';

- class Card extends BaseComponent {
+ class Card extends Component {
```

* Convert `template` getter to `render` method.

* Convert `css` getter to `<style>` elements in `render` method.

* Replace the `prop` helper with a property descriptor.

* Replace `events` getters with the new `listeners` getter.

* Replace stringed prototype references with real references in event listeners.

* Replace `trigger` references with `dispatchEvent`.

* Replace `delegate` calls with `delegateEventListener`.

* Replace `undelegate` calls with `undelegateEventListener`.

* Replace `observeProperty` calls with `observe`.

* Replace `unobserveProperty` calls with `unobserve`.

* Update `render` invokations.

* Remove template functions.

* Check that your templates does not rely on the falsity of zero and empty string values.

* Replace all core mixins with the `Component` class.

* Remove all `proxy` occurrences.

* Replace `trust` occurrences with `html()`.

* Import the `mix` helper from `@chialab/proteins`.

* Remove all `DOM.getNodeComponent`, `DOM.getComponentNode` and `.node` references.

* Correctly extend builtin elements using the `extend` helper.

* Replace `define` invokations with `customElements.define`.
