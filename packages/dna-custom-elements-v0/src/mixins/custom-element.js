import { bind } from '../lib/bind.js';

export const CustomElementMixin = (superClass) => class extends superClass {
    get node() {
        return this;
    }
    createdCallback() {
        bind(this, this.constructor);
    }
    attachedCallback() {
        this.connectedCallback();
    }
    detachedCallback() {
        this.detachedCallback();
    }
};
