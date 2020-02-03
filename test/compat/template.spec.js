import { prop, define, render, IDOM, DOM, BaseComponent } from '../../dist/adapters/compat/dna.js';

// eslint-disable-next-line
const h = IDOM.h;
const WRAPPER = document.body;

class TestComponent extends BaseComponent {
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

class TestComponent1 extends TestComponent {
    get template() {
        return () => {
            this.node.innerHTML = `${this.title ? `<h1>${this.title}</h1><br>` : ''}Hello, ${this.fullname}`;
        };
    }
}

class TestComponent2 extends TestComponent {
    get template() {
        return '<span class="dna-test">Hello DNA!</span>';
    }
}

class TestComponent3 extends TestComponent {
    get template() {
        return 4;
    }
}

class TestComponent4 extends TestComponent {
    get template() {
        return () => {
            this.node.innerHTML = `
                <svg>
                    <circle r="${this.radius}" stroke="black" stroke-width="3" fill="red" />
                </svg>
            `;
        };
    }

    get properties() {
        return {
            radius: Number,
        };
    }
}

class TestIDOMComponent extends BaseComponent {
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

class TestIDOMComponent1 extends TestIDOMComponent {
    get template() {
        return () => [
            this.title && [<h1>{this.title}</h1>,<br />],
            <span>Hello, {this.fullname}</span>,
        ];
    }
}

class TestIDOMComponent2 extends TestIDOMComponent {
    get template() {
        return <span class="dna-test">Hello DNA!</span>;
    }
}

class TestIDOMComponent3 extends TestIDOMComponent {
    get template() {
        return {};
    }
}

class TestIDOMComponent4 extends TestIDOMComponent {
    get template() {
        return IDOM.h('svg', [
            IDOM.h('circle', {
                'stroke': 'black',
                'stroke-width': '3',
                'fill': 'red',
                'r': this.radius,
            }),
        ]);
    }

    get properties() {
        return {
            radius: Number,
        };
    }
}

class TestIDOMComponent5 extends TestIDOMComponent {
    get template() {
        return () => [
            <span class="dna-test">Hello Dna!</span>,
            <test-idom-placeholder />,
            <figure is="test2-idom-placeholder" />,
        ];
    }
}

class TestIDOMPlaceholder extends BaseComponent {
    static get observedAttributes() {
        return ['value'];
    }

    get properties() {
        return {
            value: prop.NUMBER.attribute(),
            attached: prop.BOOLEAN,
        };
    }

    constructor(node) {
        super(node);
        this.value = 6;
    }

    connectedCallback() {
        super.connectedCallback();
        this.attached = this.isConnected;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.attached = this.isConnected;
    }
}

class Test2IDOMPlaceholder extends BaseComponent {
    static get observedAttributes() {
        return ['value'];
    }

    get properties() {
        return {
            value: Number,
        };
    }

    constructor(node) {
        super(node);
        this.value = 11;
    }
}

define('test1-template-component', TestComponent1);
define('test2-template-component', TestComponent2);
define('test3-template-component', TestComponent3);
define('test4-template-component', TestComponent4);
define('test1-idom-template-component', TestIDOMComponent1);
define('test2-idom-template-component', TestIDOMComponent2);
define('test3-idom-template-component', TestIDOMComponent3);
define('test4-idom-template-component', TestIDOMComponent4);
define('test5-idom-template-component', TestIDOMComponent5);
define('test-idom-placeholder', TestIDOMPlaceholder);
define('test2-idom-placeholder', Test2IDOMPlaceholder, {
    extends: 'figure',
});

DOM.lifeCycle(true);

describe.skip('[Compat] TemplateComponent', () => {
    it.skip('should handle `template` getter property as function with interpolation', () => {
        const elem = render(WRAPPER, TestComponent1);

        assert.equal(elem.node.innerHTML, 'Hello, ');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        assert.equal(elem.node.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it.skip('should handle `template` getter property as string', () => {
        const elem = render(WRAPPER, TestComponent2);

        assert.equal(elem.node.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it.skip('should handle `template` getter property as number', () => {
        const elem = render(WRAPPER, TestComponent3);

        assert.equal(elem.node.innerHTML, '4');
    });

    it.skip('should handle templates with <svg>', () => {
        const elem = render(WRAPPER, TestComponent4);

        elem.radius = 40;
        let svg = elem.node.querySelector('svg');
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });
});

describe.skip('[Compat] IDOMTemplateComponent', () => {
    it.skip('should handle `template` with IDOM calls', () => {
        const elem = render(WRAPPER, TestIDOMComponent1);

        assert.equal(elem.node.innerHTML, '<span>Hello, </span>');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        assert.equal(elem.node.innerHTML, '<h1>Title</h1><br><span>Hello, Alan Turing</span>');
    });

    it.skip('should handle `template` with JSX IDOM calls', () => {
        const elem = render(WRAPPER, TestIDOMComponent2);

        assert.equal(elem.node.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it.skip('should handle templates with <svg>', () => {
        const elem = render(WRAPPER, TestIDOMComponent4);

        elem.radius = 40;

        let svg = elem.node.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });

    describe.skip('should handle sub components', () => {
        let elem;
        before(() => {
            elem = render(WRAPPER, TestIDOMComponent5);
        });

        it.skip('and their callbacks', () => {
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            const testElement2 = elem.node.querySelector('figure');
            assert.equal(DOM.getNodeComponent(testElement1).value, 6);
            assert.equal(DOM.getNodeComponent(testElement2).value, 11);
        });

        it.skip('and their life cycle (connected)', () => {
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            assert.equal(DOM.getNodeComponent(testElement1).attached, true);
        });

        it.skip('and their life cycle (disconnected)', () => {
            DOM.removeChild(WRAPPER, elem);
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            assert.equal(DOM.getNodeComponent(testElement1).attached, false);
        });

        it.skip('and their life cycle (riconnected)', () => {
            DOM.appendChild(WRAPPER, elem);
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            assert.equal(DOM.getNodeComponent(testElement1).attached, true);
        });
    });
});
