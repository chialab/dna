import { createSymbolKey } from './symbols';

/**
 * A symbol to store already shimmed constructors.
 */
const SHIM_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param Constructor The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export function shim(Constructor: typeof HTMLElement): typeof HTMLElement {
    const ShimConstructor: typeof HTMLElement & { [SHIM_SYMBOL]?: typeof HTMLElement } = Constructor;
    if (typeof ShimConstructor[SHIM_SYMBOL] === 'function') {
        return ShimConstructor[SHIM_SYMBOL] as typeof HTMLElement;
    }

    const prototype = ShimConstructor.prototype;
    const shim = function() {} as any as typeof HTMLElement;
    shim.prototype = prototype;
    ShimConstructor[SHIM_SYMBOL] = shim;

    return shim;
}
