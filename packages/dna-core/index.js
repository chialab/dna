/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements specs.
 */
import { mix, prop, shim, HELPERS, DOM, MIXINS } from './src/core.js';
import { registry } from './src/lib/registry.js';

export { mix, prop, shim, HELPERS, DOM, MIXINS };
export { registry };
export function define(tagName, Component, config) {
    return registry.define(tagName, Component, config);
}
export function render(node, Component, props) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    DOM.appendChild(node, element);
    return element;
}

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @extends HTMLElement
 *
 * @example
 *
 * ```js
 * // my-component.js
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
 * ```
 */
export class BaseComponent extends mix(
    shim(self.HTMLElement)
).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin
) {}
