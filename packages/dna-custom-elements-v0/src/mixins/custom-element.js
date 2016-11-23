import { DOM } from '@dnajs/core/src/core.js';

export const customElementMixin = (superClass) => class extends superClass {
    createdCallback() {
        DOM.bind(this);
    }
    attachedCallback() {
        this.connectedCallback();
    }
    detachedCallback() {
        this.detachedCallback();
    }
};
