let origHTMLElement = self.HTMLElement;

const HTMLElement = function() {
    return Reflect.construct(origHTMLElement, [], this.constructor);
};

HTMLElement.prototype = Object.create(origHTMLElement.prototype, {
    constructor: {
        value: HTMLElement,
        configurable: true,
        writable: true,
    },
});

export const ELEMENTS = {
    HTMLElement,
};
