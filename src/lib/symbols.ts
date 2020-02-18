let symbols = 0;

/**
 * Create a symbolic key.
 * When native Symbol is not defined, compute an unique string key.
 * @return An unique key.
 */
export function createSymbolKey(description?: string | number) {
    if (typeof Symbol !== 'undefined') {
        return Symbol(description);
    }
    return `$sym_${symbols++}` as unknown as symbol;
}
