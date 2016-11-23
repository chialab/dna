import { isFunction, isString } from './typeof.js';

/**
 * A custom components registry.
 * It replicates the [CustomElementRegistry interface](https://www.w3.org/TR/custom-elements/#custom-elements-api).
 * @type {Object}
 */
export const registry = {
    /**
     * The list of defined components.
     * @type {Object}
     */
    components: {},
    /**
     * Register a new component.
     * @param {String} name The id of the component.
     * @param {Function} Ctr The component constructor.
     * @param {Object} config Optional component configuration.
     */
    define(name, Ctr, config = {}) {
        this.components[name.toLowerCase()] = {
            is: name,
            Ctr,
            config,
        };
    },
    /**
     * Retrieve a component descriptor by id.
     * @private
     * @param {String} name The component id.
     * @return {Object} The component descriptor.
     */
    getDescriptor(name) {
        if (isString(name)) {
            return this.components[name.toLowerCase()];
        } else if (isFunction(name)) {
            for (let k in this.components) {
                let desc = this.components[k];
                if (desc.Ctr === name) {
                    return desc;
                }
            }
        }
    },
    /**
     * Retrieve a component constructor by id.
     * @param {String} name The component id.
     * @return {Function} The component constructor.
     */
    get(name) {
        let desc = this.getDescriptor(name);
        if (desc) {
            return desc.Ctr;
        }
    },
};
