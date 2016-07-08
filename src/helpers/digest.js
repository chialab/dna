import { classToElement } from './class-to-element.js';

/**
 * Normalize the `register` method arguments.
 * @param {Function|String} fn The definition or the tag name of the Custom Element.
 * @param {Object|Function} options A set of options or the Component class
                                    for the registration of the Custom Element.
 * @return {Object} A descriptor of the component with `tagName`, `config` and `scope` keys.
 */
export function digest(fn, options = {}) {
    let scope;
    let config = {};
    let tagName;
    if (typeof fn === 'string') {
        tagName = fn;
        if (typeof options === 'function') {
            scope = options;
            config = {};
        } else {
            if (typeof options === 'object') {
                config = options;
            }
            if (typeof config.prototype !== 'undefined') {
                scope = config.prototype;
            }
        }
    } else {
        scope = fn;
        if (typeof options === 'object') {
            config = options;
        }
    }
    if (typeof scope === 'function') {
        tagName = tagName ||
            config.tagName ||
            (scope.hasOwnProperty('tagName') && scope.tagName) ||
            classToElement(scope);
        config.prototype = scope.prototype;
        if (!config.extends && typeof scope.extends === 'string') {
            config.extends = scope.extends;
        }
    } else if (typeof scope === 'object') {
        config.prototype = scope;
        scope = function(...args) {
            config.prototype.constructor.apply(this, args);
        };
        scope.prototype = config.prototype;
    }
    if (config.prototype) {
        config.prototype = Object.create(config.prototype);
    }
    return {
        tagName,
        config,
        scope,
    };
}
