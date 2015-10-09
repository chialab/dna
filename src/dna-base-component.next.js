'use strict';

/**
 * This is the base model to use to create DNA Custom Components.
 */
class DNABaseComponent extends HTMLElement {
    /**
     * Fires when an instance of the element is created.
     * @private
     */
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
    /**
     * Fires when an instance was inserted into the document.
     * @private
     */
    attachedCallback(...args) {
        if (typeof this.attached == 'function') {
            this.attached(...args);
        }
    }
    /**
     * Fires when an attribute was added, removed, or updated.
     * @private
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (typeof this.attributeChanged == 'function') {
            this.attributeChanged(attrName, oldVal, newVal);
        }
    }
    /**
     * Abstract `created` callback. Extend in your component!
     */
    created() {}
    /**
     * Abstract `attached` callback. Extend in your component!
     */
    attached() {}
    /**
     * Abstract `attributeChanged` callback. Extend in your component!
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChanged(attrName, oldVal, newVal) {}
    /**
     * Register the custom element.
     * @param {String} ext The name of an Element to extend (optional).
     */
    static init(ext = false) {
        let fn = this,
            options = {
                prototype: fn.prototype,
            };
        if (ext) {
            options.extends = ext;
        }
        // Retrieve the Custom Element tag name.
        var tagName = fn.tagName;
        if (!tagName) {
            fn.tagName = tagName = DNABaseComponent.classToElement(fn);
        }
        try {
            document.registerElement(tagName, options);
        } catch (ex) {
            //
        } finally {
            fn.template = DNABaseComponent.getTemplate();
        }
    }
    /**
     * Instantiate an element.
     * This is a sort of constructor.
     */
    static instantiate() {
        var tag = this.tagName || this.classToElement(this);
        return document.createElement(tag);
    }
    /**
     * Get current component template.
     * Uses `document.currentScript`, so use only on initialization!
     * @return {HTMLTemplateElement} The template element of the component.
     */
    static getTemplate() {
        if (document.currentScript && document.currentScript.parentNode) {
            return document.currentScript.parentNode.querySelector('template');
        }
    }
    /**
     * Convert a Class name to HTML tag.
     * @param {Class} fn Grab the tag name from this class.
     * @return {String} The tag name for the Custom Element.
     */
    static classToElement(fn) {
        return fn.name
            .replace(/[A-Z]/g, function(match) {
                return '-' + match.toLowerCase();
            })
            .replace(/^\-/, '');
    }
}
