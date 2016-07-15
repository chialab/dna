import { mix } from 'mixwith';
import { DNAComponent } from '../../src/dna-component.js';
import { DNAAttributesComponent } from '../../src/dna-attributes-component.js';
import { DNAPropertiesMixin } from '../../src/dna-properties-component.js';
import { DNAVDomMixin } from '../../src/extra/dna-vdom-component.js';
import { virtualDom } from 'vdom';

class TestComponent extends mix(DNAComponent).with(DNAPropertiesMixin, DNAVDomMixin) {
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

export class TestComponent8 extends TestComponent {
    static get template() {
        return `
        <span class="dna-test">
            Hello DNA!
        </span>
        <test-vdom-placeholder></test-vdom-placeholder>
        <figure is="test2-vdom-placeholder"></figure>`;
    }
}

export class TestPlaceholder extends DNAAttributesComponent {
    static get observedAttributes() {
        return ['value'];
    }

    constructor() {
        super();
        this.value = 6;
    }
}

export class Test2Placeholder extends DNAAttributesComponent {
    static get observedAttributes() {
        return ['value'];
    }

    constructor() {
        super();
        this.value = 11;
    }
}

export class TestComponent9 extends TestComponent {
    static get observedProperties() {
        return ['content'];
    }
    static get template() {
        return function() {
            return new virtualDom.VNode('span', {
                className: 'dna-test',
            }, [
                new virtualDom.VText(this.content),
                new virtualDom.VNode('test-vdom-placeholder'),
            ]);
        };
    }
}
