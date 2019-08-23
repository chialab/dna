/* eslint-env mocha */
import { getModule } from './helpers.js';

let DNA;

describe('DOM', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#createElement', () => {
        it('should create a defined element', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-domcreate', TestElement);

            const elem2 = DNA.DOM.createElement('test-domcreate');
            expect(elem2.is).to.be.equal('test-domcreate');
            expect(elem2.tagName).to.be.equal('TEST-DOMCREATE');
        });

        it('should create and extend a native element', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-domcreate2', TestElement, {
                extends: 'article',
            });

            const elem2 = DNA.DOM.createElement('test-domcreate2');
            expect(elem2.is).to.be.equal('test-domcreate2');
            expect(elem2.tagName).to.be.equal('ARTICLE');
            expect(elem2.getAttribute('is')).to.be.equal('test-domcreate2');
        });
    });
});
