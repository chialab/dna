/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements specs.
 */
import Skin from 'skin-template';
import { mix } from './lib/mixins.js';
import { ELEMENTS } from './lib/elements.js';
import { REGISTRIES } from './lib/registries.js';
import { ComponentMixin } from './mixins/component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { StyleMixin } from './mixins/style-component.js';
import { TemplateMixin } from './mixins/template-component.js';

export const Template = Skin;
export const IDOM = Template.IDOM;
export { render } from './lib/render.js';
export { ComponentMixin };
export { PropertiesMixin };
export { EventsMixin };
export { StyleMixin };
export { TemplateMixin };
export { mix };
export { define } from './lib/define.js';
export { prop } from './lib/property.js';
export { ELEMENTS };
export const registry = REGISTRIES.default;

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
 */
export class BaseComponent extends mix(ELEMENTS.HTMLElement).with(
    ComponentMixin,
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
) {}
