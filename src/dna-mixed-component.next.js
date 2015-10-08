'use strict';

import { DNABaseElement } from 'dna-base-component.next.js'

export class DNAMixedComponent extends DNABaseComponent {

	static init(...args) {
		DNABaseComponent.init.apply(this, args);
		var behaviors = this['behaviors'] || [];
		DNAMixedComponent.iterateBehaviors(this, behaviors);
		DNAMixedComponent.triggerCallbacks(this, 'init', args);
	}

	createdCallback(...args) {
		DNABaseComponent.prototype.createdCallback.apply(this, args);
		DNAMixedComponent.triggerCallbacks(this, 'created', args);
	}

	attachedCallback(...args) {
		DNABaseComponent.prototype.attachedCallback.apply(this, args);
		DNAMixedComponent.triggerCallbacks(this, 'attached', args);
	}

	attributeChangedCallback(...args) {
		DNABaseComponent.prototype.attributeChangedCallback.apply(this, args);
		DNAMixedComponent.triggerCallbacks(this, 'attributeChanged', args);
	}

	static triggerCallbacks(ctx, callback, args) {
		var callbacks = ctx[DNAMixedComponent.getCallbackKey(callback)];
		if (callbacks && Array.isArray(callbacks)) {
			for (let i = 0, len = callbacks.length; i < len; i++) {
				callbacks[i].apply(ctx, ...args);
			}
		}
	}

	static iterateBehaviors(ctx, behaviors) {
		if (Array.isArray(behaviors)) {
			for (var i = 0; i < behaviors.length; i++) {
				DNAMixedComponent.iterateBehaviors(ctx, behaviors[i]);
			}
		} else {
			var callbacks = DNAMixedComponent.componentCallbacks,
				keys = Object.getOwnPropertyNames(behaviors);
			for (let k in keys) {
				let key = keys[k];
				if (!(key in DNABaseComponent)) {
					ctx[key] = behaviors[key];
				}
				if (callbacks.indexOf(key) !== -1) {
					let callbackKey = DNAMixedComponent.getCallbackKey(key);
					ctx[callbackKey] = ctx[callbackKey] || [];
					ctx[callbackKey].push(behaviors[key]);
				} else if (!(key in DNABaseComponent)) {
					ctx[key] = behaviors[key];
				}
			}
			if (behaviors.prototype) {
				keys = Object.getOwnPropertyNames(behaviors.prototype);
				for (let k in keys) {
					let key = keys[k];
					if (callbacks.indexOf(key) !== -1) {
						let callbackKey = DNAMixedComponent.getCallbackKey(key);
						ctx.prototype[callbackKey] = ctx.prototype[callbackKey] || [];
						ctx.prototype[callbackKey].push(behaviors.prototype[key]);
					} else if (!(key in DNABaseComponent.prototype)) {
						ctx.prototype[key] = behaviors.prototype[key];
					}
				}
			}
		}
	}

	static getCallbackKey(callback) {
		return '__' + callback + 'Callbacks';
	}

	static get componentCallbacks() {
		return ['init', 'created', 'attached', 'attributeChanged'];
	}
}
