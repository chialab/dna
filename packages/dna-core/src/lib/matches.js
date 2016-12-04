/**
 * Alias to Element prototype.
 * @type {Object}
 * @private
 */
const ELEM_PROTO = Element.prototype;

/**
 * Alias to `Element.prototype.matches`.
 * @type {Function}
 * @private
 */
const MATCHES_SELECTOR = ELEM_PROTO.matches ||
    ELEM_PROTO.mozMatchesSelector ||
    ELEM_PROTO.msMatchesSelector ||
    ELEM_PROTO.oMatchesSelector ||
    ELEM_PROTO.webkitMatchesSelector;

/**
 * Polyfill for `Element.matches API`.
 * @private
 *
 * @param {HTMLElement} target The node to check.
 * @param {String} selector The selector to match.
 * @return {Boolean} The target matches the selector.
 */
export function matches(target, selector) {
    return MATCHES_SELECTOR.call(target, selector);
}
