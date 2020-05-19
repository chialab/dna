import { DOM, window, define, bootstrap, render, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../helpers.js';

describe('[Compat] lib', () => {
    let wrapper, TestComponent1, TestComponent2, name1 = getComponentName(), name2 = getComponentName();

    before(() => {
        DOM.lifeCycle(true);
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);

        TestComponent1 = class TestComponent1 extends BaseComponent {
            static get observedAttributes() {
                return ['age'];
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
        };
        TestComponent2 = class TestComponent2 extends BaseComponent {
            static get observedAttributes() {
                return ['age'];
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
        };

        define(name1, TestComponent1);
        define(name2, TestComponent2, { extends: 'button' });
    });

    describe('define', () => {
        describe('a simple element', () => {
            it('should define a custom element', () => {
                const elem = new TestComponent1();
                assert.equal(elem.node.tagName.toLowerCase(), name1);
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });

        describe('an element with extends field', () => {
            it('a custom element with extends field', () => {
                const elem = render(wrapper, TestComponent2);
                assert.equal(elem.node.localName, 'button');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });
    });

    describe('DOM helpers', () => {
        let elem1, elem2;
        before(() => {
            elem1 = new TestComponent1();
            elem2 = render(wrapper, TestComponent2);
        });

        it('should do nothing', () => {
            const tmp = document.createElement('div');
            assert(!DOM.connect(tmp));
            assert(!DOM.disconnect(tmp));
        });

        it('should create a component instance', () => {
            assert.equal(elem1.node.tagName.toLowerCase(), name1);
            assert.equal(elem1.name, 'Alan');
            assert.equal(elem1.lastName, 'Turing');
        });

        it('should append a component', () => {
            DOM.appendChild(wrapper, elem1);
            assert.equal(elem1.node.parentNode, wrapper);
            assert.equal(elem1.disconnectedTimes, 0);
            assert.equal(elem1.connectedTimes, 1);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });

        it('should append a component before another', () => {
            DOM.insertBefore(wrapper, elem1, elem2);
            assert.equal(elem1.node.parentNode, wrapper);
            assert.equal(elem2.node.parentNode, wrapper);
            assert.equal(elem1.node.nextSibling, elem2.node);
            assert.equal(elem1.disconnectedTimes, 1);
            assert.equal(elem1.connectedTimes, 2);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });

        it('should do nothing if already before another', () => {
            DOM.insertBefore(wrapper, elem1, elem2);
            assert.equal(elem1.node.parentNode, wrapper);
            assert.equal(elem2.node.parentNode, wrapper);
            assert.equal(elem1.node.nextSibling, elem2.node);
            assert.equal(elem1.disconnectedTimes, 2);
            assert.equal(elem1.connectedTimes, 3);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });

        it('should append again a component', () => {
            DOM.appendChild(wrapper, elem1);
            assert.equal(elem1.node.parentNode, wrapper);
            assert.equal(elem1.disconnectedTimes, 3);
            assert.equal(elem1.connectedTimes, 4);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });

        it('should do nothing if already last child of parent', () => {
            DOM.appendChild(wrapper, elem1);
            assert.equal(elem1.node.parentNode, wrapper);
            assert.equal(elem1.disconnectedTimes, 4);
            assert.equal(elem1.connectedTimes, 5);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });

        it('should replace a child', () => {
            DOM.replaceChild(wrapper, elem1, elem2);
            assert.equal(elem1.node.parentNode, wrapper);
            assert.equal(elem1.disconnectedTimes, 5);
            assert.equal(elem1.connectedTimes, 6);
            assert.equal(elem2.disconnectedTimes, 1);
            assert.equal(elem2.connectedTimes, 1);
        });

        it('should set attributes', () => {
            DOM.setAttribute(elem1, 'age', 20);
            DOM.setAttribute(elem1, 'married', '');
            assert.equal(elem1.attributeChanges, 1);
            assert.equal(elem1.node.getAttribute('age'), '20');
            assert.equal(elem1.node.getAttribute('married'), '');
        });

        it('should remove attributes', () => {
            DOM.removeAttribute(elem1, 'age');
            DOM.removeAttribute(elem1, 'married');
            assert.equal(elem1.attributeChanges, 2);
            assert.equal(elem1.node.getAttribute('age'), null);
            assert.equal(elem1.node.getAttribute('married'), null);
        });
    });

    describe('bootstrap', () => {
        let wrapper, wrapper2;
        before(() => {
            wrapper = DOM.createElement('div');
            wrapper.innerHTML = `<p>Hello <${name1} age="21"></${name1}></p>`;
            wrapper2 = DOM.createElement('div');
            wrapper2.innerHTML = `<p>Hello again <${name1} age="21"></${name1}><${name1} age="22"></${name1}></p>`;
            DOM.appendChild(window.document.body, wrapper);
            DOM.appendChild(window.document.body, wrapper2);
        });

        it('should instantiate all components', () => {
            bootstrap(wrapper);
            const elem = DOM.getNodeComponent(
                wrapper.querySelector(`.${name1}`)
            );
            assert.equal(elem.node.localName, name1);
            assert.equal(elem.node.getAttribute('age'), '21');
            assert.equal(elem.node.getAttribute('class'), name1);
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
        });

        it('should call callback for every component', () => {
            let count = 0;
            bootstrap(wrapper2, () => {
                count++;
            });
            assert.equal(count, 2);
        });

        after(() => {
            DOM.removeChild(window.document.body, wrapper);
            DOM.removeChild(window.document.body, wrapper2);
        });
    });
});
