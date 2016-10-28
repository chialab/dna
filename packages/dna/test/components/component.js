import { shim, mix, MIXINS } from '../../index.js';

export class TestComponent extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin) {
    static get observedAttributes() {
        return ['test-callback'];
    }

    constructor() {
        super();
        this.created = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.attached = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.attached = false;
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        this[attr] = newVal;
    }
}
