import { isFunction } from '@dnajs/core/src/core.js';
import { patch } from '../lib/idom.js';

export const IDOMTemplateMixin = (superClass) => class extends superClass {
    render(template) {
        template = template || this.template;
        if (isFunction(template)) {
            let tpl = template.bind(this);
            template = () => patch(this.shadowRoot || this.node, tpl);
        }
        super.render(template);
    }
};
