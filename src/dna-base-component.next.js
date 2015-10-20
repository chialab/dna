'use strict';

import DNAMixedComponent from 'dna-mixed-component.next.js';
import DNAEventComponent from 'dna-event-component.next.js';

/**
 * Simple Custom Component with attributes and behaviors.
 */
export class DNABaseComponent extends DNAMixedComponent {

	static get attributes() {
		return [DNAEventComponent]
	}

}
