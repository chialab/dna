'use strict';

import { DNAMixedComponent } from 'dna-mixed-component.next.js';
import { DNAEventComponent } from 'dna-event-component.next.js';
import { DNAAttributesComponent } from 'dna-attributes-component.next.js';

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
        if (this.is) {
            this.classList.add(this.is);
        }
        // Render the template
        if (this._template) {
            this.innerHTML = this._template.innerHTML || '';
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
