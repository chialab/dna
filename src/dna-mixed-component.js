import { DNAComponent } from './dna-component.js';
import { EXCLUDE_ON_EXTEND, getDescriptor } from './dna-helper.js';

/**
 * Retrieve a list of callbacks that should not be overridden but concatenated.
 * @private
 * @return {Array} The list.
 */
let componentCallbacks = [
    'onRegister',
    'createdCallback',
    'attachedCallback',
    'detachedCallback',
    'attributeChangedCallback',
];

/**
 * Retrieve the key to use to register a callback.
 * @private
 * @param {String} callbackName The type of the callback to register.
 * @return {String} The key string.
 */
function getCallbackKey(callbackName) {
    return `__${callbackName}Callbacks`;
}

/**
 * Iterate and fire a list of callbacks.
 * @private
 * @param {DNAComponent} ctx The context to apply.
 * @param {String} callbackKey The key to use to retrieve the right callback list.
 * @param {Array} args A list of arguments to apply to the callback.
 */
function triggerCallbacks(ctx, callbackKey, args) {
    let ctr = ctx;
    if (typeof ctr !== 'function' && ctr.constructor) {
        ctr = ctr.constructor;
    }
    let secretKey = getCallbackKey(callbackKey);
    let proto = Object.getPrototypeOf(ctr);
    let callbacks = ctr[secretKey] || (proto && proto[secretKey]);
    if (callbacks && Array.isArray(callbacks)) {
        for (let i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(ctx, args);
        }
    }
}

/**
 * Check if a key is already defined in a prototype.
 * @private
 * @param {string} key The key to search.
 * @param {Object} proto Function prototype.
 * @return {boolean}
 */
function hasDefinition(key, proto) {
    while (proto) {
        let desc = getDescriptor(proto, key);
        if (desc) {
            return true;
        }
        proto = proto.prototype;
    }
    return false;
}

/**
 * Iterate and attach behaviors to the class.
 * @private
 * @param {Array} behavior A list of classes.
 */
function iterateBehaviors(ctx, behavior) {
    if (Array.isArray(behavior)) {
        // if the provided behavior is complex (a list of other behaviors), iterate it.
        for (let i = 0; i < behavior.length; i++) {
            iterateBehaviors(ctx, behavior[i]);
        }
    } else {
        // check if the behavior is already attached to the class.
        ctx.__attachedBehaviors = ctx.__attachedBehaviors || [];
        if (ctx.__attachedBehaviors.indexOf(behavior) !== -1) {
            return;
        }
        if (Array.isArray(behavior.behaviors)) {
            iterateBehaviors(ctx, behavior.behaviors);
        }
        // iterate and attach static methods and priorities.
        let callbacks = componentCallbacks;
        let staticKeys = [];
        let _behavior = behavior;
        while (_behavior && _behavior !== DNAComponent) {
            Object.getOwnPropertyNames(_behavior).forEach((key) => {
                if (staticKeys.indexOf(key) === -1 && EXCLUDE_ON_EXTEND.indexOf(key) === -1) {
                    staticKeys.push(key);
                }
            });
            _behavior = Object.getPrototypeOf(_behavior);
        }
        staticKeys.forEach((key) => {
            if (callbacks.indexOf(key) !== -1) {
                let callbackKey = getCallbackKey(key);
                ctx[callbackKey] = ctx[callbackKey] || [];
                ctx[callbackKey].push(behavior[key]);
            } else if (!(key in ctx)) {
                ctx[key] = behavior[key];
            }
        });
        // iterate and attach prototype methods and properties.
        if (behavior.prototype) {
            let protoKeys = [];
            let _proto = behavior.prototype || Object.getPrototypeOf(behavior);
            while (_proto && _proto !== DNAComponent.prototype) {
                Object.getOwnPropertyNames(_proto).forEach((key) => {
                    if (protoKeys.indexOf(key) === -1) {
                        protoKeys.push(key);
                    }
                });
                _proto = _proto.prototype || Object.getPrototypeOf(_proto);
            }
            protoKeys.forEach((key) => {
                if (callbacks.indexOf(key) !== -1) {
                    let callbackKey = getCallbackKey(key);
                    ctx[callbackKey] = ctx[callbackKey] || [];
                    ctx[callbackKey].push(behavior.prototype[key]);
                } else if (!hasDefinition(key, ctx.prototype)) {
                    ctx.prototype[key] = behavior.prototype[key];
                }
            });
        }
        // add the callback to the attached list
        ctx.__attachedBehaviors.push(behavior);
    }
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
        componentCallbacks.forEach((key) => {
            let callbackKey = getCallbackKey(key);
            this[callbackKey] = [];
        });
        let behaviors = this.behaviors || [];
        iterateBehaviors(this, behaviors);
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