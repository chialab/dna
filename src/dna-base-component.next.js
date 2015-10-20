'use strict';

import DNAMixedComponent from 'dna-mixed-component.next.js';
import DNAEventComponent from 'dna-event-component.next.js';
import DNAAttributesComponent from 'dna-attributes-component.next.js';

/**
 * Simple Custom Component with attributes and behaviors.
 */
export class DNABaseComponent extends DNAMixedComponent {
	/**
     * Fires when an instance of the element is created.
     */
	createdCallback() {
		DNAMixedComponent.prototype.createdCallback.call(this);
		// Add scope style class
        if (this.constructor.tagName) {
            this.classList.add(this.constructor.tagName);
        }
        // Render the template
        if (this.constructor.template) {
            this.innerHTML = this.constructor.template.innerHTML || '';
        }
	}
	/**
     * A list of mixins.
     * @type {Array}
     */
	static get behaviors() {
		return [DNAEventComponent, DNAAttributesComponent]
	}
}
