import { DOM } from '@dna/core/src/library-helpers.js';

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
