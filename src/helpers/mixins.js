/**
 * @author Justin Fagnani
 * @see https://github.com/justinfagnani/mixwith.js
 */
class Mixin {
    constructor(superclass = class {}) {
        this.superclass = superclass;
    }

    with(...args) {
        return Array.from(args).reduce((c, m) => m(c), this.superclass);
    }
}

export const mix = (superClass) => new Mixin(superClass);
