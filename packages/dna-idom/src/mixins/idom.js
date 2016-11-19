import { isFunction } from '@dnajs/core/src/library-helpers.js';
import * as IDOM from 'incremental-dom';

export const IDomTemplateMixin = (superClass) => class extends superClass {
    render(template) {
        template = template || this.template;
        if (isFunction(template)) {
            IDOM.patch(this, template.bind(this));
        } else {
            super.render(template);
        }
    }
};
