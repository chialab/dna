import * as IDOM from 'incremental-dom';

export const JSXIDomTemplateMixin = (superClass) => class extends superClass {
    render() {
        IDOM.patch(this, () => this.template);
    }
};
