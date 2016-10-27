/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with DOM Mutations.
 */
import './polyfills/custom-event.js';
import './polyfills/reduce.js';
import './polyfills/matches.js';
import './observers/mutations.js';
import { mix } from './lib/mixins.js';
import { Shim } from './lib/shim-custom.js';
import { registry } from './lib/registry.js';
import { ComponentMixin } from './mixins/component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { StyleMixin } from './mixins/style-component.js';
import { TemplateMixin } from './mixins/template-component.js';
import { render as originalRender } from './lib/render.js';
import { connect } from './lib/nodes.js';

export * from './lib/nodes.js';
export { ComponentMixin };
export { PropertiesMixin };
export { EventsMixin };
export { StyleMixin };
export { TemplateMixin };
export { mix };
export { prop } from './lib/property.js';
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
