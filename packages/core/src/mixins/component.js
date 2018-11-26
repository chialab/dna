import { DNA_SYMBOL, COMPONENT_SYMBOL, NODE_SYMBOL, CONNECTED_SYMBOL } from '../lib/symbols.js';

/**
 * The base custom component mixins. Just add life cycles callback and `is` getter.
 * @mixin ComponentMixin
 * @memberof DNA.MIXINS
 *
 * @param {Function} SuperClass The class to extend.
 * @return {Function} The extended class.
 */
export const ComponentMixin = (SuperClass) => {
    const Component = class extends SuperClass {
        /**
         * @private
         */
        get [DNA_SYMBOL]() {
            return true;
        }
        /**
         * @property {HTMLElement} node Get component node reference.
         * @name node
         * @type {HTMLElement}
         * @memberof DNA.MIXINS.ComponentMixin
         * @instance
         */
        get node() {
            return this[NODE_SYMBOL];
        }
        set node(node) {
            node[COMPONENT_SYMBOL] = this;
            this[NODE_SYMBOL] = node;
        }
        /**
         * Check if an instance was inserted into the document.
         * @property {Boolean} isConnected Get the component connection status.
         * @name isConnected
         * @type {Boolean}
         * @memberof DNA.MIXINS.ComponentMixin
         * @instance
         */
        get isConnected() {
            return !!this[CONNECTED_SYMBOL];
        }
        /**
         * Fires when an instance was inserted into the document.
         * @method connectedCallback
         * @memberof DNA.MIXINS.ComponentMixin
         * @instance
         */
        connectedCallback() {
            this.node[COMPONENT_SYMBOL] = this;
            this[CONNECTED_SYMBOL] = true;
        }
        /**
         * Fires when an instance was detached from the document.
         * @method disconnectedCallback
         * @memberof DNA.MIXINS.ComponentMixin
         * @instance
         */
        disconnectedCallback() {
            this[CONNECTED_SYMBOL] = false;
        }
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

    return Component;
};
