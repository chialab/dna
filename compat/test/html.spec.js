import { render, define, DOM, IDOM, trust, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('Compat', () => {
    let elem, wrapper, TestComponent;

    describe('HTML Component', () => {
        let name;

        before(() => {
            DOM.lifeCycle(true);
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);
            name = getComponentName();

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

            define(name, TestComponent);
        });

        describe('> inject simple content', () => {
            it('check if element has the correct content', () => {
                elem = render(wrapper, TestComponent, { content: 'Hello' });
                assert.equal(elem.node.innerHTML, `<p :scope="${name}">Hello</p>`);
            });
        });

        describe('> inject complex content', () => {
            before(() => {
                elem = render(wrapper, TestComponent, { content: 'Hello <strong>world!</strong>' });
            });

            it('check if element has the correct content', () => {
                assert.equal(elem.node.innerHTML, `<p :scope="${name}">Hello <strong :scope="${name}">world!</strong></p>`);
            });

            it('check if element has all children', () => {
                expect(elem.node.querySelector('strong')).to.exist;
            });
        });
    });
});
