const symbols = [];

/**
 * Create a symbolic key.
 * When native Symbol is not defined, compute an unique string key.
 * @return An unique key.
 */
export function createSymbolKey() {
    if (typeof Symbol !== 'undefined') {
        return Symbol();
    }
    return `$sym_${symbols.push()}` as unknown as symbol;
}
