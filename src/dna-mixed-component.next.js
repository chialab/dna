'use strict';

import { DNAComponent } from './dna-component.next.js';

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
        super.onRegister(...args);
        __componentCallbacks.forEach((key) => {
            let callbackKey = __getCallbackKey(key);
            this[callbackKey] = [];
        });
        let behaviors = this['behaviors'] || [];
        __iterateBehaviors(this, behaviors);
        __triggerCallbacks(this, 'onRegister', args);
        delete this.__attachedBehaviors;
        return ctr;
    }
    /**
     * Trigger all `createdCallback` methods of the implemented behaviors.
     * @private
     */
    createdCallback() {
        super.createdCallback();
        __triggerCallbacks(this, 'createdCallback', args);
    }
    /**
     * Trigger all `attachedCallback` methods of the implemented behaviors.
     * @private
     */
    attachedCallback() {
        super.attachedCallback();
        __triggerCallbacks(this, 'attachedCallback', args);
    }
    /**
     * Trigger all `detachedCallback` methods of the implemented behaviors.
     * @private
     */
    detachedCallback() {
        super.detachedCallback();
        __triggerCallbacks(this, 'detachedCallback', args);
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
        __triggerCallbacks(this, 'attributeChangedCallback', [attrName, oldVal, newVal]);
    }
}

/**
 * Iterate and fire a list of callbacks.
 * @private
 * @param {DNAComponent} ctx The context to apply.
 * @param {String} callbackKey The key to use to retrieve the right callback list.
 * @param {Array} args A list of arguments to apply to the callback.
 */
function __triggerCallbacks(ctx, callbackKey, args) {
    let ctr = ctx;
    if (typeof ctr !== 'function' && ctr.constructor) {
        ctr = ctr.constructor;
    }
    let secretKey = __getCallbackKey(callbackKey),
        callbacks = ctr[secretKey] || (ctr.__proto__ && ctr.__proto__[secretKey]);
    if (callbacks && Array.isArray(callbacks)) {
        for (let i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(ctx, args);
        }
    }
}
/**
 * Iterate and attach behaviors to the class.
 * @private
 * @param {Array} behavior A list of classes.
 */
function __iterateBehaviors(ctx, behavior) {
    if (Array.isArray(behavior)) {
        // if the provided behavior is complex (a list of other behaviors), iterate it.
        for (var i = 0; i < behavior.length; i++) {
            __iterateBehaviors(ctx, behavior[i]);
        }
    } else {
        // check if the behavior is already attached to the class.
        ctx.__attachedBehaviors = ctx.__attachedBehaviors || [];
        if (ctx.__attachedBehaviors.indexOf(behavior) !== -1) {
            return;
        }
        // iterate and attach static methods and priorities.
        var callbacks = __componentCallbacks,
            keys = Object.getOwnPropertyNames(behavior);
        for (let k in keys) {
            let key = keys[k];
            if (!(key in DNAComponent)) {
                ctx[key] = behavior[key];
            }
            if (callbacks.indexOf(key) !== -1) {
                let callbackKey = __getCallbackKey(key);
                ctx[callbackKey] = ctx[callbackKey] || [];
                ctx[callbackKey].push(behavior[key]);
            } else if (!(key in DNAComponent)) {
                ctx[key] = behavior[key];
            }
        }
        // iterate and attach prototype methods and priorities.
        if (behavior.prototype) {
            keys = Object.getOwnPropertyNames(behavior.prototype);
            for (let k in keys) {
                let key = keys[k];
                if (callbacks.indexOf(key) !== -1) {
                    let callbackKey = __getCallbackKey(key);
                    ctx[callbackKey] = ctx[callbackKey] || [];
                    ctx[callbackKey].push(behavior.prototype[key]);
                } else if (!(key in DNAComponent.prototype)) {
                    ctx.prototype[key] = behavior.prototype[key];
                }
            }
        }
        // add the callback to the attached list
        ctx.__attachedBehaviors.push(behavior);
    }
}
/**
 * Retrieve the key to use to register a callback.
 * @private
 * @param {String} callbackName The type of the callback to register.
 * @return {String} The key string.
 */
function __getCallbackKey(callbackName) {
    return '__' + callbackName + 'Callbacks';
}
/**
 * Retrieve a list of callbacks that should not be overridden but concatenated.
 * @private
 * @return {Array} The list.
 */
let __componentCallbacks = ['onRegister', 'createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
