import { DNAComponent } from './dna-component.js';
import { registry } from './helpers/registry.js';
import { DNACallbacks } from './helpers/callbacks.js';
import { mix } from './helpers/mixin.js';

/**
 * Iterate and fire a list of callbacks.
 * @private
 * @param {DNAComponent} ctx The context to apply.
 * @param {String} callbackKey The key to use to retrieve the right callback list.
 * @param {Array} args A list of arguments to apply to the callback.
 */
function triggerCallbacks(ctx, callbackKey, args) {
    let ctr = ctx;
    if (typeof ctr !== 'function') {
        ctr = registry(ctx.is);
    }
    if (!ctr) {
        return false;
    }
    let callbacks = DNACallbacks.getCallbacks(ctr, callbackKey);
    if (callbacks && Array.isArray(callbacks)) {
        for (let i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(ctx, args);
        }
    }
    return true;
}

/**
 * This is another model to use to create DNA Custom Components mixing a list of prototypes.
 * Implement a get method for the `behaviors` property which returns a list of Prototypes.
 * @class DNAMixedComponent
 * @extends DNAComponent
 */
export class DNAMixedComponent extends DNAComponent {
    /**
     * Attach behaviors' static and class methods and properties to the current class.
     * Trigger all `onRegister` static methods of the implemented behaviors.
     */
    static onRegister(...args) {
        let ctr = this;
        DNAComponent.onRegister.apply(this, args);
        let behaviors = this.behaviors || [];
        mix(this, behaviors);
        triggerCallbacks(this, 'onRegister', args);
        delete this.__attachedBehaviors;
        return ctr;
    }
    /**
     * Trigger all `createdCallback` methods of the implemented behaviors.
     * @private
     */
    createdCallback() {
        super.createdCallback();
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
