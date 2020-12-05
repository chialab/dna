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
    /* istanbul ignore next */
    return `__dna${symbols++}` as unknown as symbol;
};
