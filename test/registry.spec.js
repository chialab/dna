import { getModule, wait, spyPromise, getComponentName } from './helpers.js';

let DNA;

describe('registry', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#get', () => {
        it('should not return undefined component', () => {
            expect(DNA.get(getComponentName())).to.be.undefined;
        });
    });

    describe('#define', () => {
        it('should define a tag', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement);
            expect(DNA.get(is)).to.be.equal(TestElement);
        });

        it('should extend a native tag', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement, {
                extends: 'article',
            });
            expect(DNA.get(is)).to.be.equal(TestElement);
        });

        it('should throw if the tag has been already defined', () => {
            const is = getComponentName();
            DNA.define(is, class extends DNA.Component { });
            expect(() => {
                DNA.define(is, class extends DNA.Component { });
            }).to.throw(Error, 'The registry already contains an entry with the same name');
        });

        it('should throw if the Component has been already defined', () => {
            class TestElement extends DNA.Component { }
            DNA.define(getComponentName(), TestElement);
            expect(() => {
                DNA.define(getComponentName(), TestElement);
            }).to.throw(Error, 'The registry already contains an entry with the constructor (or is otherwise already defined)');
        });

        it('should validate define input', () => {
            expect(() => {
                DNA.define(null, null);
            }).to.throw(SyntaxError, 'The provided name must be a valid Custom Element name');

            expect(() => {
                DNA.define('test', null);
            }).to.throw(SyntaxError, 'The provided name must be a valid Custom Element name');

            expect(() => {
                DNA.define('2-test', null);
            }).to.throw(SyntaxError, 'The provided name must be a valid Custom Element name');

            expect(() => {
                DNA.define(getComponentName(), null);
            }).to.throw(TypeError, 'The referenced constructor must be a constructor');
        });
    });

    describe('#whenDefined', () => {
        it('should resolve a promise when an element is defined', async () => {
            const is = getComponentName();
            const promise = spyPromise(DNA.whenDefined(is));
            DNA.define(is, class extends DNA.Component { });
            await promise;
            expect(promise.resolved).to.be.true;
            expect(promise.response).to.be.undefined;
        });

        it('should return a resolved promise when an element has already been defined', async () => {
            const is = getComponentName();
            DNA.define(is, class extends DNA.Component { });
            const promise = spyPromise(DNA.whenDefined(is));
            await promise;
            expect(promise.resolved).to.be.true;
            expect(promise.response).to.be.undefined;
        });

        it('should not resolve for undefined element', async () => {
            const promise = spyPromise(DNA.whenDefined(getComponentName()));
            expect(promise.pending).to.be.true;
            await wait(2000);
            expect(promise.pending).to.be.true;
        });
    });

    describe('#upgrade', () => {
        it('should upgrade a node after an element definition', () => {
            const is = getComponentName();
            const MyCard = class extends DNA.Component { };
            const wrapper = DNA.DOM.createElement('div');
            const card = DNA.DOM.createElement(is);
            wrapper.appendChild(card);
            expect(card).to.not.be.an.instanceof(MyCard);
            DNA.define(is, MyCard);
            DNA.upgrade(wrapper);
            expect(card).to.be.an.instanceof(MyCard);
        });

        it('should upgrade a builtin node after an element definition', () => {
            const is = getComponentName();
            const MyCard = class extends DNA.Component { };
            const wrapper = DNA.DOM.createElement('div');
            const card = DNA.DOM.createElement('article');
            card.setAttribute('is', is);
            wrapper.appendChild(card);
            expect(card).to.not.be.an.instanceof(MyCard);
            DNA.define(is, MyCard, {
                extends: 'article',
            });
            DNA.upgrade(wrapper);
            expect(card).to.be.an.instanceof(MyCard);
        });
    });
});
