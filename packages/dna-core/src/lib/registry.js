import { define } from './obj-define.js';
const sym = 'components';

/**
 * A custom components registry.
 * It replicates the [CustomElementRegistry interface](https://www.w3.org/TR/custom-elements/#custom-elements-api).
 * @name registry
 * @namespace registry
 * @memberof! DNA.
 * @static
 */
export const registry = {
    /**
     * The list of defined components.
     * @type {Object}
     */
    [sym]: {},
    /**
     * Register a new component.
     * @param {String} name The id of the component.
     * @param {Function} Ctr The component constructor.
     * @param {Object} config Optional component configuration.
     */
    define(name, Ctr, config = {}) {
        name = name.toLowerCase();
        define(Ctr.prototype, 'is', {
            get: () => name,
        });
        this[sym][name] = {
            is: name,
            Ctr,
            config,
        };
    },
    /**
     * Retrieve a component constructor by id.
     * @param {String} name The component id.
     * @param {Boolean} full Get the full component descriptor.
     * @return {Function|Object} The component constructor or a component descriptor.
     */
    get(name, full) {
        let desc = this[sym][name.toLowerCase()];
        if (desc) {
            return full ? desc : desc.Ctr;
        }
    },
};
