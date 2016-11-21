import { isFunction, isArray } from '@dnajs/core/src/library-helpers.js';
import { IDOM } from '../lib/idom.js';

function intepolate(template) {
    if (isFunction(template)) {
        let res = template.call(this);
        if (isArray(res)) {
            intepolate.call(this, res);
        }
    } else if (isArray(template)) {
        template.forEach((chunk) => {
            intepolate.call(this, chunk);
        });
    }
}

export const IDomTemplateMixin = (superClass) => class extends superClass {
    render(template) {
        template = template || this.template;
        /* istanbul ignore else */
        if (isFunction(template)) {
            IDOM.patch(this, () => {
                intepolate.call(this, template);
            });
        } else {
            super.render(template);
        }
    }
};
