export function reduce(arr, callback, value) {
    for (let k = 0, len = arr.length; k < len; k++) {
        value = callback(value, arr[k], k, arr);
    }
    return value;
}

const CONSTRUCTOR = '__proto__';

export function reducePrototype(scope, callback, value) {
    let k = 0;
    let obj = scope;
    // eslint-disable-next-line
    while (obj) {
        value = callback(value, obj, k, scope);
        obj = obj[CONSTRUCTOR];
        k++;
    }
    return value;
}

export function reduceProperty(obj, key) {
    return reducePrototype(obj, (properties, proto) => {
        if (proto.hasOwnProperty(key)) {
            properties.push(proto[key]);
        }
        return properties;
    }, []);
}
