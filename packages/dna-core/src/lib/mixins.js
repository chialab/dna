/**
 * @author Justin Fagnani
 * @see https://github.com/justinfagnani/mixwith.js
 */
import { reduce } from '../polyfills/reduce.js';

/**
 * @private
 */
class Mixin {
    /**
     * Create a mixable class.
     * @param {Function} superClass The class to extend.
     */
    constructor(superclass) {
        superclass = superclass || class {};
        this.superclass = superclass;
    }
    /**
     * Mix the super class with a list of mixins.
     * @param {...Function} mixins *N* mixin functions.
     * @return {Function} The extended class.
     */
    with() {
        // eslint-disable-next-line
        let args = [].slice.call(arguments, 0);
        return reduce.call(args, (c, mixin) => mixin(c), this.superclass);
    }
}

/**
 * Mix a class with a mixin.
 * @param {Function} superClass The class to extend.
 * @return {Mixin} A Mixin instance.
 *
 * @example
 * ```js
 * // super class
 * class MySuperClass {
 *     constructor() {
 *         // do something
 *     }
 * }
 *
 * // create a mixin function
 * const Mixin = (superClass) => class extend superClass {
 *     constructor() {
 *         super();
 *         // do something else
 *     }
 * };
 *
 * export class MixedClass extends mix(MySuperClass).with(Mixin) {
 *
 * }
 * ```
 */
export const mix = (superClass) => new Mixin(superClass);
