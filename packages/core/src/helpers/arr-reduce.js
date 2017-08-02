/**
 * Reduce an array to a single value.
 * Similar to `Array.prototype.reduce`.
 * @method reduce
 * @ignore
 *
 * @param {Array} arr The array to reduce.
 * @param {Function} callback The reducer function to fire for all value of the array.
 * @param {*} value Optional initial value.
 * @return {*} The value for the reduced array.
 */
export function reduce(arr, callback, value) {
    for (let k = 0, len = arr.length; k < len; k++) {
        value = callback(value, arr[k], k, arr);
    }
    return value;
}
