import { registry } from './registry.js';

export function polyfillElement(name) {
    const Original = self[name];
    const Modified = function() {
        if (this.constructor) {
            if (this instanceof Original) {
                console.log(this);
                return this;
            }
            let desc = registry.get(this.is);
            // Find the tagname of the constructor and create a new element with it
            let element = document.createElement(
                desc.config.extends ? desc.config.extends : this.is
            );
            element.__proto__ = desc.Ctr.prototype;
            return element;
        }
        return null;
    };
    self[name] = Modified;
    self[name].prototype = Object.create(Original.prototype, {
        constructor: {
            value: self[name],
            configurable: true,
            writable: true,
        },
    });
    return self[name];
}
