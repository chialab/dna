## From v3 to v4

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
