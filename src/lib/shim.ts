const SHIM_SYMBOL = Symbol();

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
