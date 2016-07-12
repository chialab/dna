/**
 * Shim for Safari
 * @see https://github.com/babel/babel/issues/1548
 * @see https://bugs.webkit.org/show_bug.cgi?id=114457
 *
 * @param {string} elemCtrName The global variable name
 * of the Element constructor to polyfill.
 */
export function polyfillElement(elemCtrName) {
    if (typeof window !== 'undefined') {
        let elemCtr = window[elemCtrName];
        if (typeof elemCtr === 'object' && elemCtr.hasOwnProperty('prototype')) {
            let _Element = function() {};
            _Element.prototype = elemCtr.prototype;
            window[elemCtrName] = _Element;
        }
        return window[elemCtrName];
    }
    return;
}
