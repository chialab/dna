import { checkNativeSupport } from './CustomElement';

/**
 * Make constructor newable.
 *
 * @param constructor The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
function shimPrototype<T extends typeof HTMLElement>(constructor: T): T {
    const shim = function() { } as any as T;
    shim.prototype = constructor.prototype;
    return shim;
}

/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param constructor The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export function shim<T extends typeof HTMLElement>(constructor: T): T {
    if (typeof Reflect === 'undefined' || !checkNativeSupport()) {
        return shimPrototype(constructor);
    }

    let originalConstructor = constructor;
    // compatibility with Babel transpiled class
    const shim = function(this: any, ...args: any[]) {
        try {
            return Reflect.construct(originalConstructor, [], this.constructor);
        } catch (error) {
            originalConstructor = shimPrototype(originalConstructor);
        }
        return Reflect.construct(originalConstructor, args, this.constructor);
    } as any as T;
    Object.setPrototypeOf(shim, originalConstructor);
    Object.setPrototypeOf(shim.prototype, originalConstructor.prototype);
    return shim;
}
