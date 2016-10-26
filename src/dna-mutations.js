/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with DOM Mutations.
 */

import './observers/mutations.js';
import Skin from 'skin-template';
import { mix } from './lib/mixins.js';
import { ELEMENTS } from './lib/elements.js';
import { REGISTRIES } from './lib/registries.js';
import { ComponentMixin } from './mixins/component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { StyleMixin } from './mixins/style-component.js';
import { TemplateMixin } from './mixins/template-component.js';
import { Polyfill } from './lib/polyfill.js';
import { render as originalRender } from './lib/render.js';
import { connect } from './lib/nodes.js';

REGISTRIES.default = REGISTRIES.custom;
ELEMENTS.HTMLElement = new Polyfill(self.HTMLElement);

export const Template = Skin;
export const IDOM = Template.IDOM;
export * from './lib/nodes.js';
export function render(tagName, Component, config) {
    let elem = originalRender(tagName, Component, config);
    connect(elem);
    return elem;
}
export { ComponentMixin };
export { PropertiesMixin };
export { EventsMixin };
export { StyleMixin };
export { TemplateMixin };
export { mix };
export { prop } from './lib/property.js';
export { define } from './lib/define.js';
export { Polyfill };
export { ELEMENTS };
export const registry = REGISTRIES.default;

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
export const BaseComponent = mix(ELEMENTS.HTMLElement).with(
    ComponentMixin,
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
);
