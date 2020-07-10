import { define, DOM, IDOM, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('[Compat] IDOM observer', () => {
    let wrapper, name = getComponentName();
    before(() => {
        DOM.lifeCycle(true);
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);

        class TestComponent extends BaseComponent {
            static get observedAttributes() {
                return ['age'];
            }

            static get properties() {
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

        define(name, TestComponent);
    });

    describe('callbacks', () => {
        let node, elem;
        before(() => {
            IDOM.patch(wrapper, (data) => {
                if (data.show) {
                    return IDOM.h(name, {
                        age: data.age,
                        married: data.married,
                    });
                }
            }, { show: true, age: 20, married: false });
            node = wrapper.querySelector(name);
            elem = DOM.getNodeComponent(node);
        });

        it('should create a component instance', () => {
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
        });

        it('should update a component', () => {
            IDOM.patch(wrapper, (data) => {
                if (data.show) {
                    return IDOM.h(name, {
                        age: data.age,
                        married: data.married,
                    });
                }
            }, { show: true, age: 21, married: true });
            assert.equal(elem.node.getAttribute('age'), '21');
            assert.equal(elem.age, 21);
            assert.equal(elem.attributeChanges, 2);
            assert.equal(elem.married, true);
        });

        it('should remove a component', () => {
            IDOM.patch(wrapper, (data) => {
                if (data.show) {
                    return IDOM.h(name, {
                        age: data.age,
                        married: data.married,
                    });
                }
            }, { show: false });
            assert.equal(elem.node.parentNode, undefined);
            assert.equal(elem.disconnectedTimes, 1);
        });
    });
});
