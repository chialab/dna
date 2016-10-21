/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Incremental DOM notifications.
 */
import './src/observers/idom.js';
import Skin from 'skin-template';
import { mix } from './lib/mixins.js';
import { ELEMENTS } from './lib/elements.js';
import { ComponentMixin } from './mixins/component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { StyleMixin } from './mixins/style-component.js';
import { TemplateMixin } from './mixins/template-component.js';
import { Polyfill } from './src/lib/polyfill.js';

export const Template = Skin;
export const IDOM = Template.IDOM;
export * from './src/lib/nodes.js';
export { ComponentMixin };
export { PropertiesMixin };
export { EventsMixin };
export { StyleMixin };
export { TemplateMixin };
export { mix };
export { prop } from './src/lib/property.js';
export { registry } from './src/lib/registry.js';
export { define } from './src/lib/define.js';
export { Polyfill };
export { ELEMENTS };

ELEMENTS.HTMLElement = new Polyfill(self.HTMLElement);

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
