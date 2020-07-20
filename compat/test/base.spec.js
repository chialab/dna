import { define, render, DOM, IDOM, prop, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

// eslint-disable-next-line
const h = IDOM.h;

describe('[Compat] BaseComponent', () => {
    let elem, wrapper, tag = getComponentName();

    before(() => {
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
        DOM.lifeCycle(true);

        class TestBaseComponent extends BaseComponent {
            static get observedAttributes() {
                return ['name'];
            }

            get properties() {
                return {
                    name: String,
                    lastName: prop.STRING.attribute('last-name'),
                };
            }

            get template() {
                return `<span>${this.name} ${this.lastName}</span>`;
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

        define(tag, TestBaseComponent);

        elem = new TestBaseComponent();
        elem.lastName = 'Turing';
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), tag);
        });

        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            DOM.appendChild(wrapper, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(wrapper, elem);
            assert.equal(elem.attached, false);
        });
    });
});

describe('[Compat] BaseComponent with native element', () => {
    let elem, wrapper, tag = getComponentName();

    before(() => {
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
        DOM.lifeCycle(true);

        class TestBaseComponent extends BaseComponent {
            static get observedAttributes() {
                return ['name'];
            }

            get properties() {
                return {
                    name: String,
                    lastName: prop.STRING.attribute('last-name'),
                };
            }

            get template() {
                return `<span>${this.name} ${this.lastName}</span>`;
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

        define(tag, TestBaseComponent, {
            extends: 'button',
        });

        elem = new TestBaseComponent();
        elem.lastName = 'Turing';
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), 'button');
            assert.equal(elem.is.toLowerCase(), tag);
        });

        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            DOM.appendChild(wrapper, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(wrapper, elem);
            assert.equal(elem.attached, false);
        });
    });
});

describe('[Compat] Base IDOM Component', () => {
    let elem, wrapper, tag = getComponentName();

    before(() => {
        DOM.lifeCycle(true);

        class TestBaseIDOMComponent extends BaseComponent {
            static get observedAttributes() {
                return ['name'];
            }

            get properties() {
                return {
                    name: String,
                    lastName: prop.STRING.attribute('last-name'),
                    age: Number,
                };
            }

            get template() {
                return () => <span>{this.name} {this.lastName} {this.age}{this.undefinedProp}{false}{0}</span>;
            }

            constructor(node) {
                super(node);
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

        define(tag, TestBaseIDOMComponent);

        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
        elem = render(wrapper, TestBaseIDOMComponent, { lastName: 'Turing', age: 42 });
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), tag);
        });

        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing 42');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(wrapper, elem);
            assert.equal(elem.attached, false);
        });
    });
});

describe('[Compat] Base IDOM Component with native element', () => {
    let elem, wrapper, tag = getComponentName();

    before(() => {
        DOM.lifeCycle(true);

        class TestBaseIDOMComponent extends BaseComponent {
            static get observedAttributes() {
                return ['name'];
            }

            get properties() {
                return {
                    name: String,
                    lastName: prop.STRING.attribute('last-name'),
                    age: Number,
                };
            }

            get template() {
                return () => <span>{this.name} {this.lastName} {this.age}{this.undefinedProp}{false}{0}</span>;
            }

            constructor(node) {
                super(node);
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

        define(tag, TestBaseIDOMComponent, {
            extends: 'button',
        });

        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
        elem = render(wrapper, TestBaseIDOMComponent, { lastName: 'Turing', age: 42 });
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), 'button');
            assert.equal(elem.is, tag);
        });

        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing 42');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(wrapper, elem);
            assert.equal(elem.attached, false);
        });
    });
});
