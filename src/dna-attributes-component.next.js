'use strict';

import { DNAComponent } from './dna-component.next.js'

/**
 * Simple Custom Component with attributes watching and reflecting.
 * @class DNAAttributesComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.next.js
 * ```js
 * import { DNAAttributesComponent } from 'dna/component';
 * export class MyComponent extends DNAAttributesComponent {
 *   get attributes() {
 *     return ['name'];
 *   }
 * }
 * ```
 * app.next.js
 * ```js
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.next.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * element.setAttribute('name', 'Newton');
 * console.log(element.name); // logs "Newton"
 * ```
 */

function getDescriptor(ctr, attr) {
    let res;
    if (ctr) {
        res = Object.getOwnPropertyDescriptor(ctr, attr);
        if (!res && ctr.__proto__) {
            res = getDescriptor(ctr.__proto__, attr);
        }
    }
    return res;
}

function wrapDescriptorSet(attr, descriptor) {
    if (descriptor && descriptor.set && descriptor.set.wrapped) {
        return descriptor.set;
    }
    let setter = function (value) {
        let res;
        if (descriptor.set) {
            res = descriptor.set.call(this, value);
        } else {
            res = (this['__' + attr] = value);
        }
        if (res !== null && res !== undefined) {
            if (typeof res == 'string' || typeof res == 'number') {
                this.setAttribute(attr, res);
            }
        } else {
            this.removeAttribute(attr);
        }
        return res;
    }
    setter.wrapped = true;
    return setter;
}

function wrapDescriptorGet(attr, descriptor) {
    return descriptor.get || function () {
        return this['__' + attr];
    }
}

export class DNAAttributesComponent extends DNAComponent {
	/**
     * Fires when an the element is registered.
     */
    static onRegister(...args) {
        let attributesToWatch = this.attributes || [];
		attributesToWatch.forEach((attr) => {
			let descriptor = getDescriptor(this.prototype, attr) || {};
			Object.defineProperty(this.prototype, attr, {
				configurable: true,
				get: wrapDescriptorGet(attr, descriptor),
				set: wrapDescriptorSet(attr, descriptor)
			});
		});
    }
	/**
	 * On `created` callback, sync attributes with properties.
	 */
	createdCallback() {
		DNAComponent.prototype.createdCallback.call(this);
		let attributes = this.attributes || [];
        for (let i = 0, len = attributes.length; i < len; i++) {
            let attr = attributes[i];
            this.attributeChangedCallback(attr.name, undefined, attr.value);
        }
		let ctrAttributes = this.constructor.attributes || [];
		ctrAttributes.forEach((attr) => {
			if (this[attr] !== null && this[attr] !== undefined) {
				this.setAttribute(attr, this[attr]);
			}
		});
	}
	/**
	 * On `attributeChanged` callback, sync attributes with properties.
	 * @private
	 * @param {String} attrName The changed attribute name.
     * @param {*} oldVal The value of the attribute before the change.
     * @param {*} newVal The value of the attribute after the change.
	 */
	attributeChangedCallback(attr, oldVal, newVal) {
		DNAComponent.prototype.attributeChangedCallback.call(this);
		let cl = this.constructor;
		if (cl && cl.attributes && Array.isArray(cl.attributes)) {
			if (cl.attributes.indexOf(attr) !== -1) {
				this[attr] = newVal;
			}
		}
    }
}
