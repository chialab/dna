import { BaseComponent } from '../../index.js';

export class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['age'];
    }

    get properties() {
        return {
            age: Number,
            married: Boolean,
        };
    }

    constructor(node) {
        super(node);
        this.name = 'Alan';
        this.lastName = 'Turing';
        this.connectedTimes = 0;
        this.disconnectedTimes = 0;
        this.attributeChanges = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.connectedTimes++;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectedTimes++;
    }

    attributeChangedCallback(...args) {
        super.attributeChangedCallback(...args);
        this.attributeChanges++;
    }
}
