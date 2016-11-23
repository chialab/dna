import { isFunction } from '@dnajs/core/src/library-helpers.js';
import { patch } from '../lib/idom.js';

export const IDOMTemplateMixin = (superClass) => class extends superClass {
    render(template) {
        template = template || this.template;
        /* istanbul ignore else */
        if (isFunction(template)) {
            patch(this, template.bind(this));
        } else {
            super.render(template);
        }
    }
};
