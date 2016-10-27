/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with DOM Mutations.
 */
import './src/polyfills/custom-event.js';
import './src/polyfills/reduce.js';
import './src/polyfills/matches.js';
import './src/observers/mutations.js';
import { mix } from './src/lib/mixins.js';
import { Shim } from './src/lib/shim-custom.js';
import { registry } from './src/lib/registry.js';
import { ComponentMixin } from './src/mixins/component.js';
import { PropertiesMixin } from './src/mixins/properties-component.js';
import { EventsMixin } from './src/mixins/events-component.js';
import { StyleMixin } from './src/mixins/style-component.js';
import { TemplateMixin } from './src/mixins/template-component.js';
import { render as originalRender } from './src/lib/render.js';
import { connect } from './src/lib/nodes.js';

export * from './src/lib/nodes.js';
export { ComponentMixin };
export { PropertiesMixin };
export { EventsMixin };
export { StyleMixin };
export { TemplateMixin };
export { mix };
export { prop } from './src/lib/property.js';
export { Shim };
export { registry };
export function define(tagName, Component, config) {
    return registry.define(tagName, Component, config);
}
export function render(tagName, Component, config) {
    let elem = originalRender(tagName, Component, config);
    connect(elem);
    return elem;
}

/**
 * Simple custom Component with some mixins.
 * @class BaseComponent
 * @extends HTMLElement
 *
 * @example
 * my-component.js
 * ```js
 * import { BaseComponent } from 'dna/component';
 * export class MyComponent extends BaseComponent {
 *   get css() {
 *     return '...';
 *   }
 *   get events() {
 *     return {
 *       '...': '...'
 *     };
 *   }
 *   static get observedAttributes() {
 *     return ['...', '...'];
 *   }
 *   get template() {
 *     return '...';
 *   }
 *   get properties() {
 *     return { ... };
 *   }
 * }
 * ```
 */
export const BaseComponent = mix(new Shim(self.HTMLElement)).with(
    ComponentMixin,
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
);
