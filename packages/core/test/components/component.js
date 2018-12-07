import { BaseComponent } from '../../index.js';

export class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['test-callback'];
    }

    constructor(...args) {
        super(...args);
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
