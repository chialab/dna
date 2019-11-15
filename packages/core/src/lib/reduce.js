import { has } from '@chialab/proteins';

/**
 * Reduce an object prototype chain to a single value.
 * @method reducePrototype
 * @ignore
 *
 * @param {*} obj The object prototype scope to iterate.
 * @param {Function} callback The reducer function to fire for all value of the prototype chain.
 * @param {*} value Optional initial value.
 * @return {*} The value for the reduced prototype chain.
 */
export function reducePrototype(obj, callback, value) {
    while (obj) {
        value = callback(value, obj);
        obj = Object.getPrototypeOf(obj);
    }
    return value;
}
/**
 * Reduce to array of property values of a prototype chain.
 * @method reduceProperty
 * @ignore
 *
 * @param {*} obj The object prototype scope to iterate.
 * @param {String} key The property name.
 * @return {Array} A list of property values.
 */
export function reduceProperty(obj, key) {
    return reducePrototype(obj, (properties, proto) => {
        if (has(proto, key)) {
            let desc = Object.getOwnPropertyDescriptor(proto, key);
            let res;
            if (has(desc, 'value')) {
                res = desc.value;
            } else if (has(desc, 'get')) {
                res = desc.get.call(obj);
            }
            properties.push(res);
        }
        return properties;
    }, []);
}
/**
 * Marge an array of property values of a prototype chain.
 * @method reduceObjectProperty
 * @ignore
 *
 * @param {*} obj The object prototype scope to iterate.
 * @param {String} key The property name.
 * @return {Object} A merged list of property values.
 */
export function reduceObjectProperty(scope, prop) {
    let protoProp = reduceProperty(scope, prop);
    return protoProp.reduce((res, proto) => {
        for (let k in proto) {
            if (!has(res, k)) {
                res[k] = proto[k];
            }
        }
        return res;
    }, {});
}
