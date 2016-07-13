/**
 * Shim for Safari
 * @see https://github.com/babel/babel/issues/1548
 * @see https://bugs.webkit.org/show_bug.cgi?id=114457
 *
 * @param {string} elemCtrName The global variable name
 * of the Element constructor to polyfill.
 */
export function polyfillElement(elemCtrName) {
    let origHTMLElement = window[elemCtrName];
    window[elemCtrName] = function() {
        // prefer new.target for elements that call super() constructors or
        // Reflect.construct directly
        let newTarget = new.target || this.constructor;
        return Reflect.construct(origHTMLElement, [], newTarget);
    };
    HTMLElement.prototype = Object.create(origHTMLElement);
    Object.defineProperty(HTMLElement.prototype, 'constructor', {
        value: window[elemCtrName],
    });
}
