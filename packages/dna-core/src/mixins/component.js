import { COMPONENT_SYMBOL } from '../lib/symbols.js';

/**
 * THe base custom component mixins. Just add life cycles callback and `is` getter.
 * @mixin ComponentMixin
 * @memberof DNA.MIXINS
 * @static
 */
export const ComponentMixin = (SuperClass) => class extends SuperClass {
    /**
     * @property {String} is Get component id.
     * @name is
     * @type {String}
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    get is() {
        return (this.getAttribute('is') || this.localName).toLowerCase();
    }
    get node() {
        return this;
    }
    /**
     * Fires when an instance was inserted into the document.
     * @method connectedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    connectedCallback() {
        this.node[COMPONENT_SYMBOL] = this;
    }
    /**
     * Fires when an instance was detached from the document.
     * @method disconnectedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    disconnectedCallback() {}
    /**
     * Fires when an attribute was added, removed, or updated.
     * @method attributeChangedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     *
     * @param {String} attrName The changed attribute name.
     * @param {String} oldVal The value of the attribute before the change.
     * @param {String} newVal The value of the attribute after the change.
     */
    attributeChangedCallback() {}
};
