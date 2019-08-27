/* eslint-env mocha */
import { getModule, spyFunction } from './helpers.js';

let DNA;

describe('DOM', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    let element, button;
    beforeEach(() => {
        element = DNA.DOM.createElement('div');
        button = DNA.DOM.createElement('button');
        element.appendChild(button);
        element.ownerDocument.body.appendChild(element);
    });

    afterEach(() => {
        element.ownerDocument.body.removeChild(element);
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

            const elem2 = DNA.DOM.createElement('article', { is: 'test-domcreate2' });
            expect(elem2.is).to.be.equal('test-domcreate2');
            expect(elem2.tagName).to.be.equal('ARTICLE');
            expect(elem2.getAttribute('is')).to.be.equal('test-domcreate2');
        });
    });

    describe('#get', () => {
        it('should retrieve an already defined class', () => {
            //
        });

        it('should retrieve a proxy class', () => {
            //
        });
    });

    describe('#define', () => {
        it('should define a native constructor', () => {
            //
        });

        it('should update an already proxies class', () => {
            //
        });
    });

    describe('#dispatchEvent', () => {
        it('should dispatch custom events', () => {
            const listener = spyFunction(() => { });
            element.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(element, 'click');
            expect(listener.invoked).to.be.true;
        });

        it('should dispatch custom events with details', () => {
            const details = {};
            const listener = spyFunction((event) => event.detail);
            element.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(element, 'click', details);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.equal(details);
        });

        it.skip('should dispatch custom events that does bubble', () => {
            //
        });

        it.skip('should dispatch custom events that is canceleable', () => {
            //
        });

        it('should dispatch custom events that does not bubble', () => {
            const listener = spyFunction((event) => event.detail);
            element.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(button, 'click', null, false);
            expect(listener.invoked).to.be.false;
        });

        it.skip('should dispatch custom events that is not canceleable', () => {
            //
        });

        it('should validate dispatch input', () => {
            expect(() => {
                DNA.DOM.dispatchEvent(null);
            }).to.throw(TypeError, 'The provided element is not a Node');

            expect(() => {
                DNA.DOM.dispatchEvent(element, null);
            }).to.throw(TypeError, 'The provided event is not an Event');

            expect(() => {
                DNA.DOM.dispatchEvent(element, 'click', null, null, null, null);
            }).to.throw(TypeError, 'The provided bubbles option is not a boolean');

            expect(() => {
                DNA.DOM.dispatchEvent(element, 'click', null, true, null, null);
            }).to.throw(TypeError, 'The provided cancelable option is not a boolean');

            expect(() => {
                DNA.DOM.dispatchEvent(element, 'click', null, true, true, null);
            }).to.throw(TypeError, 'The provided composed option is not a boolean');
        });
    });

    describe('#delegateEventListener', () => {
        it('should add delegate a listener', () => {
            const listener = spyFunction(() => { });
            DNA.DOM.delegateEventListener(element, 'click', 'button', listener);
            DNA.DOM.delegateEventListener(element, 'mouseenter', 'button', listener);
            button.click();
            DNA.DOM.dispatchEvent(button, 'mouseenter');

            expect(listener.invoked).to.be.true;
            expect(listener.count).to.be.equal(2);
        });

        it('should validate delegation input', () => {
            expect(() => {
                DNA.DOM.delegateEventListener(null, null, null, null);
            }).to.throw(TypeError, 'The provided element is not a Node');

            expect(() => {
                DNA.DOM.delegateEventListener(element, null, null, null);
            }).to.throw(TypeError, 'The provided event name is not a string');

            expect(() => {
                DNA.DOM.delegateEventListener(element, 'click', null, null);
            }).to.throw(TypeError, 'The provided selector is not a string');

            expect(() => {
                DNA.DOM.delegateEventListener(element, 'click', 'button', null);
            }).to.throw(TypeError, 'The provided callback is not a function');
        });

        it.skip('should stop propagation', () => {
            // ...
        });

        it.skip('should immediately stop propagation', () => {
            // ...
        });
    });

    describe('#undelegateEventListener', () => {
        it('should remove a delegated event listener', () => {
            const listener = spyFunction(() => { });
            const listener2 = spyFunction(() => { });
            DNA.DOM.delegateEventListener(element, 'click', 'button', listener);
            DNA.DOM.delegateEventListener(element, 'click', 'button', listener2);
            button.click();
            DNA.DOM.undelegateEventListener(element, 'click', 'button', listener2);
            button.click();

            expect(listener.count).to.be.equal(2);
            expect(listener2.count).to.be.equal(1);
        });

        it('should validate undelegateEventListener input', () => {
            expect(() => {
                DNA.DOM.undelegateEventListener(null, null, null, null);
            }).to.throw(TypeError, 'The provided element is not a Node');

            expect(() => {
                DNA.DOM.undelegateEventListener(element, null, null, null);
            }).to.throw(TypeError, 'The provided event name is not a string');

            expect(() => {
                DNA.DOM.undelegateEventListener(element, 'click', null, null);
            }).to.throw(TypeError, 'The provided selector is not a string');

            expect(() => {
                DNA.DOM.undelegateEventListener(element, 'click', 'button', 1);
            }).to.throw(TypeError, 'The provided callback is not a function');
        });
    });

    describe('#undelegateAllEventListeners', () => {
        it('should remove all delegated event listeners', () => {
            const listener = spyFunction(() => { });
            DNA.DOM.delegateEventListener(element, 'click', 'button', listener);
            DNA.DOM.delegateEventListener(element, 'mouseenter', 'button', listener);
            button.click();
            DNA.DOM.dispatchEvent(button, 'mouseenter');
            DNA.DOM.undelegateAllEventListeners(element);
            button.click();
            DNA.DOM.dispatchEvent(button, 'mouseenter');

            expect(listener.count).to.be.equal(2);
        });

        it('should validate undelegateAllEventListeners input', () => {
            expect(() => {
                DNA.DOM.undelegateEventListener(null, null, null, null);
            }).to.throw(TypeError, 'The provided element is not a Node');
        });
    });
});
