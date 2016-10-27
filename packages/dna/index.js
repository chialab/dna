/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements specs.
 */
import { mix } from './src/lib/mixins.js';
import { Shim } from './src/lib/shim-custom.js';
import { ComponentMixin } from './src/mixins/component.js';
import { PropertiesMixin } from './src/mixins/properties-component.js';
import { EventsMixin } from './src/mixins/events-component.js';
import { StyleMixin } from './src/mixins/style-component.js';
import { TemplateMixin } from './src/mixins/template-component.js';
import { registry } from './src/lib/registry.js';
import { render as originalRender } from './src/lib/render.js';
import { connect } from './src/lib/nodes.js';

export { ComponentMixin };
export { PropertiesMixin };
export { EventsMixin };
export { StyleMixin };
export { TemplateMixin };
export { Shim };
export { mix };
export { prop } from './src/lib/property.js';
export * from './src/lib/nodes.js';
// export const registry = self.customElements;
// export function define(tagName, Component, config) {
//     return registry.define(tagName, Component, config);
// }
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
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @extends HTMLElement
 *
 * @example
 * my-component.js
 * ```js
 * import { BaseComponent } from 'dna/component';
 * export class MyComponent extends BaseComponent {
 *   static get observedAttributes() {
 *     return ['...', '...'];
 *   }
 *   get css() {
 *     return '...';
 *   }
 *   get events() {
 *     return {
 *       '...': '...'
 *     };
 *   }
 *   get template() {
 *     return '...';
 *   }
 *   get properties() {
 *     return { ... };
 *   }
 * }
 */
export class BaseComponent extends mix(
    new Shim(self.HTMLElement)
).with(
    ComponentMixin,
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
) {}
