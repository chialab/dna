import { render, define, DOM, IDOM, trust, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('Compat', () => {
    let elem, wrapper, TestComponent;

    describe('HTML Component', () => {
        before(() => {
            DOM.lifeCycle(true);
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);

            TestComponent = class TestComponent extends BaseComponent {
                get properties() {
                    return {
                        content: String,
                    };
                }

                get template() {
                    return () => IDOM.h('p', {}, trust(this.content));
                }
            };

            define(getComponentName(), TestComponent);
        });

        describe('> inject simple content', () => {
            it('check if element has the correct content', () => {
                elem = render(wrapper, TestComponent, { content: 'Hello' });
                assert.equal(elem.node.innerHTML, '<p>Hello</p>');
            });
        });

        describe('> inject complex content', () => {
            before(() => {
                elem = render(wrapper, TestComponent, { content: 'Hello <strong>world!</strong>' });
            });

            it('check if element has the correct content', () => {
                assert.equal(elem.node.innerHTML, '<p>Hello <strong>world!</strong></p>');
            });

            it('check if element has all children', () => {
                expect(elem.node.querySelector('strong')).to.exist;
            });
        });
    });
});
