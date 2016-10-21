import { registry } from './registry.js';
import { isString } from './typeof.js';

function isNew(node) {
    try {
        return !isString(node.outerHTML);
    } catch (ex) {
        return true;
    }
}

export function Polyfill(Original) {
    function Modified() {
        if (this.constructor) {
            if (!isNew(this)) {
                return this;
            }
            let desc = registry.get(this.is);
            let config = desc.config;
            // Find the tagname of the constructor and create a new element with it
            let element = document.createElement(
                config.extends ? config.extends : this.is
            );
            element.__proto__ = desc.Ctr.prototype;
            if (config.extends) {
                element.setAttribute('is', this.is);
            }
            return element;
        }
        return null;
    }
    Modified.prototype = Object.create(Original.prototype, {
        constructor: {
            value: Modified,
            configurable: true,
            writable: true,
        },
    });
    return Modified;
}
