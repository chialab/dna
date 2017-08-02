export function shim(Elem) {
    const ShimElement = function() {
        return Reflect.construct(Elem, [], this.constructor);
    };

    ShimElement.prototype = Object.create(Elem.prototype, {
        constructor: {
            value: ShimElement,
            configurable: true,
            writable: true,
        },
    });

    return ShimElement;
}
