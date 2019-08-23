/* eslint-env mocha */
import { getModule, spyFunction } from './helpers.js';

let DNA;

describe('events', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    let element, button;
    beforeEach(() => {
        element = DNA.DOM.createElement('div');
        button = DNA.DOM.createElement('button');
        element.appendChild(button);
        DNA.DOM.document.body.appendChild(element);
    });

    afterEach(() => {
        DNA.DOM.document.body.removeChild(element);
    });

    describe('#dispatchEvent', () => {
        it('should dispatch custom events', () => {
            const listener = spyFunction(() => { });
            element.addEventListener('click', listener);
            DNA.dispatchEvent(element, 'click');
            expect(listener.invoked).to.be.true;
        });

        it('should dispatch custom events with details', () => {
            const details = {};
            const listener = spyFunction((event) => event.detail);
            element.addEventListener('click', listener);
            DNA.dispatchEvent(element, 'click', details);
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
            DNA.dispatchEvent(button, 'click', null, false);
            expect(listener.invoked).to.be.false;
        });

        it.skip('should dispatch custom events that is not canceleable', () => {
            //
        });

        it('should validate dispatch input', () => {
            expect(() => {
                DNA.dispatchEvent(null);
            }).to.throw(TypeError, 'The provided element is not a HTMLElement');

            expect(() => {
                DNA.dispatchEvent(element, null);
            }).to.throw(TypeError, 'The provided event is not an Event');

            expect(() => {
                DNA.dispatchEvent(element, 'click', null, null, null, null);
            }).to.throw(TypeError, 'The provided bubbles option is not a boolean');

            expect(() => {
                DNA.dispatchEvent(element, 'click', null, true, null, null);
            }).to.throw(TypeError, 'The provided cancelable option is not a boolean');

            expect(() => {
                DNA.dispatchEvent(element, 'click', null, true, true, null);
            }).to.throw(TypeError, 'The provided composed option is not a boolean');
        });
    });

    describe('#delegate', () => {
        it('should add delegate a listener', () => {
            const listener = spyFunction(() => { });
            DNA.delegate(element, 'click', 'button', listener);
            DNA.delegate(element, 'mouseenter', 'button', listener);
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');

            expect(listener.invoked).to.be.true;
            expect(listener.count).to.be.equal(2);
        });

        it('should validate delegation input', () => {
            expect(() => {
                DNA.delegate(null, null, null, null);
            }).to.throw(TypeError, 'The provided element is not a HTMLElement');

            expect(() => {
                DNA.delegate(element, null, null, null);
            }).to.throw(TypeError, 'The provided event name is not a string');

            expect(() => {
                DNA.delegate(element, 'click', null, null);
            }).to.throw(TypeError, 'The provided selector is not a string');

            expect(() => {
                DNA.delegate(element, 'click', 'button', null);
            }).to.throw(TypeError, 'The provided callback is not a function');
        });

        it.skip('should stop propagation', () => {
            // ...
        });

        it.skip('should immediately stop propagation', () => {
            // ...
        });
    });

    describe('#undelegate', () => {
        it('should remove a delegated event listener', () => {
            const listener = spyFunction(() => { });
            const listener2 = spyFunction(() => { });
            DNA.delegate(element, 'click', 'button', listener);
            DNA.delegate(element, 'click', 'button', listener2);
            button.click();
            DNA.undelegate(element, 'click', 'button', listener2);
            button.click();

            expect(listener.count).to.be.equal(2);
            expect(listener2.count).to.be.equal(1);
        });

        it('should remove all delegated event listeners for an event', () => {
            const listener = spyFunction(() => { });
            const listener2 = spyFunction(() => { });
            DNA.delegate(element, 'click', 'button', listener);
            DNA.delegate(element, 'click', 'button', listener2);
            DNA.delegate(element, 'mouseenter', 'button', listener);
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');
            DNA.undelegate(element, 'click');
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');

            expect(listener.count).to.be.equal(3);
            expect(listener2.count).to.be.equal(1);
        });

        it('should remove all delegated event listeners', () => {
            const listener = spyFunction(() => { });
            DNA.delegate(element, 'click', 'button', listener);
            DNA.delegate(element, 'mouseenter', 'button', listener);
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');
            DNA.undelegate(element);
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');

            expect(listener.count).to.be.equal(2);
        });

        it('should validate undelegation input', () => {
            expect(() => {
                DNA.undelegate(null, null, null, null);
            }).to.throw(TypeError, 'The provided element is not a HTMLElement');

            expect(() => {
                DNA.undelegate(element, null, null, null);
            }).to.throw(TypeError, 'The provided event name is not a string');

            expect(() => {
                DNA.undelegate(element, 'click', null, null);
            }).to.throw(TypeError, 'The provided selector is not a string');

            expect(() => {
                DNA.undelegate(element, 'click', 'button', 1);
            }).to.throw(TypeError, 'The provided callback is not a function');
        });
    });
});
