import { Test } from './dna-events.next.js';

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
});
