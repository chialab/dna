import { mix } from '../../src/helpers/mixins.js';
import { Component } from '../../src/dna-component.js';
import { PropertiesMixin } from '../../src/dna-properties-component.js';
import { TemplateMixin } from '../../src/dna-template-component.js';
import { Template } from 'skin-template/src/template.js';

class TestComponent extends mix(Component).with(PropertiesMixin, TemplateMixin) {
    get properties() {
        return {
            name: String,
            lastName: String,
            title: String,
        };
    }

    get fullname() {
        return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
    }
}

export class TestComponent1 extends TestComponent {
    get template() {
        return new Template((t) =>
            t`${this.title ? `<h1>${this.title}</h1><br>` : ''}Hello, ${this.fullname}`
        );
    }
}

export class TestComponent2 extends TestComponent {
    get template() {
        return new Template((t) =>
            t`<span class="dna-test">Hello DNA!</span>`
        );
    }
}

export class TestComponent3 extends TestComponent {
    get template() {
        return {};
    }
}

export class TestComponent4 extends TestComponent {
    get properties() {
        return {
            radius: Number,
        };
    }

    get template() {
        return new Template((t) =>
            t`
                <svg>
                    <circle r="${this.radius}" stroke="black" stroke-width="3" fill="red" />
                </svg>
            `
        );
    }
}

export class TestComponent5 extends TestComponent {
    get template() {
        return new Template((t) =>
            t`
                <span class="dna-test">Hello DNA!</span>
                <test-vdom-placeholder></test-vdom-placeholder>
                <figure is="test2-vdom-placeholder"></figure>
            `
        );
    }
}

export class TestPlaceholder extends mix(Component).with(PropertiesMixin) {
    static get observedAttributes() {
        return ['value'];
    }

    get properties() {
        return {
            value: Number,
        };
    }

    constructor() {
        super();
        this.value = 6;
    }
}

export class Test2Placeholder extends mix(Component).with(PropertiesMixin) {
    static get observedAttributes() {
        return ['value'];
    }

    get properties() {
        return {
            value: Number,
        };
    }

    constructor() {
        super();
        this.value = 11;
    }
}
