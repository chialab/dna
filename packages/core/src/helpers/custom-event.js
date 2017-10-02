let CustomEvent = self.CustomEvent;

try {
    // eslint-disable-next-line
    new CustomEvent('test');
} catch(ex) {
    CustomEvent = function(ev, params) {
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(ev, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = self.CustomEvent.prototype;
}

/**
 * Polyfill `CustomEvent`.
 * @type {Function}
 * @private
 */
export { CustomEvent };
