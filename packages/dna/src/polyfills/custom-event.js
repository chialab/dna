let CustomEvent;

try {
    // eslint-disable-next-line
    let ev = new self.CustomEvent('test');
    CustomEvent = self.CustomEvent;
} catch(ex) {
    CustomEvent = function(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined,
        };
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = self.CustomEvent.prototype;
}

export { CustomEvent };
