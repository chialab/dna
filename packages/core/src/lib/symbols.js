import { Symbol } from '../helpers/symbol.js';

/**
 * Symbol for DNA component mixin.
 * Bound to a component instance.
 * @type {String}
 * @private
 */
export const DNA_SYMBOL = Symbol('dna');
/**
 * Symbol for component instance.
 * Bound to a node.
 * @type {String}
 * @private
 */
export const COMPONENT_SYMBOL = Symbol('component');
/**
 * Symbol for node instance.
 * Bound to a component instance.
 * @type {String}
 * @private
 */
export const NODE_SYMBOL = Symbol('node');
/**
 * Symbol for style element.
 * Bound to a component instance.
 * @type {String}
 * @private
 */
export const STYLE_SYMBOL = Symbol('style');
/**
 * Symbol for connected state.
 * Bound to a component instance.
 * @type {Boolean}
 * @private
 */
export const CONNECTED_SYMBOL = Symbol('connected');
