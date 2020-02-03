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

        it.skip('should render on connect', () => {
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

    describe('#propertyChangedCallback', () => {
        it.skip('should handle property changes on assignment', () => {
            //
        });

        it.skip('should handle property changes on deletion', () => {
            //
        });

        it.skip('should NOT handle property if nothing changed on assignment', () => {
            //
        });
    });

    describe('#appendChild', () => {
        it.skip('should append and connect child', () => {
            //
        });

        it.skip('should move and connect a child from a parent', () => {
            //
        });
    });

    describe('#removeChild', () => {
        it.skip('should remove and disconnect a child', () => {
            //
        });
    });

    describe('#insertBefore', () => {
        it.skip('should insert and connect a child before another', () => {
            //
        });

        it('should insert and connect a child (and remove it from the previous parent) before another', () => {
            //
        });

        it('should do nothing when child is already before another', () => {
            //
        });
    });

    describe('#replaceChild', () => {
        it.skip('should reaplce and connect child in a parent', () => {
            //
        });

        it.skip('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
            //
        });

        it.skip('should do nothing if the node is the same', () => {
            //
        });
    });

    describe('#observe', () => {
        it.skip('should observe property changes', () => {
            //
        });
    });

    describe('#unobserve', () => {
        it.skip('should unobserve property changes', () => {
            //
        });
    });

    describe('#dispatchEvent', () => {
        it.skip('should dispatch an event', () => {
            //
        });

        it.skip('should create and dispatch a custom event', () => {
            //
        });
    });

    describe('#delegate', () => {
        it.skip('should delegate an event', () => {
            //
        });
    });

    describe('#undelegate', () => {
        it.skip('should undelegate an event', () => {
            //
        });
    });

    describe('#getAttribute', () => {
        it.skip('should get an empty attribute', () => {
            //
        });

        it.skip('should get an attribute', () => {
            //
        });
    });

    describe('#setAttribute', () => {
        it('should set an attribute', () => {
            //
        });

        it('should set an attribute and update the property', () => {
            //
        });
    });

    describe('#hasAttribute', () => {
        it.skip('should return `true` if element has an attribute', () => {
            //
        });

        it.skip('should return `false` if element has an attribute', () => {
            //
        });
    });

    describe('#removeAttribute', () => {
        it.skip('should remove an attribute', () => {
            //
        });

        it('should remove an attribute and update the property', () => {
            //
        });
    });
});
