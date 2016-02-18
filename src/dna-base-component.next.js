'use strict';

import { DNAMixedComponent } from './dna-mixed-component.next.js';
import { DNAEventsComponent } from './dna-events-component.next.js';
import { DNATemplateComponent } from './dna-template-component.next.js';
import { DNAStyleComponent } from './dna-style-component.next.js';
import { DNAAttributesComponent } from './dna-attributes-component.next.js';

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
        return [DNAStyleComponent, DNAEventsComponent, DNAAttributesComponent, DNATemplateComponent]
    }
}
