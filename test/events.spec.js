import _decorate from '@babel/runtime/helpers/decorate';
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IS_BROWSER, getComponentName } from './helpers';

describe.runIf(IS_BROWSER)(
    'events',
    () => {
        let wrapper;
        beforeEach(() => {
            wrapper = document.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);
        });

        afterEach(() => {
            if (wrapper.parentNode) {
                wrapper.ownerDocument.body.removeChild(wrapper);
            }
        });

        describe('dispatchEvent', () => {
            it('should dispatch custom events', () => {
                const listener = vi.fn();
                wrapper.addEventListener('click', listener);
                DNA.dispatchEvent(wrapper, 'click');
                expect(listener).toHaveBeenCalled();
            });

            it('should dispatch custom events with details', () => {
                const listener = vi.fn();
                const details = {};
                wrapper.addEventListener('click', (event) => listener(event.detail));
                DNA.dispatchEvent(wrapper, 'click', details);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(details);
            });

            it('should dispatch custom events that does bubble', () => {
                const listener = vi.fn();
                const details = {};
                const child = document.createElement('button');
                wrapper.appendChild(child);
                wrapper.addEventListener('click', (event) => listener(event.bubbles));
                DNA.dispatchEvent(child, 'click', details, true);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(true);
            });

            it('should dispatch custom events that is canceleable', () => {
                const listener = vi.fn();

                const details = {};
                const child = document.createElement('button');
                wrapper.appendChild(child);
                wrapper.addEventListener('click', (event) => listener(event.cancelable));
                DNA.dispatchEvent(child, 'click', details, true, true);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(true);
            });

            it('should dispatch custom events that does not bubble', () => {
                const listener1 = vi.fn();
                const listener2 = vi.fn();

                const button = document.createElement('button');
                wrapper.appendChild(button);

                wrapper.addEventListener('click', (event) => listener1(event.bubbles));
                button.addEventListener('click', (event) => listener2(event.bubbles));
                DNA.dispatchEvent(button, 'click', null, false);

                expect(listener1).not.toHaveBeenCalled();
                expect(listener2).toHaveBeenCalled();
                expect(listener2).toHaveBeenCalledWith(false);
            });

            it('should dispatch custom events that is not canceleable', () => {
                const listener = vi.fn();

                const details = {};
                const child = document.createElement('button');
                wrapper.appendChild(child);
                wrapper.addEventListener('click', (event) => listener(event.cancelable));
                DNA.dispatchEvent(child, 'click', details, true, false);

                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(false);
            });

            it('should validate dispatch input', () => {
                expect(() => {
                    DNA.dispatchEvent(null);
                }).toThrow(TypeError, 'The provided element must be a Node');

                expect(() => {
                    DNA.dispatchEvent(wrapper, null);
                }).toThrow(TypeError, 'The provided object must be an Event');

                expect(() => {
                    DNA.dispatchEvent(wrapper, 'click', null, null, null, null);
                }).toThrow(TypeError);

                expect(() => {
                    DNA.dispatchEvent(wrapper, 'click', null, true, null, null);
                }).toThrow(TypeError);

                expect(() => {
                    DNA.dispatchEvent(wrapper, 'click', null, true, true, null);
                }).toThrow(TypeError);
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
                expect(response).toStrictEqual(['click', 'DIV']);
            });
        });

        describe('delegateEventListener', () => {
            it('should delegate a listener', () => {
                const listener = vi.fn((event) => {
                    event.preventDefault();
                });

                const button = document.createElement('button');
                wrapper.appendChild(button);
                DNA.delegateEventListener(wrapper, 'click', 'button', listener);
                DNA.delegateEventListener(wrapper, 'mouseenter', 'button', listener);
                button.click();
                DNA.dispatchEvent(button, 'mouseenter');

                expect(listener).toHaveBeenCalledTimes(2);
            });

            it('should validate delegation input', () => {
                expect(() => {
                    DNA.delegateEventListener(false, false, false, false);
                }).toThrow(TypeError, 'The provided element must be a Node');

                expect(() => {
                    DNA.delegateEventListener(wrapper, false, false, false);
                }).toThrow(TypeError, 'The provided event name must be a string');

                expect(() => {
                    DNA.delegateEventListener(wrapper, 'click', false, false);
                }).toThrow(TypeError, 'The provided selector must be a string');

                expect(() => {
                    DNA.delegateEventListener(wrapper, 'click', 'button', false);
                }).toThrow(TypeError, 'The provided callback must be a function');
            });

            it('should stop propagation', () => {
                const listener1 = vi.fn((event) => {
                    event.preventDefault();
                });
                const listener2 = vi.fn((event) => {
                    event.stopPropagation();
                    event.preventDefault();
                });
                const listener3 = vi.fn((event) => {
                    event.preventDefault();
                });
                const listener4 = vi.fn((event) => {
                    event.preventDefault();
                });

                const child = document.createElement('div');
                const button = document.createElement('button');
                wrapper.appendChild(child);
                child.appendChild(button);
                DNA.delegateEventListener(child, 'click', 'div', listener1);
                DNA.delegateEventListener(child, 'click', 'button', listener2);
                DNA.delegateEventListener(child, 'click', 'button', listener3);
                DNA.delegateEventListener(child, 'click', null, listener4);
                button.click();

                expect(listener1).not.toHaveBeenCalled();
                expect(listener2).toHaveBeenCalled();
                expect(listener3).toHaveBeenCalled();
                expect(listener4).not.toHaveBeenCalled();
            });

            it('should immediately stop propagation', () => {
                const listener1 = vi.fn((event) => {
                    event.preventDefault();
                });
                const listener2 = vi.fn((event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                });
                const listener3 = vi.fn((event) => {
                    event.preventDefault();
                });
                const listener4 = vi.fn((event) => {
                    event.preventDefault();
                });

                const child = document.createElement('div');
                const button = document.createElement('button');
                wrapper.appendChild(child);
                child.appendChild(button);
                DNA.delegateEventListener(child, 'click', 'div', listener1);
                DNA.delegateEventListener(child, 'click', 'button', listener2);
                DNA.delegateEventListener(child, 'click', 'button', listener3);
                DNA.delegateEventListener(child, 'click', null, listener4);
                button.click();

                expect(listener1).not.toHaveBeenCalled();
                expect(listener2).toHaveBeenCalled();
                expect(listener3).not.toHaveBeenCalled();
                expect(listener4).not.toHaveBeenCalled();
            });
        });

        describe('undelegateEventListener', () => {
            it('should remove a delegated event listener', () => {
                const listener = vi.fn((event) => {
                    event.preventDefault();
                });
                const listener2 = vi.fn((event) => {
                    event.preventDefault();
                });

                const button = document.createElement('button');
                wrapper.appendChild(button);
                DNA.delegateEventListener(wrapper, 'click', 'button', listener);
                DNA.delegateEventListener(wrapper, 'click', 'button', listener2);
                button.click();
                DNA.undelegateEventListener(wrapper, 'click', 'button', listener2);
                button.click();

                expect(listener).toHaveBeenCalledTimes(2);
                expect(listener2).toHaveBeenCalledOnce();
            });

            it('should do nothing if there are no delegations', () => {
                const button = document.createElement('button');
                expect(() => {
                    DNA.undelegateEventListener(button, 'click', null, (event) => {
                        event.preventDefault();
                    });
                }).not.toThrow();
            });

            it('should do nothing if there are no delegations for an event', () => {
                const button = document.createElement('button');
                DNA.delegateEventListener(button, 'click', null, (event) => {
                    event.preventDefault();
                });
                expect(() => {
                    DNA.undelegateEventListener(button, 'missing', null, () => {});
                }).not.toThrow();
            });

            it('should validate undelegateEventListener input', () => {
                expect(() => {
                    DNA.undelegateEventListener(false, false, false, false);
                }).toThrow(TypeError, 'The provided element must be a Node');

                expect(() => {
                    DNA.undelegateEventListener(wrapper, false, false, false);
                }).toThrow(TypeError, 'The provided event name must be a string');

                expect(() => {
                    DNA.undelegateEventListener(wrapper, 'click', false, false);
                }).toThrow(TypeError, 'The provided selector must be a string');

                expect(() => {
                    DNA.undelegateEventListener(wrapper, 'click', 'button', false);
                }).toThrow(TypeError, 'The provided callback must be a function');
            });

            it('should delegate listeners to slotted contents', () => {
                const callback = vi.fn();
                const is = getComponentName();
                const TestElement = DNA.define(
                    is,
                    class extends DNA.Component {
                        static get listeners() {
                            return {
                                'click .button_wrapper': this.prototype.method,
                            };
                        }

                        render() {
                            return DNA.html`<div class="button_wrapper"><slot /></div>`;
                        }

                        method(event, target) {
                            event.preventDefault();
                            callback(event.type, target.tagName);
                        }
                    }
                );

                const element = new TestElement();
                wrapper.appendChild(element);

                const button = document.createElement('button');
                element.appendChild(button);

                expect(callback).not.toHaveBeenCalled();
                button.click();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith('click', 'DIV');
            });
        });

        describe('listeners getter', () => {
            it('should add a listener', () => {
                const callback = vi.fn();
                const is = getComponentName();
                const TestElement = DNA.define(
                    is,
                    class extends DNA.Component {
                        static get listeners() {
                            return {
                                click: this.prototype.method,
                                change: (event, target) => callback(event.type, target.tagName),
                            };
                        }

                        method(event, target) {
                            event.preventDefault();
                            callback(event.type, target.tagName);
                        }
                    }
                );
                const element = new TestElement();
                wrapper.appendChild(element);

                expect(callback).not.toHaveBeenCalled();
                element.click();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith('click', is.toUpperCase());
                element.dispatchEvent('change', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback).toHaveBeenCalledWith('change', is.toUpperCase());
                expect(callback).toHaveBeenCalledTimes(2);
            });

            it('should add a delegated listener', () => {
                const callback = vi.fn();
                const TestElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get listeners() {
                            return {
                                'click button': (event, target) => {
                                    event.preventDefault();
                                    callback(event.type, target.tagName);
                                },
                            };
                        }

                        render() {
                            return DNA.compile('<button></button>');
                        }
                    }
                );

                const element = new TestElement();
                wrapper.appendChild(element);
                expect(callback).not.toHaveBeenCalled();
                element.querySelector('button').click();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith('click', 'BUTTON');
            });

            it('should inherit listeners', () => {
                const callback1 = vi.fn((event) => {
                    event.preventDefault();
                });
                const callback2 = vi.fn();
                const callback3 = vi.fn((event) => {
                    event.preventDefault();
                });
                const callback4 = vi.fn();
                const BaseElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get listeners() {
                            return {
                                'click button': callback1,
                                change: callback2,
                            };
                        }

                        render() {
                            return DNA.compile('<button></button>');
                        }
                    }
                );
                const TestElement1 = DNA.define(
                    getComponentName(),
                    class extends BaseElement {
                        static get listeners() {
                            return {
                                'click button': callback3,
                                drop: callback4,
                            };
                        }
                    }
                );
                const TestElement2 = DNA.define(
                    getComponentName(),
                    class extends BaseElement {
                        static get listeners() {
                            return {};
                        }
                    }
                );

                const element1 = new TestElement1();
                wrapper.appendChild(element1);
                expect(callback1).not.toHaveBeenCalled();
                expect(callback2).not.toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
                element1.querySelector('button').click();
                element1.dispatchEvent('change', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback1).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();

                const element2 = new TestElement2();
                wrapper.appendChild(element2);
                element2.querySelector('button').click();
                element2.dispatchEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback1).toHaveBeenCalledTimes(2);
                expect(callback2).toHaveBeenCalledOnce();
                expect(callback3).toHaveBeenCalledOnce();
                expect(callback4).not.toHaveBeenCalled();
            });
        });

        describe('listener decorator', () => {
            it('should add a listener', () => {
                const callback = vi.fn();

                const is = getComponentName();
                let TestElement = class TestElement extends DNA.Component {
                    method(event, target) {
                        event.preventDefault();
                        callback(event.type, target.tagName);
                    }
                };

                __decorate([DNA.listen('click')], TestElement.prototype, 'method', undefined);
                TestElement = __decorate([DNA.customElement(is)], TestElement);

                const element = new TestElement();
                wrapper.appendChild(element);
                expect(callback).not.toHaveBeenCalled();
                element.click();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith('click', is.toUpperCase());
            });

            it('should add a delegated listener', () => {
                const callback = vi.fn();

                let TestElement = class TestElement extends DNA.Component {
                    method(event, target) {
                        event.preventDefault();
                        callback(event.type, target.tagName);
                    }

                    render() {
                        return DNA.compile('<button></button>');
                    }
                };

                __decorate([DNA.listen('click', 'button')], TestElement.prototype, 'method', undefined);
                TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                const element = new TestElement();
                wrapper.appendChild(element);
                expect(callback).not.toHaveBeenCalled();
                element.querySelector('button').click();
                expect(callback).toHaveBeenCalledWith('click', 'BUTTON');
                expect(callback).toHaveBeenCalled();
            });

            it('should inherit listeners', () => {
                const callback1 = vi.fn();
                const callback2 = vi.fn();
                const callback3 = vi.fn();
                const callback4 = vi.fn();

                let BaseElement = class BaseElement extends DNA.Component {
                    callback1(event, target) {
                        event.preventDefault();
                        callback1(event, target);
                    }

                    callback2(event, target) {
                        event.preventDefault();
                        callback2(event, target);
                    }

                    render() {
                        return DNA.compile('<button></button>');
                    }
                };

                let TestElement1 = class TestElement1 extends BaseElement {
                    callback3(event, target) {
                        event.preventDefault();
                        callback3(event, target);
                    }

                    callback4(event, target) {
                        event.preventDefault();
                        callback4(event, target);
                    }
                };

                let TestElement2 = class TestElement2 extends BaseElement {};

                __decorate([DNA.listen('click', 'button')], BaseElement.prototype, 'callback1', undefined);
                __decorate([DNA.listen('change')], BaseElement.prototype, 'callback2', undefined);
                BaseElement = __decorate([DNA.customElement(getComponentName())], BaseElement);

                __decorate([DNA.listen('click', 'button')], TestElement1.prototype, 'callback3', undefined);
                __decorate([DNA.listen('drop')], TestElement1.prototype, 'callback4', undefined);
                TestElement1 = __decorate([DNA.customElement(getComponentName())], TestElement1);

                TestElement2 = __decorate([DNA.customElement(getComponentName())], TestElement2);

                const element1 = new TestElement1();
                wrapper.appendChild(element1);
                expect(callback1).not.toHaveBeenCalled();
                expect(callback2).not.toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
                element1.querySelector('button').click();
                element1.dispatchEvent('change', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback1).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();

                const element2 = new TestElement2();
                wrapper.appendChild(element2);
                element2.querySelector('button').click();
                element2.dispatchEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback1).toHaveBeenCalledTimes(2);
                expect(callback2).toHaveBeenCalledOnce();
                expect(callback3).toHaveBeenCalledOnce();
                expect(callback4).not.toHaveBeenCalled();
            });
        });

        describe('listener decorator (babel)', () => {
            it('should add a listener', () => {
                const callback = vi.fn();

                const is = getComponentName();
                const TestElement = _decorate(
                    [DNA.customElement(is)],
                    (_initialize, _DNA$Component) => {
                        class TestElement extends _DNA$Component {
                            constructor(...args) {
                                super(...args);

                                _initialize(this);
                            }
                        }

                        return {
                            F: TestElement,
                            d: [
                                {
                                    kind: 'method',
                                    decorators: [DNA.listen('click')],
                                    key: 'method',
                                    value: function method(event, target) {
                                        event.preventDefault();
                                        callback(event.type, target.tagName);
                                    },
                                },
                            ],
                        };
                    },
                    DNA.Component
                );

                const element = new TestElement();
                wrapper.appendChild(element);
                expect(callback).not.toHaveBeenCalled();
                element.click();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith('click', is.toUpperCase());
            });

            it('should add a delegated listener', () => {
                const callback = vi.fn();

                const TestElement = _decorate(
                    [DNA.customElement(getComponentName())],
                    (_initialize, _DNA$Component) => {
                        class TestElement extends _DNA$Component {
                            constructor(...args) {
                                super(...args);

                                _initialize(this);
                            }
                        }

                        return {
                            F: TestElement,
                            d: [
                                {
                                    kind: 'method',
                                    decorators: [DNA.listen('click', 'button')],
                                    key: 'method',
                                    value: function method(event, target) {
                                        event.preventDefault();
                                        callback(event.type, target.tagName);
                                    },
                                },
                                {
                                    kind: 'method',
                                    key: 'render',
                                    value: function render() {
                                        return DNA.compile('<button></button>');
                                    },
                                },
                            ],
                        };
                    },
                    DNA.Component
                );

                const element = new TestElement();
                wrapper.appendChild(element);
                expect(callback).not.toHaveBeenCalled();
                element.querySelector('button').click();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith('click', 'BUTTON');
            });

            it('should inherit listeners', () => {
                const callback1 = vi.fn((event) => {
                    event.preventDefault();
                });
                const callback2 = vi.fn();
                const callback3 = vi.fn((event) => {
                    event.preventDefault();
                });
                const callback4 = vi.fn();

                const BaseElement = _decorate(
                    [DNA.customElement(getComponentName())],
                    (_initialize, _DNA$Component) => {
                        class BaseElement extends _DNA$Component {
                            constructor(...args) {
                                super(...args);

                                _initialize(this);
                            }
                        }

                        return {
                            F: BaseElement,
                            d: [
                                {
                                    kind: 'method',
                                    decorators: [DNA.listen('click', 'button')],
                                    key: 'callback1',
                                    value: callback1,
                                },
                                {
                                    kind: 'method',
                                    decorators: [DNA.listen('change')],
                                    key: 'callback2',
                                    value: callback2,
                                },
                                {
                                    kind: 'method',
                                    key: 'render',
                                    value: function render() {
                                        return DNA.compile('<button></button>');
                                    },
                                },
                            ],
                        };
                    },
                    DNA.Component
                );

                const TestElement1 = _decorate(
                    [DNA.customElement(getComponentName())],
                    (_initialize, _BaseElement) => {
                        class TestElement1 extends _BaseElement {
                            constructor(...args) {
                                super(...args);

                                _initialize(this);
                            }
                        }

                        return {
                            F: TestElement1,
                            d: [
                                {
                                    kind: 'method',
                                    decorators: [DNA.listen('click', 'button')],
                                    key: 'callback3',
                                    value: callback3,
                                },
                                {
                                    kind: 'method',
                                    decorators: [DNA.listen('drop')],
                                    key: 'callback4',
                                    value: callback4,
                                },
                            ],
                        };
                    },
                    BaseElement
                );

                const TestElement2 = _decorate(
                    [DNA.customElement(getComponentName())],
                    (_initialize, _BaseElement) => {
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
                    },
                    BaseElement
                );

                const element1 = new TestElement1();
                wrapper.appendChild(element1);
                expect(callback1).not.toHaveBeenCalled();
                expect(callback2).not.toHaveBeenCalled();
                expect(callback3).not.toHaveBeenCalled();
                element1.querySelector('button').click();
                element1.dispatchEvent('change', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback1).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();

                const element2 = new TestElement2();
                wrapper.appendChild(element2);
                element2.querySelector('button').click();
                element2.dispatchEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    composed: false,
                });
                expect(callback1).toHaveBeenCalledTimes(2);
                expect(callback2).toHaveBeenCalledOnce();
                expect(callback3).toHaveBeenCalledOnce();
                expect(callback4).not.toHaveBeenCalled();
            });
        });

        describe('fires decorator', () => {
            it('should add and remove an event listener', () => {
                const callback = vi.fn((event) => event.detail);

                const is = getComponentName();
                let TestElement = class TestElement extends DNA.Component {
                    method() {
                        this.dispatchEvent('custom', 'test');
                    }
                };

                __decorate([DNA.fires('custom')], TestElement.prototype, 'oncustom', undefined);
                TestElement = __decorate([DNA.customElement(is)], TestElement);

                const element = new TestElement();
                wrapper.appendChild(element);

                element.oncustom = callback;
                expect(element.oncustom).toBeTypeOf('function');
                expect(element.oncustom).toBe(callback);
                expect(callback).not.toHaveBeenCalled();
                element.method();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveReturnedWith('test');
                element.oncustom = null;
                expect(element.oncustom).toBeNull();
                element.method();
                expect(callback).toHaveBeenCalledOnce();
            });

            it('should add a listener inferring event name', () => {
                const callback = vi.fn((event) => event.detail);

                const is = getComponentName();
                let TestElement = class TestElement extends DNA.Component {
                    method() {
                        this.dispatchEvent('custom', 'test');
                    }
                };

                __decorate([DNA.fires()], TestElement.prototype, 'oncustom', undefined);
                TestElement = __decorate([DNA.customElement(is)], TestElement);

                const element = new TestElement();
                wrapper.appendChild(element);

                element.oncustom = callback;
                expect(element.oncustom).toBeTypeOf('function');
                expect(element.oncustom).toBe(callback);
                expect(callback).not.toHaveBeenCalled();
                element.method();
                expect(callback).toHaveBeenCalled();
                expect(callback).toHaveReturnedWith('test');
            });

            it('should throw when inferring event name with malformed property key', () => {
                const is = getComponentName();
                let TestElement = class TestElement extends DNA.Component {
                    method() {
                        this.dispatchEvent('custom', 'test');
                    }
                };

                expect(() => {
                    __decorate([DNA.fires()], TestElement.prototype, 'xoncustom', undefined);
                    TestElement = __decorate([DNA.customElement(is)], TestElement);
                }).toThrow(TypeError);
            });
        });

        describe('#dispatchEvent', () => {
            it('should dispatch an event', () => {
                const callback = vi.fn((event) => {
                    event.preventDefault();
                });
                const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                const element = new TestElement();
                wrapper.appendChild(element);
                wrapper.addEventListener('click', callback);

                expect(callback).not.toHaveBeenCalled();
                element.click();
                expect(callback).toHaveBeenCalled();
                wrapper.removeEventListener('click', callback);
            });

            it('should create and dispatch a custom event', () => {
                const callback = vi.fn((event) => {
                    event.preventDefault();
                });
                const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                const element = new TestElement();
                wrapper.appendChild(element);
                wrapper.addEventListener('click', callback);

                expect(callback).not.toHaveBeenCalled();
                element.dispatchEvent('click');
                expect(callback).toHaveBeenCalled();
                wrapper.removeEventListener('click', callback);
            });
        });

        describe('#dispatchAyncEvent', () => {
            it('should trigger an event and return a Promise', async () => {
                const is = getComponentName();
                const TestElement = DNA.define(
                    is,
                    class extends DNA.Component {
                        static get listeners() {
                            return {
                                click: this.prototype.method,
                            };
                        }

                        method(event) {
                            event.preventDefault();
                            event.respondWith(async () => event.type);
                            event.respondWith(async () => event.target.tagName);
                        }
                    }
                );
                const element = new TestElement();
                const response = await element.dispatchAsyncEvent('click');

                expect(response).toStrictEqual(['click', is.toUpperCase()]);
            });
        });

        describe('#delegateEventListener', () => {
            it('should delegate an event', () => {
                const callback = vi.fn((event) => {
                    event.preventDefault();
                });
                const TestElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        render() {
                            return DNA.html`<button title="click me"></button>`;
                        }
                    }
                );
                const element = new TestElement();

                wrapper.appendChild(element);
                element.delegateEventListener('click', 'button', callback);
                expect(callback).not.toHaveBeenCalled();
                element.querySelector('button').click();
                expect(callback).toHaveBeenCalled();
            });
        });

        describe('#undelegateEventListener', () => {
            it('should undelegate an event', () => {
                const callback = vi.fn((event) => {
                    event.preventDefault();
                });
                const TestElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        render() {
                            return DNA.html`<button title="click me"></button>`;
                        }
                    }
                );
                const element = new TestElement();
                wrapper.appendChild(element);
                element.delegateEventListener('click', 'button', callback);

                expect(callback).not.toHaveBeenCalled();
                element.querySelector('button').click();
                expect(callback).toHaveBeenCalled();
                element.undelegateEventListener('click', 'button', callback);
                element.querySelector('button').click();
                expect(callback).toHaveBeenCalledOnce();
            });
        });
    },
    10 * 1000
);
