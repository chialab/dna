import { define, render, DOM, BaseComponent } from '../../dist/adapters/compat/dna.js';

const WRAPPER = document.body;

class TestComponent extends BaseComponent {
    get events() {
        return {
            'customEvent': 'onCustomEvent',
            'click button': 'onClick',
            'click span'(ev, span) {
                this.clickedSpan = span;
                this.clickedSpanEvent = ev;
            },
            'change input': 'onInputChange',
        };
    }

    get template() {
        return `
            <button id="button">Click</button>
            <input type="text" id="input" value="Test" />
            <span>Hold me</span>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('customEvent', {
            data: 1234,
        });
    }

    onClick(ev, element) {
        this.clicked = ev;
        this.clickedElement = element;
    }

    onInputChange(ev, element) {
        this.changed = ev;
        this.changedElement = element;
    }

    onCustomEvent(ev, element) {
        this.custom = ev;
        this.customElement = element;
    }
}

class TestInvalidComponent extends BaseComponent {
    get events() {
        return {
            customEvent: 'undefined',
        };
    }
}

class TestPropagationComponent extends BaseComponent {
    get template() {
        return `<div class="child1">
            <div class="child2">
                <div class="child4">
                    <div class="child5"></div>
                </div>
            </div>
            <div class="child3"></div>
        </div>`;
    }
}

define('test-events-component', TestComponent);
define('test2-events-component', TestInvalidComponent);
define('test3-events-component', TestPropagationComponent);

DOM.lifeCycle(true);

describe.skip('[Unit] EventsComponent', () => {
    let elem;
    before(() => {
        elem = render(WRAPPER, TestComponent);
    });

    describe.skip('delegate', () => {
        describe.skip('custom events', () => {
            it.skip('should be handled', () => {
                assert.equal(elem.customElement, elem.node);
                assert.equal(elem.custom instanceof Event, true);
                assert.equal(elem.custom.detail.data, 1234);
            });
        });

        describe.skip('using api', () => {
            let fired = false;
            before(() => {
                let span = elem.node.querySelector('span');
                elem.delegate('checkDelegation', 'span', () => fired = true);
                DOM.dispatchEvent(span, 'checkDelegation');
            });

            it.skip('should trigger a function callback', () => {
                assert(fired);
            });
        });

        describe.skip('events', () => {
            let span, button, input;

            before((done) => {
                span = elem.node.querySelector('span');
                button = elem.node.querySelector('button');
                input = elem.node.querySelector('input');
                DOM.dispatchEvent(span, 'click');
                DOM.dispatchEvent(button, 'click');
                input.value = 'DNA Tests';
                DOM.dispatchEvent(input, 'change');
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

            it.skip('should trigger a function callback', () => {
                assert.equal(elem.clickedSpan, span);
                assert.equal(elem.clickedSpanEvent instanceof Event, true);
                assert.equal(elem.clickedSpanEvent.type, 'click');
            });

            it.skip('should track click on button element', () => {
                assert.equal(elem.clickedElement, button);
                assert.equal(elem.clicked instanceof Event, true);
                assert.equal(elem.clicked.type, 'click');
            });

            it.skip('should track changes on input element', () => {
                assert.equal(elem.changedElement, input);
                assert.equal(elem.changed instanceof Event, true);
                assert.equal(elem.changed.type, 'change');
            });
        });

        describe.skip('undelegate', () => {
            let span, button, input;

            before((done) => {
                span = elem.node.querySelector('span');
                button = elem.node.querySelector('button');
                input = elem.node.querySelector('input');
                DOM.removeChild(WRAPPER, elem);
                DOM.dispatchEvent(span, 'click');
                DOM.dispatchEvent(button, 'click');
                input.value = 'DNA Tests';
                DOM.dispatchEvent(input, 'change');
                setTimeout(() => done(), 500);
            });

            it.skip('should stop to delegate on component detached', () => {
                assert.equal(elem.clickedSpan, undefined);
                assert.equal(elem.clickedSpanEvent, undefined);
                assert.equal(elem.clickedElement, undefined);
                assert.equal(elem.clicked, undefined);
                assert.equal(elem.changedElement, undefined);
                assert.equal(elem.changed, undefined);
            });
        });
    });

    describe.skip('trigger', () => {
        it.skip('should throw when event name is not defined in trigger', () => {
            let wrapper = () => {
                elem.trigger();
            };
            assert.throws(wrapper, Error, 'Event name is undefined');
        });
    });

    describe.skip('delegate invalid callbacks', () => {
        it.skip('should throw', () => {
            let wrapper = () => {
                render(WRAPPER, TestInvalidComponent);
            };
            assert.throws(wrapper, TypeError, 'Invalid callback for event.');
        });
    });

    describe.skip('propagation', () => {
        it.skip('should stop', () => {
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
            DOM.dispatchEvent(elementToClick, 'click');

            assert(!checks.click1);
            assert(checks.click2);
            assert(!checks.click3);
            assert(checks.click4);
            assert(checks.click5);
        });
    });
});
