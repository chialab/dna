/* global customElements */
import { digest } from '../helpers/digest.js';
import 'dna/polyfills/src/extra/custom-elements.js';

export * from '../dna.js';

/**
 * Create the Component constructor.
 * @param {String} tagName The nickname of the Component.
 * @param {Function} Component The definition of the Component.
 * @param {Object} config A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function register(...args) {
    let pre = digest(...args);
    let Scope = pre.scope;
    let config = pre.config;
    let tagName = pre.tagName;
    Object.defineProperty(Scope.prototype, 'is', {
        configurable: false,
        get: () => tagName,
    });
    customElements.define(tagName, Scope, config);
    return Scope;
}
