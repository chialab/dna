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

        it.skip('should throw if element is not defined', () => {
            //
        });

        it.skip('should setup properties', () => {
            //
        });

        it.skip('should initialize properties', () => {
            //
        });

        it.skip('should connect already connected nodes', () => {
            //
        });
    });

    describe('#connectedCallback', () => {
        it.skip('should connect on appendChild', () => {
            //
        });

        it.skip('should connect on replaceChild', () => {
            //
        });

        it.skip('should connect on insertBefore', () => {
            //
        });

        it.skip('should NOT connect if not moved', () => {
            //
        });
    });

    describe('#disconnectedCallback', () => {
        it.skip('should disconnect on removeChild', () => {
            //
        });

        it.skip('should disconnect and reconnect on replaceChild', () => {
            //
        });

        it.skip('should disconnect and reconnect on insertBefore', () => {
            //
        });

        it.skip('should NOT disconnect if not moved', () => {
            //
        });
    });

    describe('#attributeChangedCallback', () => {
        it.skip('should handle attribute changes on setAttribute', () => {
            //
        });

        it.skip('should handle attribute changes on removeAttribute', () => {
            //
        });

        it.skip('should NOT handle attribute if nothing changed on setAttribute', () => {
            //
        });
    });
});
