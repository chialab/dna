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
    components: {},
    /**
     * Register a new component.
     * @param {String} name The id of the component.
     * @param {Function} Ctr The component constructor.
     * @param {Object} config Optional component configuration.
     */
    define(name, Ctr, config = {}) {
        name = name.toLowerCase();
        Object.defineProperty(Ctr.prototype, 'is', {
            get: () => name,
        });
        this.components[name] = {
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
    get(name, full = false) {
        let desc = this.components[name.toLowerCase()];
        if (desc) {
            return full ? desc : desc.Ctr;
        }
    },
};
