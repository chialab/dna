import { define, DOM, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('Compat', () => {
    let elem, wrapper;

    describe('Component', () => {
        before(() => {
            DOM.lifeCycle(true);
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);

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

            define(getComponentName(), TestComponent);
            elem = new TestComponent();
        });

        describe('> created', () => {
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
                DOM.setAttribute(elem, 'test-callback', 'Alan');
                assert.equal(elem['test-callback'], 'Alan');
            });
        });

        describe('> detached', () => {
            it('check if element is correctly detached from the tree', () => {
                DOM.removeChild(wrapper, elem);
                assert.equal(elem.attached, false);
            });
        });
    });
});
