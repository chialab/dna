import React from 'react';
import { BaseComponent } from '../../index.js';

// eslint-disable-next-line
const h = React.createElement;

export class ReactTestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['name'];
    }

    get properties() {
        return {
            name: String,
        };
    }

    get template() {
        return () => <span>{this.name}</span>;
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
