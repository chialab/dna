import { isFunction } from '@dnajs/core/src/lib/typeof.js';
import { patch } from '../lib/idom.js';

export const IDOMMixin = (superClass) => class extends superClass {
    constructor() {
        super();
        this.node = document.createElement(this.is);
    }

    render(template) {
        template = template || this.template;
        if (isFunction(template)) {
            let tpl = template.bind(this);
            template = () => patch(this.node.shadowRoot || this.node, tpl);
        }
        super.render(template);
    }
};
