import { Symbolic } from '@chialab/proteins';

/**
 * Symbol for DNA component mixin.
 * Bound to a component instance.
 * @type {Symbol}
 * @private
 */
export const DNA_SYMBOL = Symbolic('dna');

/**
 * Symbol for component instance.
 * Bound to a node.
 * @type {Symbol}
 * @private
 */
export const COMPONENT_SYMBOL = Symbolic('component');

/**
 * Symbol for node instance.
 * Bound to a component instance.
 * @type {Symbol}
 * @private
 */
export const NODE_SYMBOL = Symbolic('node');

/**
 * Symbol for style element.
 * Bound to a component instance.
 * @type {Symbol}
 * @private
 */
export const STYLE_SYMBOL = Symbolic('style');

/**
 * Symbol for connected state.
 * Bound to a component instance.
 * @type {Symbol}
 * @private
 */
export const CONNECTED_SYMBOL = Symbolic('connected');
