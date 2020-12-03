let symbols = 0;

/**
 * Create a symbolic key.
 * When native Symbol is not defined, compute an unique string key.
 * @return An unique key.
 */
export const createSymbolKey = (description?: string | number) => {
    if (typeof Symbol !== 'undefined') {
        return Symbol(description);
    }
    return `__dna_compat_${symbols++}` as unknown as symbol;
};

/**
 * Symbol for DNA component mixin.
 * Bound to a component instance.
 * @deprecated since version 3.0
 */
export const DNA_SYMBOL: unique symbol = createSymbolKey('dna') as any;

/**
 * Symbol for component instance.
 * Bound to a node.
 * @deprecated since version 3.0
 */
export const COMPONENT_SYMBOL: unique symbol = createSymbolKey('component') as any;

/**
 * Symbol for node instance.
 * Bound to a component instance.
 * @deprecated since version 3.0
 */
export const NODE_SYMBOL: unique symbol = createSymbolKey('node') as any;

/**
 * Symbol for style element.
 * Bound to a component instance.
 * @deprecated since version 3.0
 */
export const STYLE_SYMBOL: unique symbol = createSymbolKey('style') as any;

/**
 * Symbol for connected state.
 * Bound to a component instance.
 * @deprecated since version 3.0
 */
export const CONNECTED_SYMBOL: unique symbol = createSymbolKey('connected') as any;
