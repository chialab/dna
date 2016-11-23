export function isFunction(fn) {
    return typeof fn === 'function';
}

export function isString(str) {
    return typeof str === 'string';
}

export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isUndefined(obj) {
    return typeof obj === 'undefined';
}

export function isArray(obj) {
    return Array.isArray(obj);
}
