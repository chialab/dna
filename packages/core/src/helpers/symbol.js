/**
 * Wrap Symbol function.
 * @private
 *
 * @param {String} name The symbol name.
 * @return {Symbol|String} A real symbol if supported or a string key.
 */
export function Symbol(name) {
    if (self.Symbol) {
        return self.Symbol(name);
    }
    return `__${name}`;
}
