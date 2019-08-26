/* eslint-env mocha */
import { getModule } from './helpers.js';

let DNA;

describe('Component', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#new', () => {
        it('should create a node', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-component', TestElement);

            const elem = new TestElement();
            expect(elem).to.be.an.instanceof(DNA.DOM.get('HTMLElement'));
            expect(elem.is).to.be.equal('test-component');
            expect(elem.tagName).to.be.equal('TEST-COMPONENT');
        });

        it('should extend a native node', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-component2', TestElement, {
                extends: 'article',
            });

            const elem = new TestElement();
            expect(elem).to.be.an.instanceof(DNA.DOM.get('HTMLElement'));
            expect(elem.is).to.be.equal('test-component2');
            expect(elem.tagName).to.be.equal('ARTICLE');
            expect(elem.getAttribute('is')).to.be.equal('test-component2');
        });
    });
});
