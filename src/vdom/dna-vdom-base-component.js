import { mix } from 'mixwith';
import { DNAStyleMixin } from '../dna-style-component.js';
import { DNAEventsMixin } from '../dna-events-component.js';
import { DNAPropertiesMixin } from '../dna-properties-component.js';
import { DNAAttributesMixin } from '../dna-attributes-component.js';
import { DNAVDomMixin } from './dna-vdom-component.js';

/**
 * Same as DNABaseComponent, with DNAVDomComponent behavior instead of DNATemplateComponent.
 * This component is available only including /dna\.vdom(\-?.*)\.js/ libraries.
 * @class DNAVDomBaseComponent
 * @extends DNABaseComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAVDomBaseComponent } from 'dna/component';
 * export class MyComponent extends DNAVDomBaseComponent {
 *   get template() {
 *     return `...`;
 *   }
 *   get style() {
 *     return '...';
 *   }
 *   get attributes() {
 *     return ['...', '...'];
 *   }
 *   get properties() {
 *     return ['...', '...'];
 *   }
 *   get events() {
 *     return {
 *       '...': '...'
 *     };
 *   }
 * }
 * ```
 */
const DNAVDomMixinComponent = mix(HTMLElement).with(
    DNAPropertiesMixin,
    DNAStyleMixin,
    DNAEventsMixin,
    DNAAttributesMixin,
    DNAVDomMixin
);

export class DNAVDomBaseComponent extends DNAVDomMixinComponent {}
