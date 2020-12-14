import { define, render, DOM, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('Compat', () => {
    let elem, wrapper, TestComponent;

    describe('Events', () => {
        before(() => {
            DOM.lifeCycle(true);
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);

            TestComponent = class TestComponent extends BaseComponent {
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
            };

            define(getComponentName(), TestComponent);
        });

        beforeEach(() => {
            elem = render(wrapper, TestComponent);
        });

        describe('delegate', () => {
            describe('custom events', () => {
                it('should be handled', () => {
                    assert.equal(elem.customElement, elem.node);
                    assert.equal(elem.custom instanceof Event, true);
                    assert.equal(elem.custom.detail.data, 1234);
                });
            });

            describe('using api', () => {
                it('should trigger a function callback', () => {
                    let fired = false;
                    let span = elem.node.querySelector('span');
                    elem.delegate('checkDelegation', 'span', () => fired = true);
                    DOM.dispatchEvent(span, 'checkDelegation');
                    assert(fired);
                });
            });

            describe('events', () => {
                it('should trigger a function callback', () => {
                    let span = elem.node.querySelector('span');
                    DOM.dispatchEvent(span, 'click');
                    assert.equal(elem.clickedSpan, span);
                    assert.equal(elem.clickedSpanEvent instanceof Event, true);
                    assert.equal(elem.clickedSpanEvent.type, 'click');
                });

                it('should track click on button element', () => {
                    let button = elem.node.querySelector('button');
                    DOM.dispatchEvent(button, 'click');
                    assert.equal(elem.clickedElement, button);
                    assert.equal(elem.clicked instanceof Event, true);
                    assert.equal(elem.clicked.type, 'click');
                });

                it('should track changes on input element', () => {
                    let input = elem.node.querySelector('input');
                    input.value = 'DNA Tests';
                    DOM.dispatchEvent(input, 'change');
                    assert.equal(elem.changedElement, input);
                    assert.equal(elem.changed instanceof Event, true);
                    assert.equal(elem.changed.type, 'change');
                });
            });

            describe.skip('undelegate', () => {
                it('should stop to delegate on component detached', () => {
                    let span = elem.node.querySelector('span');
                    let button = elem.node.querySelector('button');
                    let input = elem.node.querySelector('input');
                    DOM.removeChild(wrapper, elem);
                    DOM.dispatchEvent(span, 'click');
                    DOM.dispatchEvent(button, 'click');
                    input.value = 'DNA Tests';
                    DOM.dispatchEvent(input, 'change');
                    assert.equal(elem.clickedSpan, undefined);
                    assert.equal(elem.clickedSpanEvent, undefined);
                    assert.equal(elem.clickedElement, undefined);
                    assert.equal(elem.clicked, undefined);
                    assert.equal(elem.changedElement, undefined);
                    assert.equal(elem.changed, undefined);
                });
            });
        });

        describe('trigger', () => {
            it('should throw when event name is not defined in trigger', () => {
                assert.throws(() => {
                    elem.trigger();
                }, Error, 'The provided object must be an Event');
            });
        });

        describe('delegate invalid callbacks', () => {
            it('should throw', () => {
                class TestInvalidComponent extends BaseComponent {
                    get events() {
                        return {
                            customEvent: 'undefined',
                        };
                    }
                }

                define(getComponentName(), TestInvalidComponent);

                assert.throws(() => {
                    render(wrapper, TestInvalidComponent);
                }, TypeError, 'The provided callback must be a function');
            });
        });

        describe('propagation', () => {
            it('should stop', () => {
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

                define(getComponentName(), TestPropagationComponent);

                const elem = render(wrapper, TestPropagationComponent);
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
});
