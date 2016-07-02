import { DNABaseComponent } from '../dna-base-component.js';
import { DNAStyleComponent } from '../dna-style-component.js';
import { DNAEventsComponent } from '../dna-events-component.js';
import { DNAPropertiesComponent } from '../dna-properties-component.js';
import { DNAAttributesComponent } from '../dna-attributes-component.js';
import { DNAVDomComponent } from './dna-vdom-component.js';

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
export class DNAVDomBaseComponent extends DNABaseComponent {
    /**
     * Same DNABaseComponent's list of mixins,
     * with DNAVDomComponent behavior instead of DNATemplateComponent.
     * @type {Array}
     */
    static get behaviors() {
        return [
            DNAPropertiesComponent,
            DNAStyleComponent,
            DNAEventsComponent,
            DNAAttributesComponent,
            DNAVDomComponent,
        ];
    }
}
