import { reduce } from '../polyfills/reduce.js';
/**
 * @author Justin Fagnani
 * @see https://github.com/justinfagnani/mixwith.js
 */
class Mixin {
    constructor(superclass) {
        superclass = superclass || class {};
        this.superclass = superclass;
    }

    with() {
        // eslint-disable-next-line
        let args = [].slice.call(arguments, 0);
        return reduce.call(args, (c, mixin) => mixin(c), this.superclass);
    }
}

export const mix = (superClass) => new Mixin(superClass);
