export function reduce(arr, callback, value) {
    for (let k = 0, len = arr.length; k < len; k++) {
        value = callback(value, arr[k], k, arr);
    }
    return value;
}
