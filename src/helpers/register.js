/**
 * Create the Component constructor.
 * @param {String} tagName The nickname of the Component.
 * @param {Function} Component The definition of the Component.
 * @param {Object} config A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function register(tagName, Component, config = {}) {
    let res = function(element) {
        element = element || document.createElement(config.extends ? config.extends : tagName);
        element.__proto__ = Component.prototype;
        Component.prototype.constructor.call(element);
        return element;
    };
    res.prototype = Component.prototype;
    Object.defineProperty(res.prototype, 'constructor', {
        configurable: false,
        get: () => Component,
    });
    return res;
}
