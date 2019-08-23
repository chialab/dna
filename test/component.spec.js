/* eslint-env mocha */
import { getModule } from './helpers.js';

let DNA;

describe('Component', () => {
    before(async () => {
        DNA = await getModule();
    });

    it('new() should create a node', () => {
        const TestElement = class extends DNA.Component { };
        DNA.define('test-component', TestElement);

        const elem = new TestElement();
        expect(elem).to.be.an.instanceof(DNA.DOM.HTMLElement);
        expect(elem.is).to.be.equal('test-component');
        expect(elem.tagName).to.be.equal('TEST-COMPONENT');
    });

    it('new() should extend a native node', () => {
        const TestElement = class extends DNA.Component { };
        DNA.define('test-component2', TestElement, {
            extends: 'article',
        });

        const elem = new TestElement();
        expect(elem).to.be.an.instanceof(DNA.DOM.HTMLElement);
        expect(elem.is).to.be.equal('test-component2');
        expect(elem.tagName).to.be.equal('ARTICLE');
        expect(elem.getAttribute('is')).to.be.equal('test-component2');
    });
});
