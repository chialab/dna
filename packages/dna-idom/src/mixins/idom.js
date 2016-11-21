import { isFunction } from '@dnajs/core/src/library-helpers.js';
import * as IDOM from '../lib/idom.js';

export const IDomTemplateMixin = (superClass) => class extends superClass {
    render(template) {
        template = template || this.template;
        /* istanbul ignore else */
        if (isFunction(template)) {
            IDOM.patchOuter(this, template.bind(this, IDOM));
        } else {
            super.render(template);
        }
    }
};
