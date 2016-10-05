import { isFunction } from './typeof.js';

function isNative(fn) {
    return (/\{\s*\[native code\]\s*\}/).test(`${fn}`);
}

/**
 * Get an element's property descriptor.
 * @param {Function} ctr The element constructor.
 * @param {string} prop The property to analyze.
 * @return {object} The descriptor of the property.
 */
export function getDescriptor(ctr, prop) {
    return ctr &&
        (Object.getOwnPropertyDescriptor(ctr, prop) ||
        getDescriptor(Object.getPrototypeOf(ctr), prop));
}
/**
 * Wrap a property descriptor get function or create a new one.
 * @param {string} prop The property to wrap.
 * @param {object} descriptor The property descriptor.
 * @param {*} value The initial value.
 * @return {Function} The descriptor get function wrapped.
 */
export function wrapDescriptorGet(prop, descriptor, value) {
    return function() {
        if (isFunction(descriptor.get) && !isNative(descriptor.get)) {
            return descriptor.get.call(this);
        }
        return isFunction(value) ? value.call(this, prop) : value;
    };
}

/**
 * Wrap a property descriptor set function or create a new one.
 * @param {string} prop The property to wrap.
 * @param {object} descriptor The property descriptor.
 * @param {Function} callback An optional callback to trigger on set.
 * @return {Function} The descriptor set function wrapped.
 */
export function wrapDescriptorSet(prop, descriptor, callback) {
    return function(value) {
        if (isFunction(descriptor.set) && !isNative(descriptor.set)) {
            return descriptor.set.call(this, value);
        }
        return callback.call(this, prop, value);
    };
}
