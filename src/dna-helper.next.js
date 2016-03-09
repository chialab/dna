'use strict';

import { DNAConfig } from './dna-config.next.js';

/**
 * Helper class
 * @class DNAHelper
 */
export class DNAHelper {
    /**
     * Trigger `onRegister` callbacks and register the Custom Element (if the `skipWebComponent` option !== true).
     * @param {Function|String} fn The definition or the tag name of the Custom Element.
     * @param {Object} options A set of options for the registration of the Custom Element.
     * @return {Function} The Custom Element constructor.
     */
    static register(fn, options = {}) {
        let tagName, res;

        if (typeof fn === 'string') {
            tagName = fn;
            if (typeof options === 'function') {
                fn = options;
                options = {};
            } else if (typeof options.prototype !== 'undefined') {
                fn = options.prototype;
            }
        }
        if (typeof fn === 'function') {
            tagName = tagName || options.tagName || (fn.hasOwnProperty('tagName') && fn.tagName) || DNAHelper.classToElement(fn);
            Object.defineProperty(fn, 'tagName', {
                get: function () {
                    return tagName;
                }
            });
            if (typeof fn['onRegister'] == 'function') {
                fn['onRegister'].call(fn);
            }
            options.prototype = fn.prototype;
            if (!options.extends && typeof fn.extends == 'string') {
                options.extends = fn.extends;
            }
        } else {
            options.prototype = fn;
            fn = function () { options.prototype.constructor.apply(this, arguments) };
            fn.prototype = options.prototype;
        }
        try {
            fn.prototype.is = tagName;
            if (DNAConfig.useWebComponents) {
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
        let name = fn.name || fn.toString().match(/^function\s*([^\s(]+)/)[1];
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
    /**
     * Get an element's property descriptor.
     * @param {Function} ctr The element constructor.
     * @param {string} prop The property to analyze.
     * @return {object} The descriptor of the property.
     */
    static getDescriptor(ctr, prop) {
        let res;
        if (ctr) {
            res = Object.getOwnPropertyDescriptor(ctr, prop);
            if (!res && ctr.__proto__) {
                res = DNAHelper.getDescriptor(ctr.__proto__, prop);
            }
        }
        return res;
    }
    /**
     * Wrap a property descriptor get function.
     * @param {string} prop The property to wrap.
     * @param {object} descriptor The property descriptor.
     * @return {Function} The descriptor get function wrapped.
     */
    static wrapDescriptorGet(prop, descriptor) {
        return function() {
            let res;
            if (typeof descriptor.get === 'function') {
                try {
                    res = descriptor.get.call(this);
                } catch(ex) {
                    res = this['__' + prop];
                }
            } else {
                res = this['__' + prop];
            }
            return res;
        }
    }
    /**
     * Wrap a property descriptor set function.
     * @param {string} prop The property to wrap.
     * @param {object} descriptor The property descriptor.
     * @return {Function} The descriptor set function wrapped.
     */
    static wrapDescriptorSet(prop, descriptor, callback) {
        if (descriptor && descriptor.set && descriptor.set.callbacks) {
            descriptor.set.callbacks.push(callback);
            return descriptor.set;
        }
        let setter = function(value) {
            if (descriptor.set) {
                try {
                    descriptor.set.call(this, value);
                } catch(ex) {
                    this['__' + prop] = value;
                }
            } else {
                this['__' + prop] = value;
            }
            let res = this[prop];
            setter.callbacks.forEach((callback) => {
                if (typeof callback === 'function') {
                    callback.call(this, prop, res);
                }
            });
            return res;
        }
        setter.callbacks = [callback];
        return setter;
    }
}
