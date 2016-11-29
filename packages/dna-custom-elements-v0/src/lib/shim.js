import { isString } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';

/**
 * Check if a node is already instantiated HTMLElement for programmatically `constructor` calls.
 * @private
 * @param {HTMLElement} node The node to check.
 * @return {Boolean} The node should be instantiated.
 */
function isNew(node) {
    try {
        return !isString(node.outerHTML);
    } catch (ex) {
        return true;
    }
}

/**
 * Shim original Element constructors in order to be used with `new`.
 * @method shim
 * @memberof! DNA.
 * @static
 *
 * @param {Function} Original The original constructor to shim.
 * @return {Function} The shimmed constructor.
 *
 * @example
 * ```js
 * // shim audio element
 * import { shim } from '@dnajs/core';
 *
 * class MyAudio extends shim(HTMLAudioElement) {
 *     ...
 * }
 *
 * let audio = new MyAudio();
 * ```
 */
export function shim(Original) {
    class Polyfilled {
        constructor() {
            if (!isNew(this)) {
                return this;
            }
            let desc = registry.get(this.is, true);
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
    // Clone the prototype overriding the constructor.
    Polyfilled.prototype = Object.create(Original.prototype, {
        constructor: {
            value: Polyfilled,
            configurable: true,
            writable: true,
        },
    });
    return Polyfilled;
}
