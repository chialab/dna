import { DNAComponent } from '../../src/dna-component.js';

export class TestComponent extends DNAComponent {
    static get observedAttributes() {
        return ['testCallback'];
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
