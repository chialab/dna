import { mix } from 'mixwith';
import { DNAComponent } from './dna-component.js';
import { DNAStyleMixin } from './dna-style-component.js';
import { DNAEventsMixin } from './dna-events-component.js';
import { DNAPropertiesMixin } from './dna-properties-component.js';
import { DNATemplateMixin } from './dna-template-component.js';

/**
 * Simple Custom Component with some behaviors.
 * @class DNABaseComponent
 * @extends DNAMixedComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNABaseComponent } from 'dna/component';
 * export class MyComponent extends DNABaseComponent {
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
const DNAMixinComponent = mix(DNAComponent).with(
    DNAPropertiesMixin,
    DNAStyleMixin,
    DNAEventsMixin,
    DNATemplateMixin
);

export class DNABaseComponent extends DNAMixinComponent {}
