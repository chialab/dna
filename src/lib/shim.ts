/**
 * Sets the prototype of a specified object o to object proto or null.
 *
 * @param target The object to change its prototype.
 * @param source The value of the new prototype or null.
 */
export const setPrototypeOf = (target: any, source: object | null) => Object.setPrototypeOf(target, source);

/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param constructor The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export const shim = <T extends typeof HTMLElement>(constructor: T): T => {
    if (typeof constructor !== 'function') {
        const originalConstructor = constructor as T;
        constructor = function() {} as unknown as T;
        constructor.prototype = originalConstructor.prototype;
    }
    // compatibility with Babel transpiled class
    const shim = function(this: any, ...args: any[]) {
        try {
            return Reflect.construct(constructor, args, this.constructor);
        } catch {
            //
        }
    } as any as T;
    setPrototypeOf(shim, constructor);
    setPrototypeOf(shim.prototype, constructor.prototype);
    return shim;
};
