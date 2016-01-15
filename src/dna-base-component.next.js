'use strict';

import { DNAMixedComponent } from './dna-mixed-component.next.js';
import { DNAEventComponent } from './dna-event-component.next.js';
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
     * Fires when an instance of the element is created.
     */
	createdCallback() {
		DNAMixedComponent.prototype.createdCallback.call(this);
		// Add scope style class
        if (this.is) {
            this.classList.add(this.is);
        }
	}
	/**
     * A list of mixins.
     * @type {Array}
     */
	static get behaviors() {
		return [DNAStyleComponent, DNAEventComponent, DNAAttributesComponent, DNATemplateComponent]
	}
}
