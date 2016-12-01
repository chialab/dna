import { isFunction } from '@dnajs/core/src/lib/typeof.js';
import { define } from '@dnajs/core/src/lib/obj-define.js';

/**
 * Attach a component prototype to an already instantiated HTMLElement.
 * @method bind
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} node The node to update.
 * @param {Function} Ctr The component class to use (leave empty for auto detect).
 * @return {Boolean} The prototype has been attached.
 */
export function bind(node, Ctr) {
    if (isFunction(Ctr)) {
        node.__proto__ = Ctr.prototype;
        define(node, 'constructor', {
            value: Ctr,
            configurable: true,
            writable: true,
        });
        Ctr.call(node);
        return true;
    }
    return false;
}
