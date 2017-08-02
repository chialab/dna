/**
 * Check if an value is a function.
 * @method isFunction
 * @static
 * @private
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isFunction(obj) {
    return typeof obj === 'function';
}
/**
 * Check if an value is a string.
 * @method isString
 * @static
 * @private
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isString(obj) {
    return typeof obj === 'string';
}
/**
 * Check if an value is an object.
 * @method isObject
 * @static
 * @private
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * Check if an value is undefined.
 * @method isUndefined
 * @static
 * @private
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isUndefined(obj) {
    return typeof obj === 'undefined';
}
/**
 * Check if an value is an array.
 * @method isArray
 * @static
 * @private
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isArray(obj) {
    return Array.isArray(obj);
}
/**
 * Check if falsy value.
 * @method isFalsy
 * @static
 * @private
 *
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isFalsy(obj) {
    return isUndefined(obj) || obj === null || obj === false;
}
