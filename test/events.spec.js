import { getModule, spyFunction, getComponentName } from './helpers.js';

let DNA;

describe('events', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

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
        it('should add delegate a listener', () => {
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

    describe('get listeners()', () => {
        it('should add a listener', () => {
            const is = getComponentName();
            const callback = spyFunction((event, target) => [event.type, target.tagName]);
            class TestElement extends DNA.Component {
                get listeners() {
                    return {
                        click: this.method,
                        change: callback,
                    };
                }

                method(event, target) {
                    callback(event, target);
                }
            }

            DNA.define(is, TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback.invoked).to.be.false;
            element.dispatchEvent(DNA.DOM.createEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
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
                get listeners() {
                    return {
                        'click button': this.method,
                        'change': callback,
                    };
                }

                method(event, target) {
                    callback(event, target);
                }

                render() {
                    return DNA.html('<button key="trigger"></button>');
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(callback.invoked).to.be.false;
            element.$.trigger.click();
            expect(callback.response).to.be.deep.equal(['click', 'BUTTON']);
            expect(callback.invoked).to.be.true;
        });
    });

    describe('#dispatchEvent', () => {
        it('should dispatch an event', () => {
            const callback = spyFunction();
            class TestElement extends DNA.Component {}

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            wrapper.addEventListener('click', callback);
            expect(callback.invoked).to.be.false;
            element.dispatchEvent(DNA.DOM.createEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: false,
            }));
            expect(callback.invoked).to.be.true;
            wrapper.removeEventListener('click', callback);
        });

        it('should create and dispatch a custom event', () => {
            const callback = spyFunction();
            class TestElement extends DNA.Component {}

            DNA.define(getComponentName(), TestElement);

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
                get listeners() {
                    return {
                        click: this.method,
                    };
                }

                method(event) {
                    event.respondWith(async () => event.type);
                    event.respondWith(async () => event.target.tagName);
                }
            }

            DNA.define(is, TestElement);

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
                    return DNA.html`<button key="trigger"></button>`;
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            element.delegateEventListener('click', 'button', callback);
            expect(callback.invoked).to.be.false;
            element.$.trigger.click();
            expect(callback.invoked).to.be.true;
        });
    });

    describe('#undelegateEventListener', () => {
        it('should undelegate an event', () => {
            const callback = spyFunction();
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<button key="trigger"></button>`;
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            element.delegateEventListener('click', 'button', callback);
            expect(callback.invoked).to.be.false;
            element.$.trigger.click();
            expect(callback.invoked).to.be.true;
            element.undelegateEventListener('click', 'button', callback);
            element.$.trigger.click();
            expect(callback.count).to.be.equal(1);
        });
    });
});
