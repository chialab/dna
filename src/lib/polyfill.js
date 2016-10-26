import { REGISTRIES } from './registries.js';
import { isString } from './typeof.js';

function isNew(node) {
    try {
        return !isString(node.outerHTML);
    } catch (ex) {
        return true;
    }
}

export function Polyfill(Original) {
    class Polyfilled {
        constructor() {
            if (!isNew(this)) {
                return this;
            }
            let desc = REGISTRIES.default.get(this.constructor);
            let config = desc.config;
            // Find the tagname of the constructor and create a new element with it
            let element = document.createElement(
                config.extends ? config.extends : desc.is
            );
            element.__proto__ = desc.Ctr.prototype;
            if (config.extends) {
                element.setAttribute('is', desc.is);
            }
            return element;
        }
    }
    Polyfilled.prototype = Object.create(Original.prototype, {
        constructor: {
            value: Polyfilled,
            configurable: true,
            writable: true,
        },
    });
    return Polyfilled;
}
