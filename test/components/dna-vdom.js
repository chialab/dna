import { DNAMixedComponent } from '../../src/dna-mixed-component.js';
import { DNAAttributesComponent } from '../../src/dna-attributes-component.js';
import { DNAPropertiesComponent } from '../../src/dna-properties-component.js';
import { DNAVDomComponent } from '../../src/extra/dna-vdom-component.js';
import { DNAVDomBaseComponent } from '../../src/extra/dna-vdom-base-component.js';
import { virtualDom } from 'vdom';

class TestComponent extends DNAMixedComponent {
    static get behaviors() {
        return [DNAPropertiesComponent, DNAVDomComponent];
    }
    static get properties() {
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
    static get properties() {
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
        return '<span class="dna-test">Hello DNA!</span><test-vdom-placeholder></test-vdom-placeholder><figure is="test2-vdom-placeholder"></figure>';
    }
}

export class TestPlaceholder extends DNAAttributesComponent {
    static get attributes() {
        return ['value'];
    }

    createdCallback() {
        super.createdCallback();
        this.value = 6;
    }
}

export class Test2Placeholder extends DNAAttributesComponent {
    static get attributes() {
        return ['value'];
    }

    createdCallback() {
        super.createdCallback();
        this.value = 11;
    }
}

export class TestComponent9 extends TestComponent {
    static get properties() {
        return ['content'];
    }
    static get template() {
        return () => {
            return new virtualDom.VNode('span', {
                className: 'dna-test',
            }, [
                new virtualDom.VText(this.content),
                new virtualDom.VNode('test-vdom-placeholder')
            ])
        };
    }
}
