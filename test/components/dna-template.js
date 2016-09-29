import { mix } from 'mixwith';
import { DNAComponent } from '../../src/dna-component.js';
import { DNAPropertiesMixin } from '../../src/dna-properties-component.js';
import { DNATemplateMixin } from '../../src/dna-template-component.js';
import { Template } from 'skin-template/src/template.js';

class TestComponent extends mix(DNAComponent).with(DNAPropertiesMixin, DNATemplateMixin) {
    static get observedProperties() {
        return ['name', 'lastName', 'title'];
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
    static get observedProperties() {
        return ['radius'];
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

export class TestPlaceholder extends mix(DNAComponent).with(DNAPropertiesMixin) {
    static get observedAttributes() {
        return ['value'];
    }

    static get observedProperties() {
        return ['value'];
    }

    constructor() {
        super();
        this.value = 6;
    }
}

export class Test2Placeholder extends mix(DNAComponent).with(DNAPropertiesMixin) {
    static get observedAttributes() {
        return ['value'];
    }

    static get observedProperties() {
        return ['value'];
    }

    constructor() {
        super();
        console.log(this);
        this.value = 11;
    }
}
