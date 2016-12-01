export function reduce(arr, callback, value) {
    for (let k = 0, len = arr.length; k < len; k++) {
        value = callback(value, arr[k], k, arr);
    }
    return value;
}

export function reducePrototype(obj, callback, value) {
    while (obj) {
        value = callback(value, obj);
        obj = obj.__proto__;
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

export function reduceObjectProperty(scope, prop) {
    let protoProp = reduceProperty(scope, prop);
    return reduce(protoProp, (res, proto) => {
        for (let k in proto) {
            if (!res.hasOwnProperty(k)) {
                res[k] = proto[k];
            }
        }
        return res;
    }, {});
}
