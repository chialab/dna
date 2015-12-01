export class DNAComponents {
    static register(fn, options = {}) {
        let tagName, res;
        if (typeof fn == 'function') {
            if (typeof fn['onRegister'] == 'function') {
                fn['onRegister'].call(fn);
            }
            tagName = options.tagName || (fn.hasOwnProperty('tagName') && fn.tagName) || DNAComponent.classToElement(fn);
            options.prototype = fn.prototype;
            if (!options.extends) {
                options.extends = fn.extends;
            }
        } else {
            tagName = fn;
        }
        try {
            res = document.registerElement(tagName, options);
            res.prototype.is = tagName;
            if (typeof fn == 'function') {
                res.prototype.constructor = fn;
            }
            if (fn.template) {
                res.prototype._template = fn.template;
            }
            return res;
        } catch (ex) {
            console.error(ex);
            return false;
        }
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
     * Instantiate an element.
     * This is a sort of constructor.
     */
    static instantiate() {
        var tag = this.tagName || this.classToElement(this);
        return document.createElement(tag);
    }
    /**
     * Convert a Class name into HTML tag.
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
    /**
     * Convert a HTML tag into a Class name.
     * @param {Class} fn Grab the class name from this tag.
     * @return {String} The class name for the Custom Element.
     */
    static elementToClass(tag) {
        return tag
            .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
                if (+match === 0) return '';
                return match.toUpperCase();
            })
            .replace(/[\-|\_]/g, '');
    }
}
