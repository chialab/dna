import { isFunction } from '@dnajs/core/src/lib/typeof.js';
import { define } from '@dnajs/core/src/helpers/obj-define.js';
import { registry } from '@dnajs/core/src/lib/registry.js';

/**
 * Attach a component prototype to an already instantiated HTMLElement.
 * @method bind
 * @memberof DNA.DOM
 * @static
 *
 * @param {HTMLElement} node The node to update.
 * @return {Boolean} The prototype has been attached.
 */
export function bind(node) {
    let Ctr = registry.get(node.getAttribute('is') || node.tagName);
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
