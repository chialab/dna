/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param constructor The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export function shim<T extends typeof HTMLElement>(Constructor: T): T {
    const shim = function() {} as any as T;
    shim.prototype = Constructor.prototype;
    return shim;
}
