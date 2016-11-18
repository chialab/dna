import * as IDOM from 'incremental-dom';

export const IDomTemplateMixin = (superClass) => class extends superClass {
    render() {
        if (this.template && typeof this.template === 'function') {
            IDOM.patch(this, this.template);
        } else {
            super.render();
        }
    }
};
