// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import _decorate from '@babel/runtime/helpers/decorate';
import { expect, spy } from '@chialab/ginsenghino';
import { getComponentName } from './helpers.spec.js';

describe('events', function() {
    this.timeout(10 * 1000);

    let wrapper;
    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
    });

    afterEach(() => {
        if (wrapper.parentNode) {
            wrapper.ownerDocument.body.removeChild(wrapper);
        }
    });

    describe('dispatchEvent', () => {
        it('should dispatch custom events', () => {
            const listener = spy();
            wrapper.addEventListener('click', listener);
            DNA.dispatchEvent(wrapper, 'click');
            expect(listener).to.have.been.called();
        });

        it('should dispatch custom events with details', () => {
            const listener = spy();
            const details = {};
            wrapper.addEventListener('click', (event) => listener(event.detail));
            DNA.dispatchEvent(wrapper, 'click', details);
            expect(listener).to.have.been.called();
            expect(listener).to.have.been.called.with(details);
        });

        it('should dispatch custom events that does bubble', () => {
            const listener = spy();
            const details = {};
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', (event) => listener(event.bubbles));
            DNA.dispatchEvent(child, 'click', details, true);
            expect(listener).to.have.been.called();
            expect(listener).to.have.been.called.with(true);
        });

        it('should dispatch custom events that is canceleable', () => {
            const listener = spy();

            const details = {};
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', (event) => listener(event.cancelable));
            DNA.dispatchEvent(child, 'click', details, true, true);
            expect(listener).to.have.been.called();
            expect(listener).to.have.been.called.with(true);
        });

        it('should dispatch custom events that does not bubble', () => {
            const listener1 = spy();
            const listener2 = spy();

            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);

            wrapper.addEventListener('click', (event) => listener1(event.bubbles));
            button.addEventListener('click', (event) => listener2(event.bubbles));
            DNA.dispatchEvent(button, 'click', null, false);

            expect(listener1).to.not.have.been.called();
            expect(listener2).to.have.been.called();
            expect(listener2).to.have.been.called.with(false);
        });

        it('should dispatch custom events that is not canceleable', () => {
            const listener = spy();

            const details = {};
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', (event) => listener(event.cancelable));
            DNA.dispatchEvent(child, 'click', details, true, false);

            expect(listener).to.have.been.called();
            expect(listener).to.have.been.called.with(false);
        });

        it('should validate dispatch input', () => {
            expect(() => {
                DNA.dispatchEvent(null);
            }).to.throw(TypeError, 'The provided element must be a Node');

            expect(() => {
                DNA.dispatchEvent(wrapper, null);
            }).to.throw(TypeError, 'The provided object must be an Event');

            expect(() => {
                DNA.dispatchEvent(wrapper, 'click', null, null, null, null);
            }).to.throw(TypeError);

            expect(() => {
                DNA.dispatchEvent(wrapper, 'click', null, true, null, null);
            }).to.throw(TypeError);

            expect(() => {
                DNA.dispatchEvent(wrapper, 'click', null, true, true, null);
            }).to.throw(TypeError);
        });
    });

    describe('dispatchAyncEvent', () => {
        it('should trigger an event and return a Promise', async () => {
            wrapper.addEventListener('click', (event) => {
                event.respondWith(async () => event.type);
            });
            wrapper.addEventListener('click', (event) => {
                event.respondWith(async () => event.target.tagName);
            });
            const response = await DNA.dispatchAsyncEvent(wrapper, 'click');
            expect(response).to.be.deep.equal(['click', 'DIV']);
        });
    });

    describe('delegateEventListener', () => {
        it('should delegate a listener', () => {
            const listener = spy();

            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            DNA.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.delegateEventListener(wrapper, 'mouseenter', 'button', listener);
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');

            expect(listener).to.have.been.called.twice;
        });

        it('should validate delegation input', () => {
            expect(() => {
                DNA.delegateEventListener(false, false, false, false);
            }).to.throw(TypeError, 'The provided element must be a Node');

            expect(() => {
                DNA.delegateEventListener(wrapper, false, false, false);
            }).to.throw(TypeError, 'The provided event name must be a string');

            expect(() => {
                DNA.delegateEventListener(wrapper, 'click', false, false);
            }).to.throw(TypeError, 'The provided selector must be a string');

            expect(() => {
                DNA.delegateEventListener(wrapper, 'click', 'button', false);
            }).to.throw(TypeError, 'The provided callback must be a function');
        });

        it('should stop propagation', () => {
            const listener1 = spy();
            const listener2 = spy((event) => {
                event.stopPropagation();
            });
            const listener3 = spy();
            const listener4 = spy();

            const child = DNA.DOM.createElement('div');
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(child);
            child.appendChild(button);
            DNA.delegateEventListener(child, 'click', 'div', listener1);
            DNA.delegateEventListener(child, 'click', 'button', listener2);
            DNA.delegateEventListener(child, 'click', 'button', listener3);
            DNA.delegateEventListener(child, 'click', null, listener4);
            button.click();

            expect(listener1).to.not.have.been.called();
            expect(listener2).to.have.been.called();
            expect(listener3).to.have.been.called();
            expect(listener4).to.not.have.been.called();
        });

        it('should immediately stop propagation', () => {
            const listener1 = spy();
            const listener2 = spy((event) => {
                event.stopImmediatePropagation();
            });
            const listener3 = spy();
            const listener4 = spy();

            const child = DNA.DOM.createElement('div');
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(child);
            child.appendChild(button);
            DNA.delegateEventListener(child, 'click', 'div', listener1);
            DNA.delegateEventListener(child, 'click', 'button', listener2);
            DNA.delegateEventListener(child, 'click', 'button', listener3);
            DNA.delegateEventListener(child, 'click', null, listener4);
            button.click();

            expect(listener1).to.not.have.been.called();
            expect(listener2).to.have.been.called();
            expect(listener3).to.not.have.been.called();
            expect(listener4).to.not.have.been.called();
        });
    });

    describe('undelegateEventListener', () => {
        it('should remove a delegated event listener', () => {
            const listener = spy();
            const listener2 = spy();

            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            DNA.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.delegateEventListener(wrapper, 'click', 'button', listener2);
            button.click();
            DNA.undelegateEventListener(wrapper, 'click', 'button', listener2);
            button.click();

            expect(listener).to.have.been.called.twice;
            expect(listener2).to.have.been.called.once;
        });

        it('should do nothing if there are no delegations', () => {
            const button = DNA.DOM.createElement('button');
            expect(() => {
                DNA.undelegateEventListener(button, 'click', null, () => { });
            }).to.not.throw();
        });

        it('should do nothing if there are no delegations for an event', () => {
            const button = DNA.DOM.createElement('button');
            DNA.delegateEventListener(button, 'click', null, () => {});
            expect(() => {
                DNA.undelegateEventListener(button, 'missing', null, () => { });
            }).to.not.throw();
        });

        it('should validate undelegateEventListener input', () => {
            expect(() => {
                DNA.undelegateEventListener(false, false, false, false);
            }).to.throw(TypeError, 'The provided element must be a Node');

            expect(() => {
                DNA.undelegateEventListener(wrapper, false, false, false);
            }).to.throw(TypeError, 'The provided event name must be a string');

            expect(() => {
                DNA.undelegateEventListener(wrapper, 'click', false, false);
            }).to.throw(TypeError, 'The provided selector must be a string');

            expect(() => {
                DNA.undelegateEventListener(wrapper, 'click', 'button', false);
            }).to.throw(TypeError, 'The provided callback must be a function');
        });
    });

    describe('listeners getter', () => {
        it('should add a listener', () => {
            const callback = spy();

            const is = getComponentName();
            class TestElement extends DNA.Component {
                static get listeners() {
                    return {
                        click: TestElement.prototype.method,
                        change: (event, target) => callback(event.type, target.tagName),
                    };
                }

                method(event, target) {
                    callback(event.type, target.tagName);
                }
            }

            DNA.customElements.define(is, TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            element.click();
            expect(callback).to.have.been.called();
            expect(callback).to.have.been.called.with('click', is.toUpperCase());
            element.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback).to.have.been.called.with('change', is.toUpperCase());
            expect(callback).to.be.have.been.called.twice;
        });

        it('should add a delegated listener', () => {
            const callback = spy();

            class TestElement extends DNA.Component {
                static get listeners() {
                    return {
                        'click button': (event, target) => callback(event.type, target.tagName),
                    };
                }

                render() {
                    return DNA.compile('<button></button>');
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            element.querySelector('button').click();
            expect(callback).to.have.been.called();
            expect(callback).to.have.been.called.with('click', 'BUTTON');
        });

        it('should inherit listeners', () => {
            const callback1 = spy();
            const callback2 = spy();
            const callback3 = spy();
            const callback4 = spy();

            class BaseElement extends DNA.Component {
                static get listeners() {
                    return {
                        'click button': callback1,
                        'change': callback2,
                    };
                }

                render() {
                    return DNA.compile('<button></button>');
                }
            }

            class TestElement1 extends BaseElement {
                static get listeners() {
                    return {
                        'click button': callback3,
                        'drop': callback4,
                    };
                }
            }

            class TestElement2 extends BaseElement {
                static get listeners() {
                    return {};
                }
            }

            DNA.customElements.define(getComponentName(), BaseElement);
            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2);

            const element1 = new TestElement1();
            DNA.DOM.appendChild(wrapper, element1);
            expect(callback1).to.not.have.been.called();
            expect(callback2).to.not.have.been.called();
            expect(callback3).to.not.have.been.called();
            element1.querySelector('button').click();
            element1.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1).to.have.been.called();
            expect(callback2).to.have.been.called();
            expect(callback3).to.have.been.called();

            const element2 = new TestElement2();
            DNA.DOM.appendChild(wrapper, element2);
            element2.querySelector('button').click();
            element2.dispatchEvent(DNA.DOM.createEvent('drop', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1).to.have.been.called.twice;
            expect(callback2).to.have.been.called.once;
            expect(callback3).to.have.been.called.once;
            expect(callback4).to.not.have.been.called();
        });
    });

    describe('listener decorator', () => {
        it('should add a listener', () => {
            const callback = spy();

            const is = getComponentName();
            let TestElement = class TestElement extends DNA.Component {
                method(event, target) {
                    callback(event.type, target.tagName);
                }
            };

            __decorate([
                DNA.listen('click'),
            ], TestElement.prototype, 'method', undefined);
            TestElement = __decorate([
                DNA.customElement(is),
            ], TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            element.click();
            expect(callback).to.have.been.called();
            expect(callback).to.have.been.called.with('click', is.toUpperCase());
        });

        it('should add a delegated listener', () => {
            const callback = spy();

            let TestElement = class TestElement extends DNA.Component {
                method(event, target) {
                    callback(event.type, target.tagName);
                }

                render() {
                    return DNA.compile('<button></button>');
                }
            };

            __decorate([
                DNA.listen('click', 'button'),
            ], TestElement.prototype, 'method', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            element.querySelector('button').click();
            expect(callback).to.have.been.called.with('click', 'BUTTON');
            expect(callback).to.have.been.called();
        });

        it('should inherit listeners', () => {
            const callback1 = spy();
            const callback2 = spy();
            const callback3 = spy();
            const callback4 = spy();

            let BaseElement = class BaseElement extends DNA.Component {
                callback1(event, target) {
                    callback1(event, target);
                }

                callback2(event, target) {
                    callback2(event, target);
                }

                render() {
                    return DNA.compile('<button></button>');
                }
            };

            let TestElement1 = class TestElement1 extends BaseElement {
                callback3(event, target) {
                    callback3(event, target);
                }

                callback4(event, target) {
                    callback4(event, target);
                }
            };

            let TestElement2 = class TestElement2 extends BaseElement { };

            __decorate([
                DNA.listen('click', 'button'),
            ], BaseElement.prototype, 'callback1', undefined);
            __decorate([
                DNA.listen('change'),
            ], BaseElement.prototype, 'callback2', undefined);
            BaseElement = __decorate([
                DNA.customElement(getComponentName()),
            ], BaseElement);

            __decorate([
                DNA.listen('click', 'button'),
            ], TestElement1.prototype, 'callback3', undefined);
            __decorate([
                DNA.listen('drop'),
            ], TestElement1.prototype, 'callback4', undefined);
            TestElement1 = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement1);

            TestElement2 = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement2);

            const element1 = new TestElement1();
            DNA.DOM.appendChild(wrapper, element1);
            expect(callback1).to.not.have.been.called();
            expect(callback2).to.not.have.been.called();
            expect(callback3).to.not.have.been.called();
            element1.querySelector('button').click();
            element1.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1).to.have.been.called();
            expect(callback2).to.have.been.called();
            expect(callback3).to.have.been.called();

            const element2 = new TestElement2();
            DNA.DOM.appendChild(wrapper, element2);
            element2.querySelector('button').click();
            element2.dispatchEvent(DNA.DOM.createEvent('drop', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1).to.have.been.called.twice;
            expect(callback2).to.have.been.called.once;
            expect(callback3).to.have.been.called.once;
            expect(callback4).to.not.have.been.called();
        });
    });

    describe('listener decorator (babel)', () => {
        it('should add a listener', () => {
            const callback = spy();

            const is = getComponentName();
            const TestElement = _decorate([DNA.customElement(is)], (_initialize, _DNA$Component) => {
                class TestElement extends _DNA$Component {
                    constructor(...args) {
                        super(...args);

                        _initialize(this);
                    }

                }

                return {
                    F: TestElement,
                    d: [{
                        kind: 'method',
                        decorators: [DNA.listen('click')],
                        key: 'method',
                        value: function method(event, target) {
                            callback(event.type, target.tagName);
                        },
                    }],
                };
            }, DNA.Component);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            element.click();
            expect(callback).to.have.been.called();
            expect(callback).to.have.been.called.with('click', is.toUpperCase());
        });

        it('should add a delegated listener', () => {
            const callback = spy();

            const TestElement = _decorate([DNA.customElement(getComponentName())], (_initialize, _DNA$Component) => {
                class TestElement extends _DNA$Component {
                    constructor(...args) {
                        super(...args);

                        _initialize(this);
                    }

                }

                return {
                    F: TestElement,
                    d: [{
                        kind: 'method',
                        decorators: [DNA.listen('click', 'button')],
                        key: 'method',
                        value: function method(event, target) {
                            callback(event.type, target.tagName);
                        },
                    }, {
                        kind: 'method',
                        key: 'render',
                        value: function render() {
                            return DNA.compile('<button></button>');
                        },
                    }],
                };
            }, DNA.Component);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            element.querySelector('button').click();
            expect(callback).to.have.been.called();
            expect(callback).to.have.been.called.with('click', 'BUTTON');
        });

        it('should inherit listeners', () => {
            const callback1 = spy();
            const callback2 = spy();
            const callback3 = spy();
            const callback4 = spy();

            const BaseElement = _decorate([DNA.customElement(getComponentName())], (_initialize, _DNA$Component) => {
                class BaseElement extends _DNA$Component {
                    constructor(...args) {
                        super(...args);

                        _initialize(this);
                    }

                }

                return {
                    F: BaseElement,
                    d: [{
                        kind: 'method',
                        decorators: [DNA.listen('click', 'button')],
                        key: 'callback1',
                        value: callback1,
                    }, {
                        kind: 'method',
                        decorators: [DNA.listen('change')],
                        key: 'callback2',
                        value: callback2,
                    }, {
                        kind: 'method',
                        key: 'render',
                        value: function render() {
                            return DNA.compile('<button></button>');
                        },
                    }],
                };
            }, DNA.Component);

            const TestElement1 = _decorate([DNA.customElement(getComponentName())], (_initialize, _BaseElement) => {
                class TestElement1 extends _BaseElement {
                    constructor(...args) {
                        super(...args);

                        _initialize(this);
                    }

                }

                return {
                    F: TestElement1,
                    d: [{
                        kind: 'method',
                        decorators: [DNA.listen('click', 'button')],
                        key: 'callback3',
                        value: callback3,
                    }, {
                        kind: 'method',
                        decorators: [DNA.listen('drop')],
                        key: 'callback4',
                        value: callback4,
                    }],
                };
            }, BaseElement);

            const TestElement2 = _decorate([DNA.customElement(getComponentName())], (_initialize, _BaseElement) => {
                class TestElement2 extends _BaseElement {
                    constructor(...args) {
                        super(...args);

                        _initialize(this);
                    }

                }

                return {
                    F: TestElement2,
                    d: [],
                };
            }, BaseElement);

            const element1 = new TestElement1();
            DNA.DOM.appendChild(wrapper, element1);
            expect(callback1).to.not.have.been.called();
            expect(callback2).to.not.have.been.called();
            expect(callback3).to.not.have.been.called();
            element1.querySelector('button').click();
            element1.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1).to.have.been.called();
            expect(callback2).to.have.been.called();
            expect(callback3).to.have.been.called();

            const element2 = new TestElement2();
            DNA.DOM.appendChild(wrapper, element2);
            element2.querySelector('button').click();
            element2.dispatchEvent(DNA.DOM.createEvent('drop', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1).to.have.been.called.twice;
            expect(callback2).to.have.been.called.once;
            expect(callback3).to.have.been.called.once;
            expect(callback4).to.not.have.been.called();
        });
    });

    describe('#dispatchEvent', () => {
        it('should dispatch an event', () => {
            const callback = spy();

            class TestElement extends DNA.Component {}
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            wrapper.addEventListener('click', callback);
            expect(callback).to.not.have.been.called();
            element.click();
            expect(callback).to.have.been.called();
            wrapper.removeEventListener('click', callback);
        });

        it('should create and dispatch a custom event', () => {
            const callback = spy();

            class TestElement extends DNA.Component {}
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            wrapper.addEventListener('click', callback);
            expect(callback).to.not.have.been.called();
            element.dispatchEvent('click');
            expect(callback).to.have.been.called();
            wrapper.removeEventListener('click', callback);
        });
    });

    describe('#dispatchAyncEvent', () => {
        it('should trigger an event and return a Promise', async () => {
            const is = getComponentName();
            class TestElement extends DNA.Component {
                static get listeners() {
                    return {
                        click: TestElement.prototype.method,
                    };
                }

                method(event) {
                    event.respondWith(async () => event.type);
                    event.respondWith(async () => event.target.tagName);
                }
            }
            DNA.customElements.define(is, TestElement);

            const element = new TestElement();
            const response = await element.dispatchAsyncEvent('click');
            expect(response).to.be.deep.equal(['click', is.toUpperCase()]);
        });
    });

    describe('#delegateEventListener', () => {
        it('should delegate an event', () => {
            const callback = spy();

            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<button></button>`;
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            element.delegateEventListener('click', 'button', callback);
            expect(callback).to.not.have.been.called();
            element.querySelector('button').click();
            expect(callback).to.have.been.called();
        });
    });

    describe('#undelegateEventListener', () => {
        it('should undelegate an event', () => {
            const callback = spy();

            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<button></button>`;
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            element.delegateEventListener('click', 'button', callback);
            expect(callback).to.not.have.been.called();
            element.querySelector('button').click();
            expect(callback).to.have.been.called();
            element.undelegateEventListener('click', 'button', callback);
            element.querySelector('button').click();
            expect(callback).to.have.been.called.once;
        });
    });

    describe('listener target', () => {
        it('should delegate an event to document', () => {
            const callback = spy();

            const target = DNA.window.document.body;
            class TestElement extends DNA.Component {
                static get listeners() {
                    return {
                        click: {
                            callback,
                            target,
                        },
                    };
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback).to.not.have.been.called();
            target.click();
            expect(callback).to.have.been.called();
            DNA.DOM.removeChild(wrapper, element);
            target.click();
            expect(callback).to.have.been.called.once;
        });
    });
});
