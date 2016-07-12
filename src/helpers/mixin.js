import { EXCLUDE_ON_EXTEND } from 'es6-classes/src/excludes.js';
import { DNAComponent } from '../dna-component.js';
import { COMPONENT_CALLBACKS, DNACallbacks } from './callbacks.js';
import { hasDescriptor } from './descriptor.js';

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
        ctx.__attachedBehaviors = ctx.__attachedBehaviors || [];
        if (ctx.__attachedBehaviors.indexOf(behavior) !== -1) {
            return;
        }
        if (Array.isArray(behavior.behaviors)) {
            mix(ctx, behavior.behaviors);
        }
        // iterate and attach static methods and priorities.
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
            if (COMPONENT_CALLBACKS.indexOf(key) !== -1) {
                DNACallbacks.pushCallback(ctx, key, behavior[key]);
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
                if (COMPONENT_CALLBACKS.indexOf(key) !== -1) {
                    DNACallbacks.pushCallback(ctx, key, behavior.prototype[key]);
                } else if (!hasDescriptor(key, ctx.prototype)) {
                    ctx.prototype[key] = behavior.prototype[key];
                }
            });
        }
        // add the callback to the attached list
        ctx.__attachedBehaviors.push(behavior);
    }
}

export function mixin(...classes) {
    let scope = class {};
    classes.forEach((cl) => mix(scope, cl));
    return scope;
}
