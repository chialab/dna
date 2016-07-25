import { mix } from 'mixwith';
import { DNAPropertiesMixin } from '../../src/dna-properties-component.js';
import { DNATemplateMixin } from '../../src/dna-template-component.js';

class TestComponent extends mix(HTMLElement).with(DNAPropertiesMixin, DNATemplateMixin) {
    static get observedProperties() {
        return ['name', 'lastName', 'title'];
    }
    get fullname() {
        return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
    }
}

export class TestComponent1 extends TestComponent {
    static get template() {
        return function() {
            return `${this.title ? `<h1>${this.title}</h1><br>` : ''}Hello, ${this.fullname}`;
        };
    }
}

export class TestComponent2 extends TestComponent {
    static get template() {
        return '<span class="dna-test">Hello DNA!</span>';
    }
}

export class TestComponent3 extends TestComponent {
    static get template() {
        return '<span class="dna-test">Hello DNA!</span>';
    }
}

export class TestComponent4 extends TestComponent {
    static get template() {
        let elem = document.createElement('template');
        elem.innerHTML = '<span class="dna-test">Hello DNA!</span>';
        return elem;
    }
}

export class TestComponent5 extends TestComponent {
    static get template() {
        let elem = document.createElement('template');
        elem.innerHTML = '<span class="dna-test">Hello DNA!</span><span>Hello World!</span>';
        return elem;
    }
}

export class TestComponent6 extends TestComponent {
    static get template() {
        return 4;
    }
}

export class TestComponent7 extends TestComponent {
    static get observedProperties() {
        return ['radius'];
    }
    static get template() {
        return function() {
            return `
                <svg>
                    <circle r="${this.radius}" stroke="black" stroke-width="3" fill="red" />
                </svg>
            `;
        };
    }
}
