'use strict';

/**
 * This is the model to use to create DNA Custom Components.
 */
class DNAComponent extends HTMLElement {
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback(...args) {
        //
    }
    /**
     * Fires when an instance was inserted into the document.
     */
    attachedCallback(...args) {
        //
    }
    /**
     * Fires when an attribute was added, removed, or updated.
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
        //
    }
    /**
     * The tag name of the custom element.
     * @type {String}
     */
    static get tagName() {
        return this._tagName || DNAComponent.classToElement(this);
    }
    static set tagName(tag) {
        if (typeof tag == 'string') {
            this._tagName = tag;
        }
    }
    /**
     * Register the custom element.
     * @param {String} ext The name of an Element to extend (optional).
     */
    static init(ext = false) {
        if (this.register(this, ext)) {
            this.template = this.getTemplate();
        }
    }
    static register(fn, ext, tagName) {
        tagName = tagName || fn.tagName || DNAComponent.classToElement(fn);
        let options = {
                prototype: fn.prototype,
            };
        if (ext) {
            options.extends = ext;
        }
        // Retrieve the Custom Element tag name.
        try {
            document.registerElement(tagName, options);
        } catch (ex) {
            return false;
        } finally {
            return true;
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
