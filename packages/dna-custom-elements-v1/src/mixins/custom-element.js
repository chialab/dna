import { COMPONENT_SYMBOL } from '@dnajs/core/src/core.js';

export const CustomElementMixin = (superClass) => class extends superClass {
    /**
     * @property {String} is Get component id.
     * @name is
     * @type {String}
     * @memberof DNA.MIXINS.CustomElementMixin
     * @instance
     */
    get is() {
        return (this.node.getAttribute('is') || this.node.localName).toLowerCase();
    }
    constructor() {
        super();
        this[COMPONENT_SYMBOL] = this;
    }
};
