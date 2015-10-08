'use strict';

class DNABaseComponent extends HTMLElement {
    // Fires when an instance of the element is created.
    createdCallback(...args) {
		// Add scope style class
		if (this.constructor.tagName) {
			this.classList.add(this.constructor.tagName);
		}
		// Render the template
		if (this.constructor.template) {
			this.innerHTML = this.constructor.template.innerHTML || '';
		}
		if (typeof this.created == 'function') {
			this.created(...args);
		}
    }
	// Abstract `created` callback. Extend in your component!
	created() {
	}
    // Fires when an instance was inserted into the document.
    attachedCallback(...args) {
		if (typeof this.attached == 'function') {
			this.attached(...args);
		}
    }
	// Abstract `attached` callback. Extend in your component!
	attached() {
	}
    // Fires when an attribute was added, removed, or updated.
    attributeChangedCallback(attrName, oldVal, newVal) {
		if (typeof this.attributeChanged == 'function') {
			this.attributeChanged(attrName, oldVal, newVal);
		}
    }
	// Abstract `attributeChanged` callback. Extend in your component!
	attributeChanged() {
	}
	// Register the custom element
	static init(ext = false) {
		let fn = this,
			options = {
				prototype: fn.prototype,
			};
		if (ext) {
			options.extends = ext;
		}
		var tagName = fn.tagName;
		if (!tagName) {
			fn.tagName = tagName = DNABaseComponent.classToElement(fn);
		}
        try {
			document.registerElement(tagName, options);
        } catch(ex) {
            //
        } finally {
			fn.template = DNABaseComponent.getTemplate();
        }
	}
	// Instance an element
	static instantiate() {
		var tag = this.tagName || this.classToElement(this);
		return document.createElement(tag);
	}
	// Register current component template
	static registerTemplate(fn) {
		fn.template = DNABaseComponent.getTemplate();
	}
	// Get current component template
	static getTemplate() {
		if (document.currentScript && document.currentScript.parentNode) {
			return document.currentScript.parentNode.querySelector('template');
		}
	}
	// convert Class name to HTML tag
	static classToElement(fn) {
		return fn.name
				.replace(/[A-Z]/g, function (match) {
					return '-' + match.toLowerCase();
				})
				.replace(/^\-/, '');
	}
}
