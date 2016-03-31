import { DNAConfig } from './dna-config.next.js';

/**
 * Helper class
 * @class DNAHelper
 */
export class DNAHelper {
    /**
     * Trigger `onRegister` callbacks and register the Custom Element
     * (if the `skipWebComponent` option !== true).
     * @param {Function|String} fn The definition or the tag name of the Custom Element.
     * @param {Object} options A set of options for the registration of the Custom Element.
     * @return {Function} The Custom Element constructor.
     */
    static register(fn, options = {}) {
        let scope = fn;
        let config = options;
        let tagName;
        let res;

        if (typeof fn === 'string') {
            tagName = fn;
            if (typeof config === 'function') {
                scope = config;
                config = {};
            } else if (typeof config.prototype !== 'undefined') {
                scope = config.prototype;
            }
        }
        if (typeof scope === 'function') {
            tagName = (
                tagName ||
                config.tagName ||
                (scope.hasOwnProperty('tagName') && scope.tagName) ||
                DNAHelper.classToElement(scope)
            );
            config.prototype = scope.prototype;
            if (!config.extends && typeof scope.extends === 'string') {
                config.extends = scope.extends;
            }
        } else {
            config.prototype = scope;
            scope = function(...args) {
                config.prototype.constructor.apply(this, args);
            };
            scope.prototype = config.prototype;
        }
        Object.defineProperty(scope, 'tagName', {
            configurable: true,
            get: () => tagName,
        });
        Object.defineProperty(scope.prototype, 'is', {
            configurable: false,
            get: () => tagName,
        });
        if (typeof scope.onRegister === 'function') {
            scope.onRegister.call(scope);
        }
        if (DNAConfig.useWebComponents) {
            res = document.registerElement(tagName, config);
        } else {
            res = function() {
                let el = document.createElement(tagName);
                Object.setPrototypeOf(el, scope.prototype);
                setTimeout(() => el.createdCallback(), 0);
                return el;
            };
        }
        if (typeof scope === 'function') {
            res.prototype.constructor = scope;
        }
        return res;
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
            .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
            .replace(/^\-/, '');
    }
    /**
     * Convert a HTML tag into a Class name.
     * @param {Class} fn Grab the class name from this tag.
     * @return {String} The class name for the Custom Element.
     */
    static elementToClass(tag) {
        return tag
            .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
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
            let proto = Object.getPrototypeOf(ctr);
            if (!res && proto) {
                res = DNAHelper.getDescriptor(proto, prop);
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
                } catch (ex) {
                    res = this[`__${prop}`];
                }
            } else {
                res = this[`__${prop}`];
            }
            return res;
        };
    }
    /**
     * Wrap a property descriptor set function.
     * @param {string} prop The property to wrap.
     * @param {object} descriptor The property descriptor.
     * @param {Function} callback An optional callback to trigger on set.
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
                } catch (ex) {
                    this[`__${prop}`] = value;
                }
            } else {
                this[`__${prop}`] = value;
            }
            let res = this[prop];
            setter.callbacks.forEach((clb) => {
                if (typeof clb === 'function') {
                    clb.call(this, prop, res);
                }
            });
            return res;
        };
        setter.callbacks = [callback];
        return setter;
    }
    /**
     * Convert a string from camelCase to dash-case.
     * @param {string} str The string to convert.
     * @return {string} The converted string.
     */
    static camelToDash(str) {
        return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
    }
    /**
     * Convert a string from dash-case to camelCase.
     * @param {string} str The string to convert.
     * @return {string} The converted string.
     */
    static dashToCamel(str) {
        return str.replace(/\W+(.)/g, (x, chr) => chr.toUpperCase());
    }
}
