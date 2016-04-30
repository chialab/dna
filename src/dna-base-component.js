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
 */
export class DNABaseComponent extends DNAMixedComponent {
    /**
     * A list of mixins.
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
