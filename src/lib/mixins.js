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
        return [].slice.call(arguments, 0).reduce((c, m) => m(c), this.superclass);
    }
}

export const mix = (superClass) => new Mixin(superClass);
