import { define, DOM, BaseComponent } from '../../dist/adapters/compat/dna.js';

const WRAPPER = document.body;

class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['test-callback'];
    }

    constructor(...args) {
        super(...args);
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

define('test-component', TestComponent);

DOM.lifeCycle(true);

describe.skip('[Compat] Component', () => {
    let elem;
    before(() => {
        elem = new TestComponent();
    });

    describe('> created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'test-callback', 'Alan');
            assert.equal(elem['test-callback'], 'Alan');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});
