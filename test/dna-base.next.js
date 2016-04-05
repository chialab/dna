import { DNABaseComponent } from '../src/dna-base-component.next.js';

class BehaviorComponent extends DNABaseComponent {
    createdCallback() {
        this.behaviors = true;
    }
}

export class TestComponent extends DNABaseComponent {
    static get behaviors() {
        return super.behaviors.concat([BehaviorComponent]);
    }

    static onRegister() {
        this.registered = true;
        super.onRegister();
    }

    createdCallback() {
        this.created = true;
        super.createdCallback();
    }

    attachedCallback() {
        this.attached = true;
        super.attachedCallback();
    }

    detachedCallback() {
        this.attached = false;
        super.detachedCallback();
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        this[attr] = newVal;
        super.attributeChangedCallback(attr, oldVal, newVal);
    }
}
