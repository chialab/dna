import { digest, create as _create } from '../dna-helper.next.js';

export * from '../dna.next.js';

/**
 * Register a Custom Element.
 * `document.registerElement`-like interface.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function register(fn, options = {}) {
    let pre = digest(fn, options);
    let scope = pre.scope;
    let config = pre.config;
    let tagName = pre.tagName;

    if (typeof scope.onRegister === 'function') {
        scope.onRegister.call(scope, tagName);
    }
    let res = document.registerElement(tagName, config);
    Object.defineProperty(res.prototype, 'is', {
        configurable: false,
        get: () => tagName,
    });
    if (typeof scope === 'function') {
        res.prototype.constructor = scope;
    }
    return res;
}

export function create(fn, options = {}) {
    return _create(fn, options, register);
}
