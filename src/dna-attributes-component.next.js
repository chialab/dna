'use strict';

import { DNABaseElement } from 'dna-base-component.next.js'

/**
 * Simple Custom Component with attributes watching and reflecting.
 */
export class DNAAttributesComponent extends DNABaseComponent {
	/**
	 * On `created` callback, sync attributes with properties.
	 */
	created() {
		var attributes = this.attributes || [];
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            this.attributeChanged(attr.name, undefined, attr.value);
        }
	}
	/**
	 * On `attributeChanged` callback, sync attributes with properties.
	 * @private
	 * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
	 */
	attributeChanged(attr, oldVal, newVal) {
		var cl = this.constructor;
		if (cl && cl.attributes && Array.isArray(cl.attributes)) {
			if (cl.attributes.indexOf(attr)) {
				this[attr] = newVal;
			}
		}
    }
}
