import { prop, BaseComponent, IDOM } from '../../index.js';

// eslint-disable-next-line
const h = IDOM.h;

export class TestBaseIDOMComponent extends BaseComponent {
    static get observedAttributes() {
        return ['name'];
    }

    get properties() {
        return {
            name: String,
            lastName: prop.STRING.attribute('last-name'),
            age: Number,
        };
    }

    get template() {
        return () => <span>{this.name} {this.lastName} {this.age}</span>;
    }

    constructor(node) {
        super(node);
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
