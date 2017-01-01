import { DNA_SYMBOL } from '@dnajs/core/src/lib/symbols.js';
import { bind } from '../lib/bind.js';

export const CustomElementMixin = (superClass) => class extends superClass {
    get node() {
        return this;
    }
    createdCallback() {
        if (!this[DNA_SYMBOL]) {
            bind(this);
        }
    }
    attachedCallback() {
        this.connectedCallback();
    }
    detachedCallback() {
        this.detachedCallback();
    }
};
