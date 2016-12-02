/**
 * Wrap Symbol function.
 * @private
 *
 * @param {String} name The symbol name.
 * @return {Symbol|String} A real symbol if supported or a string key.
 */
function Sym(name) {
    if (self.Symbol) {
        return self.Symbol(name);
    }
    return `__${name}`;
}

/**
 * Symbol for DNA component mixin.
 * Bound to a component instance.
 * @type {String}
 * @memberof DNA
 */
export const DNA_SYMBOL = Sym('dna');
/**
 * Symbol for component instance.
 * Bound to a node.
 * @type {String}
 * @memberof DNA
 */
export const COMPONENT_SYMBOL = Sym('component');
/**
 * Symbol for node instance.
 * Bound to a component instance.
 * @type {String}
 * @memberof DNA
 */
export const NODE_SYMBOL = Sym('node');
/**
 * Symbol for style element.
 * Bound to a component instance.
 * @type {String}
 * @memberof DNA
 */
export const STYLE_SYMBOL = Sym('style');
