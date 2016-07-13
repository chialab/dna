import { DNAComponent } from '../../src/dna-component.js';
import { DNABaseComponent } from '../../src/dna-base-component.js';

class BehaviorComponent extends DNAComponent {
    constructor() {
        super();
        this.behaviors = true;
    }
}

export class TestComponent extends DNABaseComponent {
    static get behaviors() {
        return DNABaseComponent.behaviors.concat([BehaviorComponent]);
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
