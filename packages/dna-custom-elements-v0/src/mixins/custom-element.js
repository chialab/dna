import { DOM } from 'dna-components/src/library-helpers.js';

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
