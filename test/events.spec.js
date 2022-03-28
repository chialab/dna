// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import _decorate from '@babel/runtime/helpers/decorate';
import { expect } from '@esm-bundle/chai/esm/chai.js';
import { spyFunction, getComponentName } from './helpers.spec.js';

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
            const listener = spyFunction();
            wrapper.addEventListener('click', listener);
            DNA.dispatchEvent(wrapper, 'click');
            expect(listener.invoked).to.be.true;
        });

        it('should dispatch custom events with details', () => {
            const details = {};
            const listener = spyFunction((event) => event.detail);
            wrapper.addEventListener('click', listener);
            DNA.dispatchEvent(wrapper, 'click', details);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.equal(details);
        });

        it('should dispatch custom events that does bubble', () => {
            const details = {};
            const listener = spyFunction((event) => event.bubbles);
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', listener);
            DNA.dispatchEvent(child, 'click', details, true);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.true;
        });

        it('should dispatch custom events that is canceleable', () => {
            const details = {};
            const listener = spyFunction((event) => event.cancelable);
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', listener);
            DNA.dispatchEvent(child, 'click', details, true, true);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.true;
        });

        it('should dispatch custom events that does not bubble', () => {
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener1 = spyFunction((event) => event.bubbles);
            const listener2 = spyFunction((event) => event.bubbles);
            wrapper.addEventListener('click', listener1);
            button.addEventListener('click', listener2);
            DNA.dispatchEvent(button, 'click', null, false);
            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.true;
            expect(listener2.response).to.be.false;
        });

        it('should dispatch custom events that is not canceleable', () => {
            const details = {};
            const listener = spyFunction((event) => event.cancelable);
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', listener);
            DNA.dispatchEvent(child, 'click', details, true, false);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.false;
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
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener = spyFunction();
            DNA.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.delegateEventListener(wrapper, 'mouseenter', 'button', listener);
            button.click();
            DNA.dispatchEvent(button, 'mouseenter');

            expect(listener.invoked).to.be.true;
            expect(listener.count).to.be.equal(2);
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
            const child = DNA.DOM.createElement('div');
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(child);
            child.appendChild(button);
            const listener1 = spyFunction();
            const listener2 = spyFunction((event) => {
                event.stopPropagation();
            });
            const listener3 = spyFunction();
            const listener4 = spyFunction();
            DNA.delegateEventListener(child, 'click', 'div', listener1);
            DNA.delegateEventListener(child, 'click', 'button', listener2);
            DNA.delegateEventListener(child, 'click', 'button', listener3);
            DNA.delegateEventListener(child, 'click', null, listener4);
            button.click();

            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.true;
            expect(listener3.invoked).to.be.true;
            expect(listener4.invoked).to.be.false;
        });

        it('should immediately stop propagation', () => {
            const child = DNA.DOM.createElement('div');
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(child);
            child.appendChild(button);
            const listener1 = spyFunction();
            const listener2 = spyFunction((event) => {
                event.stopImmediatePropagation();
            });
            const listener3 = spyFunction();
            const listener4 = spyFunction();
            DNA.delegateEventListener(child, 'click', 'div', listener1);
            DNA.delegateEventListener(child, 'click', 'button', listener2);
            DNA.delegateEventListener(child, 'click', 'button', listener3);
            DNA.delegateEventListener(child, 'click', null, listener4);
            button.click();

            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.true;
            expect(listener3.invoked).to.be.false;
            expect(listener4.invoked).to.be.false;
        });
    });

    describe('undelegateEventListener', () => {
        it('should remove a delegated event listener', () => {
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener = spyFunction();
            const listener2 = spyFunction();
            DNA.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.delegateEventListener(wrapper, 'click', 'button', listener2);
            button.click();
            DNA.undelegateEventListener(wrapper, 'click', 'button', listener2);
            button.click();

            expect(listener.count).to.be.equal(2);
            expect(listener2.count).to.be.equal(1);
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
            const is = getComponentName();
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
            class TestElement extends DNA.Component {
                static get listeners() {
                    return {
                        click: TestElement.prototype.method,
                        change: callback,
                    };
                }

                method(event, target) {
                    callback(event, target);
                }
            }

            DNA.customElements.define(is, TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback.invoked).to.be.false;
            element.click();
            expect(callback.invoked).to.be.true;
            expect(callback.response).to.be.deep.equal(['click', is.toUpperCase()]);
            element.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback.response).to.be.deep.equal(['change', is.toUpperCase()]);
            expect(callback.count).to.be.equal(2);
        });

        it('should add a delegated listener', () => {
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
            class TestElement extends DNA.Component {
                static get listeners() {
                    return {
                        'click button': TestElement.prototype.method,
                    };
                }

                method(event, target) {
                    callback(event, target);
                }

                render() {
                    return DNA.compile('<button></button>');
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback.invoked).to.be.false;
            element.querySelector('button').click();
            expect(callback.response).to.be.deep.equal(['click', 'BUTTON']);
            expect(callback.invoked).to.be.true;
        });

        it('should inherit listeners', () => {
            const callback1 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback2 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback3 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback4 = spyFunction((event, target) => [event.type, target.tagName]);

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
            expect(callback1.invoked).to.be.false;
            expect(callback2.invoked).to.be.false;
            expect(callback3.invoked).to.be.false;
            element1.querySelector('button').click();
            element1.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1.invoked).to.be.true;
            expect(callback2.invoked).to.be.true;
            expect(callback3.invoked).to.be.true;

            const element2 = new TestElement2();
            DNA.DOM.appendChild(wrapper, element2);
            element2.querySelector('button').click();
            element2.dispatchEvent(DNA.DOM.createEvent('drop', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1.count).to.be.equal(2);
            expect(callback2.count).to.be.equal(1);
            expect(callback3.count).to.be.equal(1);
            expect(callback4.invoked).to.be.false;
        });
    });

    describe('listener decorator', () => {
        it('should add a listener', () => {
            const is = getComponentName();
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
            let TestElement = class TestElement extends DNA.Component {
                method(event, target) {
                    callback(event, target);
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
            expect(callback.invoked).to.be.false;
            element.click();
            expect(callback.invoked).to.be.true;
            expect(callback.response).to.be.deep.equal(['click', is.toUpperCase()]);
        });

        it('should add a delegated listener', () => {
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
            let TestElement = class TestElement extends DNA.Component {
                method(event, target) {
                    callback(event, target);
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
            expect(callback.invoked).to.be.false;
            element.querySelector('button').click();
            expect(callback.response).to.be.deep.equal(['click', 'BUTTON']);
            expect(callback.invoked).to.be.true;
        });

        it('should inherit listeners', () => {
            const callback1 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback2 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback3 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback4 = spyFunction((event, target) => [event.type, target.tagName]);

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
            expect(callback1.invoked).to.be.false;
            expect(callback2.invoked).to.be.false;
            expect(callback3.invoked).to.be.false;
            element1.querySelector('button').click();
            element1.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1.invoked).to.be.true;
            expect(callback2.invoked).to.be.true;
            expect(callback3.invoked).to.be.true;

            const element2 = new TestElement2();
            DNA.DOM.appendChild(wrapper, element2);
            element2.querySelector('button').click();
            element2.dispatchEvent(DNA.DOM.createEvent('drop', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1.count).to.be.equal(2);
            expect(callback2.count).to.be.equal(1);
            expect(callback3.count).to.be.equal(1);
            expect(callback4.invoked).to.be.false;
        });
    });

    describe('listener decorator (babel)', () => {
        it('should add a listener', () => {
            const is = getComponentName();
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
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
                            callback(event, target);
                        },
                    }],
                };
            }, DNA.Component);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback.invoked).to.be.false;
            element.click();
            expect(callback.invoked).to.be.true;
            expect(callback.response).to.be.deep.equal(['click', is.toUpperCase()]);
        });

        it('should add a delegated listener', () => {
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
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
                            callback(event, target);
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
            expect(callback.invoked).to.be.false;
            element.querySelector('button').click();
            expect(callback.response).to.be.deep.equal(['click', 'BUTTON']);
            expect(callback.invoked).to.be.true;
        });

        it('should inherit listeners', () => {
            const callback1 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback2 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback3 = spyFunction((event, target) => [event.type, target.tagName]);
            const callback4 = spyFunction((event, target) => [event.type, target.tagName]);

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
            expect(callback1.invoked).to.be.false;
            expect(callback2.invoked).to.be.false;
            expect(callback3.invoked).to.be.false;
            element1.querySelector('button').click();
            element1.dispatchEvent(DNA.DOM.createEvent('change', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1.invoked).to.be.true;
            expect(callback2.invoked).to.be.true;
            expect(callback3.invoked).to.be.true;

            const element2 = new TestElement2();
            DNA.DOM.appendChild(wrapper, element2);
            element2.querySelector('button').click();
            element2.dispatchEvent(DNA.DOM.createEvent('drop', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback1.count).to.be.equal(2);
            expect(callback2.count).to.be.equal(1);
            expect(callback3.count).to.be.equal(1);
            expect(callback4.invoked).to.be.false;
        });
    });

    describe('#dispatchEvent', () => {
        it('should dispatch an event', () => {
            const callback = spyFunction();
            class TestElement extends DNA.Component {}

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            wrapper.addEventListener('click', callback);
            expect(callback.invoked).to.be.false;
            element.click();
            expect(callback.invoked).to.be.true;
            wrapper.removeEventListener('click', callback);
        });

        it('should create and dispatch a custom event', () => {
            const callback = spyFunction();
            class TestElement extends DNA.Component {}

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            wrapper.addEventListener('click', callback);
            expect(callback.invoked).to.be.false;
            element.dispatchEvent('click');
            expect(callback.invoked).to.be.true;
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
            const callback = spyFunction();
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<button></button>`;
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            element.delegateEventListener('click', 'button', callback);
            expect(callback.invoked).to.be.false;
            element.querySelector('button').click();
            expect(callback.invoked).to.be.true;
        });
    });

    describe('#undelegateEventListener', () => {
        it('should undelegate an event', () => {
            const callback = spyFunction();
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<button></button>`;
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            element.delegateEventListener('click', 'button', callback);
            expect(callback.invoked).to.be.false;
            element.querySelector('button').click();
            expect(callback.invoked).to.be.true;
            element.undelegateEventListener('click', 'button', callback);
            element.querySelector('button').click();
            expect(callback.count).to.be.equal(1);
        });
    });

    describe('listener target', () => {
        it('should delegate an event to document', () => {
            const target = DNA.window.document.body;
            const callback = spyFunction();
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
            expect(callback.invoked).to.be.false;
            target.click();
            expect(callback.invoked).to.be.true;
            DNA.DOM.removeChild(wrapper, element);
            target.click();
            expect(callback.count).to.be.equal(1);
        });
    });
});
