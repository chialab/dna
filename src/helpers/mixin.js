import { DNAComponent } from '../dna-component.js';
import { COMPONENT_CALLBACKS, DNACallbacks } from './callbacks.js';
import { hasDescriptor } from './descriptor.js';

const ATTACHED_MAP = new WeakMap();

/**
 * Iterate and attach behaviors to the class.
 * @param {Array} behavior A list of classes.
 */
export function mix(ctx, behavior) {
    if (Array.isArray(behavior)) {
        // if the provided behavior is complex (a list of other behaviors), iterate it.
        for (let i = 0; i < behavior.length; i++) {
            mix(ctx, behavior[i]);
        }
    } else {
        // check if the behavior is already attached to the class.
        let attached = ATTACHED_MAP.get(ctx) || [];
        if (attached.indexOf(behavior) !== -1) {
            return;
        }
        if (Array.isArray(behavior.behaviors)) {
            mix(ctx, behavior.behaviors);
        }
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
                if (COMPONENT_CALLBACKS.indexOf(key) !== -1) {
                    DNACallbacks.pushCallback(ctx, key, behavior.prototype[key]);
                } else if (!hasDescriptor(key, ctx)) {
                    ctx[key] = behavior.prototype[key];
                }
            });
        }
        // add the callback to the attached list
        attached.push(behavior);
        ATTACHED_MAP.set(ctx, attached);
    }
}
