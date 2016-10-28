import * as IDOM from 'incremental-dom';

export const IDOMTemplateMixin = (SuperClass) => class extends SuperClass {
    render() {
        if (this.template && typeof this.template === 'function') {
            IDOM.patch(this, this.template);
        } else {
            super.render();
        }
    }
};
