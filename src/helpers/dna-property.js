import { isFunction } from './typeof.js';

/**
 * Handle objects private properties using a WeakMap.
 * @class DNAProperty
 *
 * @example
 * ```js
 * let node = document.getElementById('main');
 * DNAProperty.observe(node, 'firstName', () => { console.log('property changed!!!') });
 * DNAProperty.set(node, 'firstName', 'Alan'); // logs 'property changed!!!'
 * DNAProperty.get(node, 'firstName'); // 'Alan'
 * node.firstName // undefined
 * ```
 */
export class DNAProperty {
    /**
     * @private
     */
    static get GENERIC_OBSERVER() {
        return '-1';
    }
    /**
     * Retrieve object property.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @return {*} the property value.
     */
    static get(obj, key) {
        let map = DNAProperty.map.get(obj) || {};
        return map[key];
    }
    /**
     * Set object property.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {*} value The new property value.
     * @param {boolean} trigger Should trigger changed callbacks.
     * @return {*} The property value.
     */
    static set(obj, key, value, trigger = true) {
        let map = DNAProperty.map.get(obj) || {};
        let oldValue = map[key];
        if (oldValue !== value) {
            map[key] = value;
            DNAProperty.map.set(obj, map);
            if (trigger) {
                this.changed(obj, key, oldValue, value);
            }
        }
        return obj[key];
    }
    /**
     * Remove object property.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {boolean} trigger Should trigger changed callbacks.
     */
    static delete(obj, key, trigger = true) {
        let map = DNAProperty.map.get(obj) || {};
        if (map.hasOwnProperty(key)) {
            let oldValue = map[key];
            delete map[key];
            DNAProperty.map.set(obj, map);
            if (trigger) {
                this.changed(obj, key, oldValue, undefined);
            }
        }
    }
    /**
     * Create a listener for the property or for the object.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {Function} callback The callback to fire.
     * @return {Object} An object with `cancel` method.
     */
    static observe(obj, key, callback) {
        if (isFunction(key)) {
            callback = key;
            key = DNAProperty.GENERIC_OBSERVER;
        }
        let callbacks = DNAProperty.callbacks.get(obj) || {};
        callbacks[key] = callbacks[key] || [];
        callbacks[key].push(callback);
        DNAProperty.callbacks.set(obj, callbacks);
        let index = callbacks[key].length - 1;
        return {
            cancel() {
                callbacks[key] = callbacks[key] || [];
                callbacks[key][index] = null;
                DNAProperty.callbacks.set(obj, callbacks);
            },
        };
    }
    /**
     * Trigger object callbaks.
     * @param {*} obj The property scope.
     * @param {string} key The property name.
     * @param {*} oldValue The previous property value.
     * @param {*} newValue The current property value.
     */
    static changed(obj, key, oldValue, newValue) {
        let callbacks = DNAProperty.callbacks.get(obj) || {};
        let res = (callbacks[key] || []).some((clb) =>
            isFunction(clb) && clb.call(obj, key, oldValue, newValue) === false
        );
        if (!res) {
            (callbacks[DNAProperty.GENERIC_OBSERVER] || []).some((clb) =>
                isFunction(clb) && clb.call(obj, key, oldValue, newValue) === false
            );
        }
    }
}

DNAProperty.map = new WeakMap();
DNAProperty.callbacks = new WeakMap();
