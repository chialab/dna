const ELEM_PROTO = Element.prototype;

export const matches = ELEM_PROTO.matches ||
    ELEM_PROTO.mozMatchesSelector ||
    ELEM_PROTO.msMatchesSelector ||
    ELEM_PROTO.oMatchesSelector ||
    ELEM_PROTO.webkitMatchesSelector;
