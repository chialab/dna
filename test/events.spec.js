/* eslint-env mocha */

import { define, render } from './library.js';
import { TestComponent, TestInvalidComponent } from './components/events.js';
import { Wrapper } from './utils/wrapper.js';

const WRAPPER = new Wrapper();
define('test-events-component', TestComponent);
define('test2-events-component', TestInvalidComponent);

describe('Unit: DNAEventsComponent', () => {
    describe('attach callbacks', () => {
        render(WRAPPER, TestComponent);
        const elem = WRAPPER.querySelector('test-events-component');

        it('should track custom event on element', () => {
            assert.equal(elem.customElement, elem);
            assert.equal(elem.custom instanceof Event, true);
            assert.equal(elem.custom.detail.data, 1234);
        });

        it('should trigger a function callback', () => {
            let span = elem.querySelector('span');
            elem.trigger.call(span, 'click');
            assert.equal(elem.clickedSpan, span);
            assert.equal(elem.clickedSpanEvent instanceof Event, true);
            assert.equal(elem.clickedSpanEvent.type, 'click');
        });

        it('should track click on button element', () => {
            let button = elem.querySelector('button');
            elem.trigger.call(button, 'click');
            assert.equal(elem.clickedElement, button);
            assert.equal(elem.clicked instanceof Event, true);
            assert.equal(elem.clicked.type, 'click');
        });

        it('should track changes on input element', () => {
            let input = elem.querySelector('input');
            input.value = 'DNA Tests';
            elem.trigger.call(input, 'change');
            assert.equal(elem.changedElement, input);
            assert.equal(elem.changed instanceof Event, true);
            assert.equal(elem.changed.type, 'change');
        });

        it('should throw when event name is not defined in trigger', () => {
            let wrapper = () => {
                elem.trigger();
            };
            assert.throws(wrapper, Error, 'Event name is undefined');
        });
    });

    describe('attach invalid callbacks', () => {
        it('should throw', () => {
            let wrapper = () => {
                render(WRAPPER, TestInvalidComponent);
            };
            assert.throws(wrapper, TypeError, 'Invalid callback for event.');
        });
    });
});
