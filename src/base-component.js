import { mix } from './lib/mixins.js';
import { ComponentMixin } from './mixins/component.js';
import { HTMLElement } from './lib/html-element.js';
import { StyleMixin } from './mixins/style-component.js';
import { EventsMixin } from './mixins/events-component.js';
import { PropertiesMixin } from './mixins/properties-component.js';
import { TemplateMixin } from './mixins/template-component.js';

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @extends Component
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
export class BaseComponent extends mix(HTMLElement).with(
    ComponentMixin,
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
) {}
