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
    const Modified = function() {
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
            if (config.extends) {
                element.setAttribute('is', this.is);
            }
            element.__proto__ = desc.Ctr.prototype;
            return element;
        }
        return null;
    };
    Modified.prototype = Object.create(Original.prototype, {
        constructor: {
            value: self[name],
            configurable: true,
            writable: true,
        },
    });
    return Modified;
}
