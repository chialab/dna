import { mix } from '../../src/lib/mixins.js';
import { ComponentMixin } from '../../src/mixins/component.js';
import { HTMLElement } from '../../src/lib/html-element.js';

export class TestComponent extends mix(HTMLElement).with(ComponentMixin) {
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
