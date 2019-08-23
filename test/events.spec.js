/* eslint-env mocha */
import { getModule, spyFunction } from './helpers.js';

let DNA;

describe('events', () => {
    before(async () => {
        DNA = await getModule();
    });

    it.skip('should dispatch custom events', () => {
        // ...
    });

    it('should add delegate a listener', () => {
        const wrapper = DNA.DOM.createElement('div');
        const button = DNA.DOM.createElement('button');
        wrapper.appendChild(button);
        const listener = spyFunction(() => { });
        DNA.delegate(wrapper, 'click', 'button', listener);
        DNA.delegate(wrapper, 'mouseenter', 'button', listener);
        button.click();
        DNA.dispatchEvent(button, 'mouseenter');

        expect(listener.invoked).to.be.true;
        expect(listener.count).to.be.equal(2);
    });

    it('should remove a delegated event listener', () => {
        const wrapper = DNA.DOM.createElement('div');
        const button = DNA.DOM.createElement('button');
        wrapper.appendChild(button);
        const listener = spyFunction(() => { });
        const listener2 = spyFunction(() => { });
        DNA.delegate(wrapper, 'click', 'button', listener);
        DNA.delegate(wrapper, 'click', 'button', listener2);
        button.click();
        DNA.undelegate(wrapper, 'click', 'button', listener2);
        button.click();

        expect(listener.count).to.be.equal(2);
        expect(listener2.count).to.be.equal(1);
    });

    it('should remove all delegated event listeners for an event', () => {
        const wrapper = DNA.DOM.createElement('div');
        const button = DNA.DOM.createElement('button');
        wrapper.appendChild(button);
        const listener = spyFunction(() => { });
        const listener2 = spyFunction(() => { });
        DNA.delegate(wrapper, 'click', 'button', listener);
        DNA.delegate(wrapper, 'click', 'button', listener2);
        DNA.delegate(wrapper, 'mouseenter', 'button', listener);
        button.click();
        DNA.dispatchEvent(button, 'mouseenter');
        DNA.undelegate(wrapper, 'click');
        button.click();
        DNA.dispatchEvent(button, 'mouseenter');

        expect(listener.count).to.be.equal(3);
        expect(listener2.count).to.be.equal(1);
    });

    it('should remove all delegated event listeners', () => {
        const wrapper = DNA.DOM.createElement('div');
        const button = DNA.DOM.createElement('button');
        wrapper.appendChild(button);
        const listener = spyFunction(() => { });
        DNA.delegate(wrapper, 'click', 'button', listener);
        DNA.delegate(wrapper, 'mouseenter', 'button', listener);
        button.click();
        DNA.dispatchEvent(button, 'mouseenter');
        DNA.undelegate(wrapper);
        button.click();
        DNA.dispatchEvent(button, 'mouseenter');

        expect(listener.count).to.be.equal(2);
    });

    it('should validate dispatch input', () => {
        const element = DNA.DOM.createElement('div');

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

    it('should validate delegation input', () => {
        const wrapper = DNA.DOM.createElement('div');

        expect(() => {
            DNA.delegate(null, null, null, null);
        }).to.throw(TypeError, 'The provided element is not a HTMLElement');

        expect(() => {
            DNA.delegate(wrapper, null, null, null);
        }).to.throw(TypeError, 'The provided event name is not a string');

        expect(() => {
            DNA.delegate(wrapper, 'click', null, null);
        }).to.throw(TypeError, 'The provided selector is not a string');

        expect(() => {
            DNA.delegate(wrapper, 'click', 'button', null);
        }).to.throw(TypeError, 'The provided callback is not a function');
    });

    it('should validate undelegation input', () => {
        const wrapper = DNA.DOM.createElement('div');

        expect(() => {
            DNA.undelegate(null, null, null, null);
        }).to.throw(TypeError, 'The provided element is not a HTMLElement');

        expect(() => {
            DNA.undelegate(wrapper, null, null, null);
        }).to.throw(TypeError, 'The provided event name is not a string');

        expect(() => {
            DNA.undelegate(wrapper, 'click', null, null);
        }).to.throw(TypeError, 'The provided selector is not a string');

        expect(() => {
            DNA.undelegate(wrapper, 'click', 'button', 1);
        }).to.throw(TypeError, 'The provided callback is not a function');
    });
});