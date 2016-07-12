import { digest } from '../helpers/digest.js';

export * from '../dna.js';

/**
 * Register a Custom Element.
 * `document.registerElement`-like interface.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function register(...args) {
    let pre = digest(...args);
    let scope = pre.scope;
    let config = pre.config;
    let tagName = pre.tagName;
    config.prototype = Object.create(config.prototype, {
        is: {
            configurable: false,
            get: () => tagName,
        },
    });
    let res = document.registerElement(tagName, config);
    Object.defineProperty(res.prototype, 'constructor', {
        configurable: false,
        get: () => scope,
    });
    return res;
}
