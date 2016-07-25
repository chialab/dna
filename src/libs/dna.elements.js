/* global customElements */
import 'dna/polyfills/src/extra/custom-elements.js';

export * from '../dna.js';

/**
 * Create the Component constructor.
 * @param {String} tagName The nickname of the Component.
 * @param {Function} Component The definition of the Component.
 * @param {Object} config A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function register(tagName, Component, config = {}) {
    Object.defineProperty(Component.prototype, 'is', {
        configurable: false,
        get: () => tagName,
    });
    customElements.define(tagName, Component, config);
    return Component;
}
