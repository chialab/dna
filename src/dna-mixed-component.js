import { DNAComponent } from './dna-component.js';
import { triggerCallbacks } from './helpers/trigger-callbacks.js';
import { mix } from './helpers/mixin.js';

/**
 * This is another model to use to create DNA Custom Components mixing a list of prototypes.
 * Implement a get method for the `behaviors` property which returns a list of Prototypes.
 * @class DNAMixedComponent
 * @extends DNAComponent
 */
export class DNAMixedComponent extends DNAComponent {
    /**
     * Trigger all `constructor` methods of the implemented behaviors.
     * @private
     */
    constructor() {
        super();
        let Ctr = this.constructor;
        mix(this, Ctr.behaviors || []);
        triggerCallbacks(this, 'constructor');
    }
    /**
     * Trigger all `connectedCallback` methods of the implemented behaviors.
     * @private
     */
    connectedCallback() {
        super.connectedCallback();
        triggerCallbacks(this, 'connectedCallback');
    }
    /**
     * Trigger all `disconnectedCallback` methods of the implemented behaviors.
     * @private
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        triggerCallbacks(this, 'disconnectedCallback');
    }
    /**
     * Trigger all `attributeChanged` methods of the implemented behaviors.
     * @private
     * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
        triggerCallbacks(this, 'attributeChangedCallback', [attrName, oldVal, newVal]);
    }
}
