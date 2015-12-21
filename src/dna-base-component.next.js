'use strict';

import { DNAMixedComponent } from './dna-mixed-component.next.js';
import { DNAEventComponent } from './dna-event-component.next.js';
import { DNAAttributesComponent } from './dna-attributes-component.next.js';

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
			if (typeof this._template === 'string') {
				this.innerHTML = this._template;
			} else {
            	this.innerHTML = this._template.innerHTML;
			}
        }
	}
	/**
     * Add <style> tag for the component.
     * @param {String} css The CSS content.
	 * @return {HTMLStyleElement} the style tag created.
     */
	static addCss(css) {
		let id = 'style-' + this.tagName;
		let style = document.getElementById(id) || document.createElement('style');
		style.type = 'text/css';
		style.setAttribute('id', id);
		if (style.styleSheet) {
		    style.styleSheet.cssText = css;
		} else {
		    style.appendChild(document.createTextNode(css));
		}
		if (!style.parentNode) {
			let head = document.head || document.getElementsByTagName('head')[0];
			if (head.firstElementChild) {
				head.insertBefore(style, head.firstElementChild)
			} else {
				head.appendChild(style);
			}
		}
		return style;
	}
	/**
     * A list of mixins.
     * @type {Array}
     */
	static get behaviors() {
		return [DNAEventComponent, DNAAttributesComponent]
	}
}
