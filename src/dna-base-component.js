import { mix } from 'mixwith';
import { Component } from './dna-component.js';
import { StyleMixin } from './dna-style-component.js';
import { EventsMixin } from './dna-events-component.js';
import { PropertiesMixin } from './dna-properties-component.js';
import { TemplateMixin } from './dna-template-component.js';

/**
 * Simple Custom Component with some behaviors.
 * @class BaseComponent
 * @extends MixedComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { BaseComponent } from 'dna/component';
 * export class MyComponent extends BaseComponent {
 *   static get template() {
 *     return `...`;
 *   }
 *   static get css() {
 *     return '...';
 *   }
 *   static get observedAttributes() {
 *     return ['...', '...'];
 *   }
 *   static get observedProperties() {
 *     return ['...', '...'];
 *   }
 *   static get events() {
 *     return {
 *       '...': '...'
 *     };
 *   }
 * }
 */
const MixinComponent = mix(Component).with(
    PropertiesMixin,
    StyleMixin,
    EventsMixin,
    TemplateMixin
);

export class BaseComponent extends MixinComponent {}
