import { isFunction } from '@chialab/proteins';
import { registry } from '@dnajs/core';

/**
 * Attach a component prototype to an already instantiated HTMLElement.
 * @method bind
 * @memberof DNA.DOM
 *
 * @param {HTMLElement} node The node to update.
 * @return {Boolean} The prototype has been attached.
 */
export function bind(node) {
    let Ctr = registry.get(node.getAttribute('is') || node.tagName);
    if (isFunction(Ctr)) {
        node.__proto__ = Ctr.prototype;
        Object.defineProperty(node, 'constructor', {
            value: Ctr,
            configurable: true,
            writable: true,
        });
        Ctr.call(node);
        return true;
    }
    return false;
}
