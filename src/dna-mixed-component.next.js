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
	 * Trigger all `init` static methods of the implemented behaviors.
	 */
	static onRegister(...args) {
		let ctr = DNAComponent.onRegister.apply(this, args);
		let behaviors = this['behaviors'] || [];
		DNAMixedComponent.__iterateBehaviors(this, behaviors);
		DNAMixedComponent.__triggerCallbacks(this, 'onRegister', args);
		return ctr;
	}
	/**
	 * Trigger all `created` methods of the implemented behaviors.
	 * @private
	 */
	createdCallback(...args) {
		DNAComponent.prototype.createdCallback.apply(this, args);
		DNAMixedComponent.__triggerCallbacks(this, 'createdCallback', args);
	}
	/**
	 * Trigger all `attached` methods of the implemented behaviors.
	 * @private
	 */
	attachedCallback(...args) {
		DNAComponent.prototype.attachedCallback.apply(this, args);
		DNAMixedComponent.__triggerCallbacks(this, 'attachedCallback', args);
	}
	/**
     * Fires when an instance was detached from the document.
     */
    detachedCallback(...args) {
		DNAComponent.prototype.detachedCallback.apply(this, args);
		DNAMixedComponent.__triggerCallbacks(this, 'detachedCallback', args);
	}
	/**
	 * Trigger all `attributeChanged` methods of the implemented behaviors.
	 * @private
	 * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
		DNAComponent.prototype.attributeChangedCallback.apply(this, [attrName, oldVal, newVal]);
		DNAMixedComponent.__triggerCallbacks(this, 'attributeChangedCallback', [attrName, oldVal, newVal]);
	}
	/**
	 * Iterate and fire a list of callbacks.
	 * @private
	 * @param {DNAComponent} ctx The context to apply.
	 * @param {String} callbackKey The key to use to retrieve the right callback list.
	 * @param {Array} args A list of arguments to apply to the callback.
	 */
	static __triggerCallbacks(ctx, callbackKey, args) {
		let secretKey = DNAMixedComponent.__getCallbackKey(callbackKey),
		 	callbacks = ctx[secretKey] || (ctx.__proto__ && ctx.__proto__[secretKey]);
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
	static __iterateBehaviors(ctx, behavior) {
		if (Array.isArray(behavior)) {
			// if the provided behavior is complex (a list of other behaviors), iterate it.
			for (var i = 0; i < behavior.length; i++) {
				ctx.__iterateBehaviors(ctx, behavior[i]);
			}
		} else {
			// check if the behavior is already attached to the class.
			ctx.__attachedBehaviors = ctx.__attachedBehaviors || [];
			if (ctx.__attachedBehaviors.indexOf(behavior.name) !== -1) {
				return;
			}
			// iterate and attach static methods and priorities.
			var callbacks = DNAMixedComponent.__componentCallbacks,
				keys = Object.getOwnPropertyNames(behavior);
			for (let k in keys) {
				let key = keys[k];
				if (!(key in DNAComponent)) {
					if (key !== '__componentCallbacks') {
						ctx[key] = behavior[key];
					}
				}
				if (callbacks.indexOf(key) !== -1) {
					let callbackKey = DNAMixedComponent.__getCallbackKey(key);
					ctx[callbackKey] = ctx[callbackKey] || [];
					ctx[callbackKey].push(behavior[key]);
				} else if (!(key in DNAComponent)) {
					if (key !== '__componentCallbacks') {
						ctx[key] = behavior[key];
					}
				}
			}
			// iterate and attach prototype methods and priorities.
			if (behavior.prototype) {
				keys = Object.getOwnPropertyNames(behavior.prototype);
				for (let k in keys) {
					let key = keys[k];
					if (callbacks.indexOf(key) !== -1) {
						let callbackKey = DNAMixedComponent.__getCallbackKey(key);
						ctx.prototype[callbackKey] = ctx.prototype[callbackKey] || [];
						ctx.prototype[callbackKey].push(behavior.prototype[key]);
					} else if (!(key in DNAComponent.prototype)) {
						ctx.prototype[key] = behavior.prototype[key];
					}
				}
			}
			// add the callback to the attached list
			ctx.__attachedBehaviors.push(behavior.name);
		}
	}
	/**
	 * Retrieve the key to use to register a callback.
	 * @private
	 * @param {String} callbackName The type of the callback to register.
	 * @return {String} The key string.
	 */
	static __getCallbackKey(callbackName) {
		return '__' + callbackName + 'Callbacks';
	}
	/**
	 * Retrieve a list of callbacks that should not be overridden but concatenated.
	 * @private
	 * @return {Array} The list.
	 */
	static get __componentCallbacks() {
		return ['onRegister', 'createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
	}
}
