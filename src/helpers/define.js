import { registry } from './registry.js';
import { isUndefined } from './typeof.js';
import './tree-observer.js';

/**
 * Create the Component constructor.
 * @param {String} tagName The nickname of the Component.
 * @param {Function} Component The definition of the Component.
 * @param {Object} config A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function define(tagName, Component, config) {
    config = config || {};
    Object.defineProperty(Component.prototype, 'is', {
        configurable: false,
        get: () => tagName,
    });
    registry.define(tagName, Component, config);
    if (!isUndefined(self.customElements)) {
        self.customElements.define(tagName, Component, config);
    }
    return Component;
}
