'use strict';

import { DNAComponent } from 'dna-component.next.js'

/**
 * Simple Custom Component with attributes watching and reflecting.
 */
export class DNAAttributesComponent extends DNAComponent {
	/**
	 * On `created` callback, sync attributes with properties.
	 */
	createdCallback() {
		DNAComponent.prototype.createdCallback.call(this);
		var attributes = this.attributes || [];
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
	}
	/**
	 * On `attributeChanged` callback, sync attributes with properties.
	 * @private
	 * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
	 */
	attributeChangedCallback(attr, oldVal, newVal) {
		DNAComponent.prototype.attributeChangedCallback.call(this);
		var cl = this.constructor;
		if (cl && cl.attributes && Array.isArray(cl.attributes)) {
			if (cl.attributes.indexOf(attr) !== -1) {
				this[attr] = newVal;
			}
		}
    }
}
