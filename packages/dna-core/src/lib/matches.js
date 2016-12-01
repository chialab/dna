/** Polyfill for `Element.matches API`. */

const ELEM_PROTO = Element.prototype;

const MATCHES_SELECTOR = ELEM_PROTO.matches ||
    ELEM_PROTO.mozMatchesSelector ||
    ELEM_PROTO.msMatchesSelector ||
    ELEM_PROTO.oMatchesSelector ||
    ELEM_PROTO.webkitMatchesSelector;

export function matches(target, selector) {
    return MATCHES_SELECTOR.call(target, selector);
}
