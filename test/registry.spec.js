// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { expect, wait, spy } from '@chialab/ginsenghino';
import { getComponentName } from './helpers.spec.js';

describe('registry', function() {
    this.timeout(10 * 1000);

    describe('#get', () => {
        it('should not return undefined component', () => {
            expect(DNA.customElements.get(getComponentName())).to.be.undefined;
        });
    });

    describe('#define', () => {
        it('should define a tag', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.customElements.define(is, TestElement);
            expect(DNA.customElements.get(is)).to.be.equal(TestElement);
        });

        it('should extend a native tag', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.customElements.define(is, TestElement, {
                extends: 'article',
            });
            expect(DNA.customElements.get(is)).to.be.equal(TestElement);
        });

        it('should throw if the tag has been already defined', () => {
            const is = getComponentName();
            DNA.customElements.define(is, class extends DNA.Component { });
            expect(() => {
                DNA.customElements.define(is, class extends DNA.Component { });
            }).to.throw(Error, 'The registry already contains an entry with the same name');
        });

        it('should throw if the Component has been already defined', () => {
            class TestElement extends DNA.Component { }
            DNA.customElements.define(getComponentName(), TestElement);
            expect(() => {
                DNA.customElements.define(getComponentName(), TestElement);
            }).to.throw(Error, 'The registry already contains an entry with the constructor (or is otherwise already defined)');
        });

        it('should validate define input', () => {
            expect(() => {
                DNA.customElements.define(null, null);
            }).to.throw(SyntaxError, 'The provided name must be a valid Custom Element name');

            expect(() => {
                DNA.customElements.define('test', null);
            }).to.throw(SyntaxError, 'The provided name must be a valid Custom Element name');

            expect(() => {
                DNA.customElements.define('2-test', null);
            }).to.throw(SyntaxError, 'The provided name must be a valid Custom Element name');

            expect(() => {
                DNA.customElements.define(getComponentName(), null);
            }).to.throw(TypeError, 'The referenced constructor must be a constructor');
        });
    });

    describe('#whenDefined', () => {
        it('should resolve a promise when an element is defined', async () => {
            const is = getComponentName();
            const Constructor = class extends DNA.Component { };
            const promise = DNA.customElements.whenDefined(is);
            DNA.customElements.define(is, Constructor);
            await expect(promise).to.eventually.be.equal(Constructor);
        });

        it('should return a resolved promise when an element has already been defined', async () => {
            const is = getComponentName();
            const Constructor = class extends DNA.Component { };
            DNA.customElements.define(is, Constructor);
            const promise = DNA.customElements.whenDefined(is);
            await expect(promise).to.eventually.be.equal(Constructor);
        });

        it('should not resolve for undefined element', async () => {
            const promise = DNA.customElements.whenDefined(getComponentName());
            expect(promise).not.be.fulfilled;
            await wait(2000);
            expect(promise).not.be.fulfilled;
        });
    });

    describe('#upgrade', () => {
        it('should upgrade a node after an element definition', () => {
            const attributeChangedCallback = spy();

            const is = getComponentName();
            const MyCard = class extends DNA.Component {
                static get observedAttributes() {
                    return ['name'];
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    attributeChangedCallback(...args);
                }
            };
            const wrapper = DNA.DOM.createElement('div');
            const card = DNA.DOM.createElement(is);
            card.setAttribute('name', 'Alan');
            wrapper.appendChild(card);
            expect(card).to.not.be.an.instanceof(MyCard);
            DNA.customElements.define(is, MyCard);
            DNA.customElements.upgrade(wrapper);
            expect(card).to.be.an.instanceof(MyCard);
            expect(attributeChangedCallback).to.have.been.called();
            expect(attributeChangedCallback).to.have.been.called.with('name', null, 'Alan');
        });

        it('should upgrade a builtin node after an element definition', () => {
            const spyAttributeChangedCallback = spy();

            const is = getComponentName();
            const MyCard = class extends DNA.Component {
                static get observedAttributes() {
                    return ['name'];
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    spyAttributeChangedCallback(...args);
                }
            };
            const wrapper = DNA.DOM.createElement('div');
            const card = DNA.DOM.createElement('article');
            card.setAttribute('is', is);
            card.setAttribute('name', 'Alan');
            wrapper.appendChild(card);
            expect(card).to.not.be.an.instanceof(MyCard);
            DNA.customElements.define(is, MyCard, {
                extends: 'article',
            });
            DNA.customElements.upgrade(wrapper);
            expect(card).to.be.an.instanceof(MyCard);
            expect(spyAttributeChangedCallback).to.have.been.called();
            expect(spyAttributeChangedCallback).to.have.been.called.with('name', null, 'Alan');
        });
    });
});
