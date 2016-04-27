import { register } from '../src/plugins/dna.webcomponents.js';
import { TestComponent } from './dna-events.next.js';

const Test = register('test-events-component', {
    prototype: TestComponent,
});

/* globals describe, before, it, assert */
describe('Unit: DNAEventsComponent', () => {
    let elem = new Test();
    before((done) => {
        document.body.appendChild(elem);
        setTimeout(() => {
            done();
        }, 50);
    });

    it('should track custom event on element', () => {
        assert.equal(elem.customElement, elem);
        assert.equal(elem.custom instanceof Event, true);
        assert.equal(elem.custom.detail.data, 1234);
    });

    it('should trigger a function callback', () => {
        let span = elem.querySelector('span');
        span.click();
        assert.equal(elem.clickedSpan, span);
        assert.equal(elem.clickedSpanEvent instanceof Event, true);
        assert.equal(elem.clickedSpanEvent.type, 'click');
    });

    it('should track click on button element', () => {
        let button = elem.querySelector('button');
        button.click();
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
