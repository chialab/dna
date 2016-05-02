import { DNAMixedComponent } from './dna-mixed-component.js';
import { DNAStyleComponent } from './dna-style-component.js';
import { DNAEventsComponent } from './dna-events-component.js';
import { DNAPropertiesComponent } from './dna-properties-component.js';
import { DNAAttributesComponent } from './dna-attributes-component.js';
import { DNATemplateComponent } from './dna-template-component.js';

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
 */
export class DNABaseComponent extends DNAMixedComponent {
    /**
     * A list of mixins, including: DNAStyleComponent, DNAEventsComponent,
     * DNAPropertiesComponent, DNAAttributesComponent and DNATemplateComponent.
     * @type {Array}
     */
    static get behaviors() {
        return [
            DNAStyleComponent,
            DNAEventsComponent,
            DNAPropertiesComponent,
            DNAAttributesComponent,
            DNATemplateComponent,
        ];
    }
}
