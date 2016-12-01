let CustomEvent_ = self.CustomEvent;

try {
    // eslint-disable-next-line
    let ev = new self.CustomEvent('test');
} catch(ex) {
    CustomEvent_ = function(ev, params) {
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent_.prototype = self.CustomEvent.prototype;
}

export const CustomEvent = CustomEvent_;
