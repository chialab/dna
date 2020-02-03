import { define, DOM, IDOM, BaseComponent } from '../../dist/adapters/compat/dna.js';

// eslint-disable-next-line
const h = IDOM.h;
const WRAPPER = document.createElement('div');
document.body.appendChild(WRAPPER);

class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['age'];
    }

    get properties() {
        return {
            age: Number,
            married: Boolean,
        };
    }

    constructor(node) {
        super(node);
        this.name = 'Alan';
        this.lastName = 'Turing';
        this.connectedTimes = 0;
        this.disconnectedTimes = 0;
        this.attributeChanges = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.connectedTimes++;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectedTimes++;
    }

    attributeChangedCallback(...args) {
        super.attributeChangedCallback(...args);
        this.attributeChanges++;
    }
}


define('test-idom-component', TestComponent);

DOM.lifeCycle(true);

const render = (data) => {
    if (data.show) {
        return <test-idom-component age={data.age} married={data.married}></test-idom-component>;
    }
};

describe.skip('[Compat] IDOM observer', () => {
    describe.skip('callbacks', () => {
        let node, elem;
        before(() => {
            IDOM.patch(WRAPPER, render, { show: true, age: 20, married: false });
            node = WRAPPER.querySelector('test-idom-component');
            elem = DOM.getNodeComponent(node);
        });

        it.skip('should create a component instance', () => {
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
        });

        it.skip('should update a component', () => {
            IDOM.patch(WRAPPER, render, { show: true, age: 21, married: true });
            assert.equal(elem.node.getAttribute('age'), '21');
            assert.equal(elem.age, 21);
            assert.equal(elem.attributeChanges, 1);
            assert.equal(elem.married, true);
        });

        it.skip('should remove a component', () => {
            IDOM.patch(WRAPPER, render, { show: false });
            assert.equal(elem.node.parentNode, undefined);
            assert.equal(elem.disconnectedTimes, 1);
        });
    });
});
