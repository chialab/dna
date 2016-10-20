import { mix } from './lib/mixins.js';
import { Component } from './dna-component.js';
import { StyleMixin } from './mixins/dna-style-component.js';
import { EventsMixin } from './mixins/dna-events-component.js';
import { PropertiesMixin } from './mixins/dna-properties-component.js';
import { TemplateMixin } from './mixins/dna-template-component.js';

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
export class BaseComponent extends mix(Component).with(
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
) {}
