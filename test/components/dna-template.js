import { mix } from 'mixwith';
import { DNAComponent } from '../../src/dna-component.js';
import { DNAPropertiesMixin } from '../../src/dna-properties-component.js';
import { DNATemplateMixin } from '../../src/dna-template-component.js';

class TestComponent extends mix(DNAComponent).with(DNAPropertiesMixin, DNATemplateMixin) {
    static get observedProperties() {
        return ['name', 'lastName', 'title'];
    }
    get fullname() {
        return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
    }
}

export class TestComponent1 extends TestComponent {
    template(t) {
        return t`${this.title ? `<h1>${this.title}</h1><br>` : ''}Hello, ${this.fullname}`;
    }
}

export class TestComponent2 extends TestComponent {
    template(t) {
        return t`<span class="dna-test">Hello DNA!</span>`;
    }
}

export class TestComponent3 extends TestComponent {
    template() {
        return {};
    }
}

export class TestComponent4 extends TestComponent {
    static get observedProperties() {
        return ['radius'];
    }
    template(t) {
        return t`
            <svg>
                <circle r="${this.radius}" stroke="black" stroke-width="3" fill="red" />
            </svg>
        `;
    }
}
