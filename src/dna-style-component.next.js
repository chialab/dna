'use strict';

import { DNAComponent } from './dna-component.next.js';

/**
 * Simple Custom Component with css style handling using the `css` property.
 * @class DNAStyleComponent
 * @extends DNAComponent
 */
export class DNAStyleComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     */
    static onRegister(...args) {
        // Create render function
        if (this.css) {
            this.addCss(this.css);
        }
    }
    /**
     * Add `<style>` tag for the component.
     * @param {String} css The CSS content.
	 * @return {HTMLStyleElement} the style tag created.
     */
	static addCss(css) {
        if (typeof css == 'function') {
            css = css();
        }
		let id = 'style-' + this.tagName;
		let style = document.getElementById(id) || document.createElement('style');
		style.type = 'text/css';
		style.setAttribute('id', id);
		if (style.styleSheet) {
		    style.styleSheet.cssText = css;
		} else {
            style.innerHTML = '';
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
}
