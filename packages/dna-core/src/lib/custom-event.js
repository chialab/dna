/**
 * Alias to native `CustomEvent`.
 * @type {Function}
 * @private
 */
let CustomEvent = self.CustomEvent;

try {
    // eslint-disable-next-line
    new CustomEvent('test');
} catch(ex) {
    /**
     * Polyfill `CustomEvent`.
     * @type {Function}
     * @private
     */
    CustomEvent = function(ev, params) {
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(ev, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = self.CustomEvent.prototype;
}

/** Polyfill for CustomEvent constructor. */
export { CustomEvent };
