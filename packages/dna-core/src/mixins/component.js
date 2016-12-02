import { DNA_SYMBOL, COMPONENT_SYMBOL, NODE_SYMBOL } from '../lib/symbols.js';
import { notifications } from '../lib/notifications.js';

/**
 * The base custom component mixins. Just add life cycles callback and `is` getter.
 * @mixin ComponentMixin
 * @memberof DNA.MIXINS
 * @static
 */
export const ComponentMixin = (SuperClass) => class extends SuperClass {
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
     * Fires on component creation.
     * @method constructor
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    constructor() {
        super();
        notifications.trigger('created', this);
    }
    /**
     * Fires when an instance was inserted into the document.
     * @method connectedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    connectedCallback() {
        this.node[COMPONENT_SYMBOL] = this;
        notifications.trigger('connected', this);
    }
    /**
     * Fires when an instance was detached from the document.
     * @method disconnectedCallback
     * @memberof DNA.MIXINS.ComponentMixin
     * @instance
     */
    disconnectedCallback() {
        notifications.trigger('disconnected', this);
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
