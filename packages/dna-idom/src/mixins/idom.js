import { NODE_SYMBOL, COMPONENT_SYMBOL, isFunction } from '@dnajs/core/src/core.js';
import { patch } from '../lib/idom.js';

export const IDOMMixin = (superClass) => class extends superClass {
    /**
     * @property {HTMLElement} node Get component node reference.
     * @name node
     * @type {HTMLElement}
     * @memberof DNA.MIXINS.IDOMMixin
     * @instance
     */
    get node() {
        return this[NODE_SYMBOL];
    }

    set node(node) {
        node[COMPONENT_SYMBOL] = this;
        this[NODE_SYMBOL] = node;
    }

    constructor() {
        super();
        this.node = document.createElement(this.is);
    }

    render(template) {
        template = template || this.template;
        if (isFunction(template)) {
            let tpl = template.bind(this);
            template = () => patch(this.shadowRoot || this.node, tpl);
        }
        super.render(template);
    }
};
