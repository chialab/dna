import { isFunction, isArray } from '@dnajs/core/src/library-helpers.js';
import { IDOM } from '../lib/idom.js';

export const IDomTemplateMixin = (superClass) => class extends superClass {
    render(template) {
        template = template || this.template;
        /* istanbul ignore else */
        if (isFunction(template)) {
            IDOM.patch(this, () => {
                let res = template.call(this);
                if (isArray(res)) {
                    res.forEach((chunk) => {
                        if (isFunction(chunk)) {
                            chunk.call(this);
                        }
                    });
                }
            });
        } else {
            super.render(template);
        }
    }
};
