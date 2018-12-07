/* eslint-env mocha */

import { define, render, DOM } from '../../index.js';
import { CustomEvent } from '../../src/helpers/custom-event.js';
import { TestComponent, TestInvalidComponent, TestPropagationComponent } from '../components/events.js';
import chai from 'chai/chai.js';

DOM.lifeCycle(true);

function dispatch(node, evName) {
    let ev = new CustomEvent(evName, {
        bubbles: true,
        cancelable: true,
        detail: undefined,
    });
    return node.dispatchEvent(ev);
}

const WRAPPER = document.body;
define('test-events-component', TestComponent);
define('test2-events-component', TestInvalidComponent);
define('test3-events-component', TestPropagationComponent);

describe('Unit: EventsComponent', () => {
    const elem = render(WRAPPER, TestComponent);
    describe('delegate', () => {
        describe('custom events', () => {
            it('should be handled', () => {
                chai.assert.equal(elem.customElement, elem.node);
                chai.assert.equal(elem.custom instanceof Event, true);
                chai.assert.equal(elem.custom.detail.data, 1234);
            });
        });

        describe('using api', () => {
            const span = elem.node.querySelector('span');
            let fired = false;
            elem.delegate('checkDelegation', 'span', () => fired = true);
            dispatch(span, 'checkDelegation');
            it('should trigger a function callback', () => {
                chai.assert(fired);
            });
        });

        describe('events', () => {
            const span = elem.node.querySelector('span');
            const button = elem.node.querySelector('button');
            const input = elem.node.querySelector('input');

            before((done) => {
                dispatch(span, 'click');
                dispatch(button, 'click');
                input.value = 'DNA Tests';
                dispatch(input, 'change');
                setTimeout(() => done(), 500);
            });

            after(() => {
                delete elem.clickedSpan;
                delete elem.clickedElement;
                delete elem.changedElement;
                delete elem.clickedSpanEvent;
                delete elem.clicked;
                delete elem.changed;
            });

            it('should trigger a function callback', () => {
                chai.assert.equal(elem.clickedSpan, span);
                chai.assert.equal(elem.clickedSpanEvent instanceof Event, true);
                chai.assert.equal(elem.clickedSpanEvent.type, 'click');
            });

            it('should track click on button element', () => {
                chai.assert.equal(elem.clickedElement, button);
                chai.assert.equal(elem.clicked instanceof Event, true);
                chai.assert.equal(elem.clicked.type, 'click');
            });

            it('should track changes on input element', () => {
                chai.assert.equal(elem.changedElement, input);
                chai.assert.equal(elem.changed instanceof Event, true);
                chai.assert.equal(elem.changed.type, 'change');
            });
        });

        describe('undelegate', () => {
            const span = elem.node.querySelector('span');
            const button = elem.node.querySelector('button');
            const input = elem.node.querySelector('input');

            before((done) => {
                DOM.removeChild(WRAPPER, elem);
                dispatch(span, 'click');
                dispatch(button, 'click');
                input.value = 'DNA Tests';
                dispatch(input, 'change');
                setTimeout(() => done(), 500);
            });

            it('should stop to delegate on component detached', () => {
                chai.assert.equal(elem.clickedSpan, undefined);
                chai.assert.equal(elem.clickedSpanEvent, undefined);
                chai.assert.equal(elem.clickedElement, undefined);
                chai.assert.equal(elem.clicked, undefined);
                chai.assert.equal(elem.changedElement, undefined);
                chai.assert.equal(elem.changed, undefined);
            });
        });
    });
    describe('trigger', () => {
        it('should throw when event name is not defined in trigger', () => {
            let wrapper = () => {
                elem.trigger();
            };
            chai.assert.throws(wrapper, Error, 'Event name is undefined');
        });
    });
    describe('delegate invalid callbacks', () => {
        it('should throw', () => {
            let wrapper = () => {
                render(WRAPPER, TestInvalidComponent);
            };
            chai.assert.throws(wrapper, TypeError, 'Invalid callback for event.');
        });
    });
    describe('propagation', () => {
        it('should stop', () => {
            const elem = render(WRAPPER, TestPropagationComponent);
            const checks = {
                click1: false,
                click2: false,
                click3: false,
                click4: false,
                click5: false,
            };
            elem.delegate('click', '.child', () => {
                // this should not trigger
                checks.click1 = true;
            });
            elem.delegate('click', '.child3', (ev) => {
                // this should not trigger
                ev.stopPropagation();
                checks.click3 = true;
            });
            elem.delegate('click', '.child5', (ev, target) => {
                checks.click5 = target.classList.contains('child5');
            });
            elem.delegate('click', '.child2', (ev, target) => {
                ev.stopPropagation();
                checks.click2 = target.classList.contains('child2');
            });
            elem.delegate('click', '.child4', (ev, target) => {
                checks.click4 = target.classList.contains('child4');
            });

            let elementToClick = elem.node.querySelector('.child5');
            dispatch(elementToClick, 'click');

            chai.assert(!checks.click1);
            chai.assert(checks.click2);
            chai.assert(!checks.click3);
            chai.assert(checks.click4);
            chai.assert(checks.click5);
        });
    });
});
