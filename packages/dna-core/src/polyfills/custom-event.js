let CustomEvent = self.CustomEvent;

try {
    // eslint-disable-next-line
    new CustomEvent('test');
} catch(ex) {
    let proto = CustomEvent.prototype;
    CustomEvent = function(event, params) {
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = proto;
}

export { CustomEvent };
