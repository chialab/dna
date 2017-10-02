import { reduce } from '../helpers/arr-reduce.js';

/**
 * A Mixin helper class.
 * @ignore
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
        return reduce(args, (c, mixin) => mixin(c), this.superclass);
    }
}

/**
 * Mix a class with a mixin.
 * @author Justin Fagnani (https://github.com/justinfagnani)
 * @memberof DNA
 *
 * @param {Function} superClass The class to extend.
 * @return {Function} A mixed class.
 *
 * @example
 * ```js
 * // my-super.js
 * export class MySuperClass {
 *     constructor() {
 *         // do something
 *     }
 * }
 * ```
 * ```js
 * // mixin.js
 * export const Mixin = (superClass) => class extends superClass {
 *     constructor() {
 *         super();
 *         // do something else
 *     }
 * };
 * ```
 * ```js
 * import { mix } from '@dnajs/core';
 * import { MySuperClass } from './my-super.js';
 * import { Mixin } from './mixin.js';
 *
 * export class MixedClass extends mix(MySuperClass).with(Mixin) {
 *     ...
 * }
 * ```
 */
export const mix = (superClass) => new Mixin(superClass);
