/**
 * Check if an value is a function.
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isFunction(obj) {
    return typeof obj === 'function';
}
/**
 * Check if an value is a string.
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isString(obj) {
    return typeof obj === 'string';
}
/**
 * Check if an value is an object.
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * Check if an value is undefined.
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isUndefined(obj) {
    return typeof obj === 'undefined';
}
/**
 * Check if an value is an array.
 * @param {*} obj The value to check.
 * @return {Boolean}
 */
export function isArray(obj) {
    return Array.isArray(obj);
}
