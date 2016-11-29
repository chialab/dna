import { COMPONENT_SYMBOL } from '@dnajs/core/src/core.js';
import { bind } from '../lib/bind.js';

export const CustomElementMixin = (superClass) => class extends superClass {
    constructor() {
        super();
        this[COMPONENT_SYMBOL] = this;
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
