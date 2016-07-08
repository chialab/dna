import { wrapDescriptorGet, wrapDescriptorSet } from './descriptor.js';

/**
 * Wrap prototype properties in top-level element.
 * @param {Object} main The top-level element which needs the prototype properties.
 * @param {Object} currentProto The current prototype to analyze.
 * @param {Boolean} includeFunctions Should deine methods too.
 * @param {Function} callback A setter callback for the property (optional).
 */
export function wrapPrototype(main, currentProto, includeFunctions = true, callback, handled = []) {
    Object.getOwnPropertyNames(currentProto)
        .forEach((prop) => {
            let descriptor = Object.getOwnPropertyDescriptor(currentProto, prop) || {};
            let isFunction = typeof descriptor.value === 'function';
            if (handled.indexOf(prop) === -1) {
                if (typeof descriptor.value === 'undefined' || !isFunction) {
                    handled.push(prop);
                    if (descriptor.configurable !== false) {
                        Object.defineProperty(main, prop, {
                            configurable: true,
                            get: wrapDescriptorGet(prop, descriptor, descriptor.value),
                            set: wrapDescriptorSet(prop, descriptor, callback),
                        });
                    }
                } else if (isFunction && includeFunctions) {
                    handled.push(prop);
                    Object.defineProperty(main, prop, descriptor);
                }
            }
        });
    let nextProto = currentProto.prototype || Object.getPrototypeOf(currentProto);
    if (nextProto && nextProto !== HTMLElement.prototype) {
        wrapPrototype(main, nextProto, includeFunctions, callback, handled);
    }
}
