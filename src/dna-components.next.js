'use strict';

import '../node_modules/dna-polyfills/src/index.next.js';
import { DNABaseComponent } from './dna-base-component.next.js';

/**
 * Helper class
 * @class DNAComponents
 */
class DNAComponents {
    /**
     * Trigger `onRegister` callbacks and register the Custom Element (if the `skipWebComponent` option !== true).
     * @param {Function|String} fn The definition or the tag name of the Custom Element.
     * @param {Object} options A set of options for the registration of the Custom Element.
     * @return {Function} The Custom Element constructor.
     */
    static register(fn, options = {}) {
        let tagName, res;
        if (typeof fn == 'function') {
            if (typeof fn['onRegister'] == 'function') {
                fn['onRegister'].call(fn);
            }
            tagName = options.tagName || (fn.hasOwnProperty('tagName') && fn.tagName) || DNAComponents.classToElement(fn);
            options.prototype = fn.prototype;
            if (!options.extends && typeof fn.extends == 'string') {
                options.extends = fn.extends;
            }
        } else {
            tagName = fn;
        }
        try {
            fn.prototype.is = tagName;
            if (DNAComponents.config.useWebComponents) {
                res = document.registerElement(tagName, options);
            } else {
                res = function() {
                    var el = document.createElement(tagName);
                    Object.setPrototypeOf(el, fn.prototype);
                    setTimeout(function () {
                        el.createdCallback();
                    }, 0);
                    return el;
                }
            }
            res.prototype.is = tagName;
            if (typeof fn == 'function') {
                res.prototype.constructor = fn;
            }
            return res;
        } catch (ex) {
            console.error(ex);
            return false;
        }
    }
    /**
     * Convert a Class name into HTML tag.
     * @param {Class} fn Grab the tag name from this class.
     * @return {String} The tag name for the Custom Element.
     */
    static classToElement(fn) {
        var name = fn.name || fn.toString().match(/^function\s*([^\s(]+)/)[1];
        if (!name) {
            return undefined;
        }
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

    static Create(options = {}) {
        let proto = options.prototype || {};
        if (typeof options.tagName !== 'string') {
            throw 'Missing or bad typed `tagName` property';
        }
        let scope = function () {};
        scope.prototype = Object.create(DNABaseComponent.prototype, {
            constructor: {
                value: scope,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        Object.setPrototypeOf(scope, DNABaseComponent);
        for (var k in proto) {
            scope.prototype[k] = proto[k];
        }
        return this.register(scope, { tagName: options.tagName });
    }

    get BaseComponent() {
        return DNABaseComponent;
    }
}

DNAComponents.config = {
    useWebComponents: (typeof window !== 'undefined' && typeof window.WebComponents !== 'undefined')
};

export { DNAComponents }
