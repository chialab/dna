import { registry } from './registry.js';

/**
 * Register a new component.
 * @method define
 * @memberof! DNA.
 * @static
 *
 * @param {String} name The id of the component.
 * @param {Function} Ctr The component constructor.
 * @param {Object} config Optional component configuration.
 */
export function define(tagName, Component, config) {
    return registry.define(tagName, Component, config);
}
