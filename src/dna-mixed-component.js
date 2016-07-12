import { DNAComponent } from './dna-component.js';
import { triggerCallbacks } from './helpers/trigger-callbacks.js';
import { mix } from './helpers/mixin.js';

const CREATED_MAP = new WeakMap();

/**
 * This is another model to use to create DNA Custom Components mixing a list of prototypes.
 * Implement a get method for the `behaviors` property which returns a list of Prototypes.
 * @class DNAMixedComponent
 * @extends DNAComponent
 */
export class DNAMixedComponent extends DNAComponent {
    /**
     * Trigger all `createdCallback` methods of the implemented behaviors.
     * @private
     */
    createdCallback() {
        super.createdCallback();
        let Ctr = this.constructor;
        if (!CREATED_MAP.get(Ctr)) {
            mix(Ctr, Ctr.behaviors || []);
            delete Ctr.__attachedBehaviors;
            CREATED_MAP.set(Ctr, true);
        }
        triggerCallbacks(this, 'createdCallback');
    }
    /**
     * Trigger all `attachedCallback` methods of the implemented behaviors.
     * @private
     */
    attachedCallback() {
        super.attachedCallback();
        triggerCallbacks(this, 'attachedCallback');
    }
    /**
     * Trigger all `detachedCallback` methods of the implemented behaviors.
     * @private
     */
    detachedCallback() {
        super.detachedCallback();
        triggerCallbacks(this, 'detachedCallback');
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
