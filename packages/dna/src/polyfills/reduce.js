/* eslint-disable prefer-rest-params */
export const reduce = Array.prototype.reduce || function(callback /*, initialValue*/ ) {
    'use strict';
    let t = this;
    let len = t.length;
    let k = 0;
    let value;
    if (arguments.length === 2) {
        value = arguments[1];
    } else {
        while (k < len && !(k in t)) {
            k++;
        }
        value = t[k++];
    }
    for (; k < len; k++) {
        if (k in t) {
            value = callback(value, t[k], k, t);
        }
    }
    return value;
};
