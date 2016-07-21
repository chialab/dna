import { DNAProperty } from './dna-property.js';

/**
 * Get an element's property descriptor.
 * @param {Function} ctr The element constructor.
 * @param {string} prop The property to analyze.
 * @return {object} The descriptor of the property.
 */
export function getDescriptor(ctr, prop) {
    let res;
    if (ctr) {
        res = Object.getOwnPropertyDescriptor(ctr, prop);
        let proto = Object.getPrototypeOf(ctr);
        if (!res && proto) {
            res = getDescriptor(proto, prop);
        }
    }
    return res;
}
/**
 * Wrap a property descriptor get function or create a new one.
 * @param {string} prop The property to wrap.
 * @param {object} descriptor The property descriptor.
 * @param {*} value The initial value.
 * @return {Function} The descriptor get function wrapped.
 */
export function wrapDescriptorGet(prop, descriptor, value) {
    let hasGetter = typeof descriptor.get === 'function';
    let getter = function() {
        let res;
        if (hasGetter) {
            res = descriptor.get.call(this);
        } else {
            res = DNAProperty.get(this, prop);
        }
        return typeof res !== 'undefined' ? res : value;
    };
    return getter;
}
/**
 * Wrap a property descriptor set function or create a new one.
 * @param {string} prop The property to wrap.
 * @param {object} descriptor The property descriptor.
 * @param {Function} callback An optional callback to trigger on set.
 * @return {Function} The descriptor set function wrapped.
 */
export function wrapDescriptorSet(prop, descriptor, callback) {
    if (descriptor && descriptor.set && descriptor.set.callbacks) {
        descriptor.set.callbacks.push(callback);
        return descriptor.set;
    }
    let setter = function(value) {
        if (descriptor.set) {
            descriptor.set.call(this, value);
        } else {
            DNAProperty.set(this, prop, value);
        }
        let res = this[prop];
        setter.callbacks.forEach((clb) => {
            if (typeof clb === 'function') {
                clb.call(this, prop, res);
            }
        });
        return res;
    };
    setter.callbacks = [callback];
    return setter;
}
