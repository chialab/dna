import { prop, BaseComponent } from '../../index.js';

export class TestBaseComponent extends BaseComponent {
    static get observedAttributes() {
        return ['name'];
    }

    get properties() {
        return {
            name: String,
            lastName: prop.STRING.attribute('last-name'),
        };
    }

    get template() {
        return `<span>${this.name} ${this.lastName}</span>`;
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
