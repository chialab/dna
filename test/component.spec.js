import _decorate from '@babel/runtime/helpers/decorate';
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getComponentName } from './helpers.js';

describe(
    'Component',
    () => {
        describe.runIf(typeof window !== 'undefined')('browser', () => {
            let wrapper;
            beforeEach(() => {
                wrapper = document.createElement('div');
                document.body.appendChild(wrapper);
            });

            afterEach(() => {
                if (wrapper.parentNode) {
                    document.body.removeChild(wrapper);
                }
            });

            describe('#new', () => {
                it('should create a node', () => {
                    const is = getComponentName();
                    const TestElement = DNA.define(is, class extends DNA.Component {});
                    const element = new TestElement();

                    expect(element).toBeInstanceOf(window.HTMLElement);
                    expect(element.is).toBe(is);
                    expect(element.tagName).toBe(is.toUpperCase());
                });

                it('should extend a native node', () => {
                    const is = getComponentName();
                    const TestElement = DNA.define(is, class extends DNA.Component {}, {
                        extends: 'article',
                    });
                    const element = new TestElement();

                    expect(element).toBeInstanceOf(window.HTMLElement);
                    expect(element.is).toBe(is);
                    expect(element.tagName).toBe('ARTICLE');
                });

                it('should create a base class starting from the anchor base class', () => {
                    const TestElement = DNA.define(getComponentName(), class extends DNA.HTML.Anchor {}, {
                        extends: 'a',
                    });
                    const element = new TestElement();
                    element.href = 'https://www.webcomponents.org/introduction';

                    expect(TestElement).not.toBe(HTMLAnchorElement);
                    expect(element).toBeInstanceOf(HTMLAnchorElement);
                    expect('href' in element).toBe(true);
                });

                it('should throw if element is not defined', () => {
                    class TestElement extends DNA.Component {}
                    expect(() => new TestElement()).toThrow(TypeError);
                });

                it('should setup properties', () => {
                    let TestElement = class extends DNA.Component {
                        static get properties() {
                            return {
                                myCustomProp1: {
                                    attribute: 'custom-prop',
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.myCustomProp2 = '';
                            this.myCustomProp3 = '';
                        }
                    };

                    __decorate([DNA.property()], TestElement.prototype, 'myCustomProp2', undefined);
                    __decorate([DNA.property()], TestElement.prototype, 'myCustomProp3', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    expect(element).toHaveProperty('myCustomProp1');
                    expect(element).toHaveProperty('myCustomProp2');
                    expect(element).toHaveProperty('myCustomProp3');
                    expect(element).not.toHaveProperty('myCustomProp4');
                });

                it('should setup properties with babel decorator', () => {
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
                                        kind: 'get',
                                        static: true,
                                        key: 'properties',
                                        value: function properties() {
                                            return {
                                                myCustomProp1: {
                                                    attribute: 'custom-prop',
                                                },
                                            };
                                        },
                                    },
                                    {
                                        kind: 'field',
                                        decorators: [DNA.property()],
                                        key: 'myCustomProp2',
                                        value() {
                                            return '';
                                        },
                                    },
                                    {
                                        kind: 'field',
                                        decorators: [DNA.property()],
                                        key: 'myCustomProp3',
                                        value() {
                                            return '';
                                        },
                                    },
                                ],
                            };
                        },
                        DNA.Component
                    );

                    const element = new TestElement();
                    expect(element).toHaveProperty('myCustomProp1');
                    expect(element).toHaveProperty('myCustomProp2');
                    expect(element).toHaveProperty('myCustomProp3');
                    expect(element).not.toHaveProperty('myCustomProp4');
                });

                it('should setup properties for extended elements', () => {
                    const _forceUpdate = vi.fn();
                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                myCustomProp1: {
                                    attribute: 'custom-prop',
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.myCustomProp2 = '';
                            this.myCustomProp3 = '';
                        }

                        render() {
                            return this.myCustomProp1;
                        }

                        forceUpdate() {
                            _forceUpdate();
                            super.forceUpdate();
                        }
                    };

                    __decorate([DNA.property()], TestElement.prototype, 'myCustomProp2', undefined);
                    __decorate([DNA.property()], TestElement.prototype, 'myCustomProp3', undefined);
                    TestElement = __decorate(
                        [DNA.customElement(getComponentName(), { extends: 'article' })],
                        TestElement
                    );

                    const element = new TestElement();
                    expect(element).toHaveProperty('myCustomProp1');
                    expect(element).toHaveProperty('myCustomProp2');
                    expect(element).toHaveProperty('myCustomProp3');
                    expect(element).not.toHaveProperty('myCustomProp4');
                    expect(_forceUpdate).not.toHaveBeenCalled();

                    element.myCustomProp1 = 'Hello';
                    element.forceUpdate();
                    expect(element.textContent).toBe('Hello');
                });

                it('should setup properties for extended components (ts over ts)', () => {
                    let BaseElement = class BaseElement extends DNA.Component {
                        static get properties() {
                            return {
                                myCustomProp1: {
                                    attribute: 'custom-prop',
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.myCustomProp2 = '';
                            this.myCustomProp3 = '';
                        }

                        render() {
                            return this.myCustomProp1;
                        }
                    };

                    __decorate([DNA.property()], BaseElement.prototype, 'myCustomProp2', undefined);
                    __decorate([DNA.property()], BaseElement.prototype, 'myCustomProp3', undefined);
                    BaseElement = __decorate([DNA.customElement(getComponentName())], BaseElement);

                    const _forceUpdate = vi.fn(() => {});
                    let TestElement = class TestElement extends BaseElement {
                        constructor(...args) {
                            super(...args);
                            this.myCustomProp4 = '';
                        }

                        forceUpdate() {
                            _forceUpdate();
                            super.forceUpdate();
                        }
                    };
                    __decorate([DNA.property()], TestElement.prototype, 'myCustomProp4', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    expect(element).toHaveProperty('myCustomProp1');
                    expect(element).toHaveProperty('myCustomProp2');
                    expect(element).toHaveProperty('myCustomProp3');
                    expect(element).toHaveProperty('myCustomProp4');
                    expect(element).not.toHaveProperty('myCustomProp5');
                    expect(_forceUpdate).not.toHaveBeenCalled();

                    element.myCustomProp1 = 'Hello';
                    element.forceUpdate();
                    expect(element.textContent).toBe('Hello');
                });

                it('should setup properties for extended components (js over ts)', () => {
                    let BaseElement = class extends DNA.Component {
                        static get properties() {
                            return {
                                myCustomProp1: {
                                    attribute: 'custom-prop',
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.myCustomProp2 = '';
                            this.myCustomProp3 = '';
                        }

                        render() {
                            return this.myCustomProp1;
                        }
                    };

                    __decorate([DNA.property()], BaseElement.prototype, 'myCustomProp2', undefined);
                    __decorate([DNA.property()], BaseElement.prototype, 'myCustomProp3', undefined);
                    BaseElement = __decorate([DNA.customElement(getComponentName())], BaseElement);

                    const _forceUpdate = vi.fn();
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends BaseElement {
                            static get properties() {
                                return {
                                    myCustomProp4: {
                                        type: String,
                                        defaultValue: '',
                                    },
                                };
                            }

                            forceUpdate() {
                                _forceUpdate();
                                super.forceUpdate();
                            }
                        }
                    );

                    const element = new TestElement();
                    expect(element).toHaveProperty('myCustomProp1');
                    expect(element).toHaveProperty('myCustomProp2');
                    expect(element).toHaveProperty('myCustomProp3');
                    expect(element).toHaveProperty('myCustomProp4');
                    expect(element).not.toHaveProperty('myCustomProp5');
                    expect(_forceUpdate).not.toHaveBeenCalled();

                    element.myCustomProp1 = 'Hello';
                    element.forceUpdate();
                    expect(element.textContent).toBe('Hello');
                });

                it('should connect already connected nodes', () => {
                    const is = getComponentName();
                    let connected = false;

                    wrapper.innerHTML = `<${is}></${is}>`;
                    expect(connected).toBe(false);
                    DNA.define(
                        is,
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connected = true;
                            }
                        }
                    );
                    window.customElements.upgrade(wrapper);
                    expect(connected).toBe(true);
                });
            });

            describe('#connectedCallback|disconnectedCallback', () => {
                it('should connect on appendChild and disconnect on removeChild', async () => {
                    class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.spyConnectedCallback = vi.fn();
                            this.spyDisconnectedCallback = vi.fn();
                        }

                        connectedCallback() {
                            super.connectedCallback();
                            this.spyConnectedCallback();
                        }
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            this.spyDisconnectedCallback();
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.removeChild(custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyDisconnectedCallback).toHaveBeenCalled();

                    const builtin = new TestElement2();
                    expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.removeChild(builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyDisconnectedCallback).toHaveBeenCalled();
                });

                it('should connect on replaceChild', async () => {
                    class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.spyConnectedCallback = vi.fn();
                            this.spyDisconnectedCallback = vi.fn();
                        }

                        connectedCallback() {
                            super.connectedCallback();
                            this.spyConnectedCallback();
                        }

                        disconnectedCallback() {
                            super.disconnectedCallback();
                            this.spyDisconnectedCallback();
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    const child = document.createElement('div');
                    wrapper.appendChild(child);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.replaceChild(custom, child);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.replaceChild(child, custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).toHaveBeenCalled();
                    expect(custom.spyConnectedCallback).toHaveBeenCalledOnce();
                    expect(custom.spyDisconnectedCallback).toHaveBeenCalledOnce();

                    const builtin = new TestElement2();
                    const child2 = document.createElement('div');
                    wrapper.appendChild(child2);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.replaceChild(builtin, child2);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.replaceChild(child2, builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).toHaveBeenCalled();
                    expect(builtin.spyConnectedCallback).toHaveBeenCalledOnce();
                    expect(builtin.spyDisconnectedCallback).toHaveBeenCalledOnce();
                });

                it('should connect on insertBefore', async () => {
                    class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.spyConnectedCallback = vi.fn();
                            this.spyDisconnectedCallback = vi.fn();
                        }

                        connectedCallback() {
                            super.connectedCallback();
                            this.spyConnectedCallback();
                        }

                        disconnectedCallback() {
                            super.disconnectedCallback();
                            this.spyDisconnectedCallback();
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    const child = document.createElement('div');
                    wrapper.appendChild(child);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.insertBefore(custom, child);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.insertBefore(child, custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalledOnce();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();

                    const builtin = new TestElement2();
                    const child2 = document.createElement('div');
                    wrapper.appendChild(child2);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.insertBefore(builtin, child2);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.insertBefore(child2, builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalledOnce();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                });

                it('should connect if not moved', async () => {
                    class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.spyConnectedCallback = vi.fn();
                            this.spyDisconnectedCallback = vi.fn();
                        }

                        connectedCallback() {
                            super.connectedCallback();
                            this.spyConnectedCallback();
                        }

                        disconnectedCallback() {
                            super.disconnectedCallback();
                            this.spyDisconnectedCallback();
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalled();
                    expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyConnectedCallback).toHaveBeenCalledTimes(2);
                    expect(custom.spyDisconnectedCallback).toHaveBeenCalledOnce();

                    const builtin = new TestElement2();
                    expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                    expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyConnectedCallback).toHaveBeenCalledTimes(2);
                    expect(builtin.spyDisconnectedCallback).toHaveBeenCalledOnce();
                });

                it('should render when connected', async () => {
                    class TestElement extends DNA.Component {
                        render() {
                            return DNA.html`<h1>test</h1>`;
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    expect(custom.innerHTML).toBe('');
                    wrapper.appendChild(custom);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.innerHTML).toBe('<h1>test</h1>');

                    const builtin = new TestElement2();
                    expect(builtin.innerHTML).toBe('');
                    wrapper.appendChild(builtin);
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.innerHTML).toBe('<h1>test</h1>');
                });
            });

            describe('~isConnected', () => {
                it('return `true` if element is connected', () => {
                    const is = getComponentName();
                    DNA.define(is, class extends DNA.Component {});
                    const element = document.createElement(is);

                    wrapper.appendChild(element);
                    expect(element.isConnected).toBe(true);
                });

                it('return `false` if element is disconnected', () => {
                    const is = getComponentName();
                    DNA.define(is, class extends DNA.Component {});

                    const element = document.createElement(is);
                    expect(element.isConnected).toBe(false);
                });
            });

            describe('#attributeChangedCallback', () => {
                it('should handle attribute changes on setAttribute', async () => {
                    class TestElement extends DNA.Component {
                        static get observedAttributes() {
                            return ['title'];
                        }

                        constructor(...args) {
                            super(...args);
                            this.spyAttributeChangedCallback = vi.fn();
                        }

                        attributeChangedCallback(...args) {
                            super.attributeChangedCallback(...args);
                            this.spyAttributeChangedCallback(...args);
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    expect(custom.spyAttributeChangedCallback).not.toHaveBeenCalled();
                    custom.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalled();
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                    custom.setAttribute('title', 'test2');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2', null);

                    const builtin = new TestElement2();
                    expect(builtin.spyAttributeChangedCallback).not.toHaveBeenCalled();
                    builtin.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalled();
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                    builtin.setAttribute('title', 'test2');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2', null);
                });

                it('should handle attribute changes on removeAttribute', async () => {
                    class TestElement extends DNA.Component {
                        static get observedAttributes() {
                            return ['title'];
                        }

                        constructor(...args) {
                            super(...args);
                            this.spyAttributeChangedCallback = vi.fn();
                        }

                        attributeChangedCallback(...args) {
                            super.attributeChangedCallback(...args);
                            this.spyAttributeChangedCallback(...args);
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    expect(custom.spyAttributeChangedCallback).not.toHaveBeenCalled();
                    custom.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalled();
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                    custom.removeAttribute('title');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', null, null);

                    const builtin = new TestElement2();
                    expect(builtin.spyAttributeChangedCallback).not.toHaveBeenCalled();
                    builtin.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalled();
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                    builtin.removeAttribute('title');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', null, null);
                });

                it('should handle attribute if nothing changed on setAttribute', async () => {
                    class TestElement extends DNA.Component {
                        static get observedAttributes() {
                            return ['title'];
                        }

                        constructor(...args) {
                            super(...args);
                            this.spyAttributeChangedCallback = vi.fn();
                        }

                        attributeChangedCallback(...args) {
                            super.attributeChangedCallback(...args);
                            this.spyAttributeChangedCallback(...args);
                        }
                    }

                    const TestElement1 = DNA.define(getComponentName(), class extends TestElement {});
                    const TestElement2 = DNA.define(getComponentName(), class extends TestElement {}, {
                        extends: 'article',
                    });

                    const custom = new TestElement1();
                    expect(custom.spyAttributeChangedCallback).not.toHaveBeenCalled();
                    custom.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalled();
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                    custom.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(custom.spyAttributeChangedCallback).toHaveBeenCalledTimes(2);

                    const builtin = new TestElement2();
                    expect(builtin.spyAttributeChangedCallback).not.toHaveBeenCalled();
                    builtin.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalled();
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                    builtin.setAttribute('title', 'test');
                    await new Promise((r) => setTimeout(r, 0));
                    expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledTimes(2);
                });

                describe('attribute and properties sync', () => {
                    let element, fromAttributeSpy;

                    beforeAll(() => {
                        fromAttributeSpy = vi.fn();

                        let TestElement = class TestElement extends DNA.Component {
                            constructor(...args) {
                                super(...args);
                                this.any = undefined;
                                this.boolean = false;
                                this.string = '';
                                this.number = 0;
                                this.stringNumber = '';
                                this.object = {};
                                this.array = [];
                                this.convertion = '';
                            }
                        };

                        __decorate([DNA.property()], TestElement.prototype, 'any', undefined);
                        __decorate([DNA.property({ type: Boolean })], TestElement.prototype, 'boolean', undefined);
                        __decorate([DNA.property({ type: String })], TestElement.prototype, 'string', undefined);
                        __decorate([DNA.property({ type: Number })], TestElement.prototype, 'number', undefined);
                        __decorate(
                            [DNA.property({ type: [String, Number], attribute: 'string-number' })],
                            TestElement.prototype,
                            'stringNumber',
                            undefined
                        );
                        __decorate([DNA.property({ type: [Object] })], TestElement.prototype, 'object', undefined);
                        __decorate([DNA.property({ type: [Array] })], TestElement.prototype, 'array', undefined);
                        __decorate(
                            [
                                DNA.property({
                                    fromAttribute(value) {
                                        fromAttributeSpy();
                                        return parseInt(value) * 2;
                                    },
                                    toAttribute(value) {
                                        return `${value / 2}`;
                                    },
                                }),
                            ],
                            TestElement.prototype,
                            'convertion',
                            undefined
                        );
                        TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                        element = new TestElement();
                    });

                    describe('attribute to property value convertion', () => {
                        it('should handle unspecified type', () => {
                            element.setAttribute('any', '1');
                            expect(element.any).toBe(1);
                            element.setAttribute('any', 'test');
                            expect(element.any).toBe('test');
                            element.removeAttribute('any');
                            expect(element.any).toBeNull();
                        });

                        it('should handle boolean type', () => {
                            element.setAttribute('boolean', '');
                            expect(element.boolean).toBe(true);
                            element.removeAttribute('boolean');
                            expect(element.boolean).toBe(false);
                        });

                        it('should handle string type', () => {
                            element.setAttribute('string', '');
                            expect(element.string).toBe('');
                            element.setAttribute('string', 'test');
                            expect(element.string).toBe('test');
                            element.setAttribute('string', '1234');
                            expect(element.string).toBe('1234');
                            element.setAttribute('string', '{"test":1}');
                            expect(element.string).toBe('{"test":1}');
                            element.setAttribute('string', '[1]');
                            expect(element.string).toBe('[1]');
                            element.removeAttribute('string');
                            expect(element.string).toBeNull();
                        });

                        it('should handle number type', () => {
                            element.setAttribute('number', '1234');
                            expect(element.number).toBe(1234);
                            element.setAttribute('number', '-1234');
                            expect(element.number).toBe(-1234);
                            element.setAttribute('number', '1234.1234');
                            expect(element.number).toBe(1234.1234);
                            element.removeAttribute('number');
                            expect(element.number).toBeNull();
                        });

                        it('should handle string/number type', () => {
                            element.setAttribute('string-number', '');
                            expect(element.stringNumber).toBe('');
                            element.setAttribute('string-number', 'test');
                            expect(element.stringNumber).toBe('test');
                            element.setAttribute('string-number', '1234');
                            expect(element.stringNumber).toBe(1234);
                            element.setAttribute('string-number', '{"test":1}');
                            expect(element.stringNumber).toBe('{"test":1}');
                            element.setAttribute('string-number', '[1]');
                            expect(element.stringNumber).toBe('[1]');
                            element.removeAttribute('string-number');
                            expect(element.stringNumber).toBeNull();
                        });

                        it('should handle object type', () => {
                            element.setAttribute('object', '{}');
                            expect(element.object).toStrictEqual({});
                            element.setAttribute('object', '{"test":1}');
                            expect(element.object).toStrictEqual({ test: 1 });
                            element.removeAttribute('object');
                            expect(element.object).toBeNull();
                        });

                        it('should handle array type', () => {
                            element.setAttribute('array', '[]');
                            expect(element.array).toStrictEqual([]);
                            element.setAttribute('array', '[1]');
                            expect(element.array).toStrictEqual([1]);
                            element.removeAttribute('array');
                            expect(element.array).toBeNull();
                        });

                        it('should convert using configuration', () => {
                            element.setAttribute('convertion', '2');
                            expect(element.convertion).toBe(4);
                        });
                    });

                    describe('property to attribute value convertion', () => {
                        it('should convert using configuration', () => {
                            element.convertion = 4;
                            expect(element.getAttribute('convertion')).toBe('2');
                        });

                        it.only('should not convert attribute if set by property', () => {
                            element.convertion = 4;
                            expect(fromAttributeSpy).not.toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('#propertyChangedCallback/stateChangedCallback', () => {
                it('should handle property changes on assignment', () => {
                    const propertyChangedCallback = vi.fn();

                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                age: {
                                    type: [Number],
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                        }

                        propertyChangedCallback(...args) {
                            super.propertyChangedCallback(...args);
                            propertyChangedCallback(...args);
                        }
                    };

                    __decorate(
                        [DNA.property({ type: [String], attribute: false })],
                        TestElement.prototype,
                        'title',
                        undefined
                    );
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    expect(propertyChangedCallback).not.toHaveBeenCalled();
                    element.title = 'test';
                    expect(propertyChangedCallback).toHaveBeenCalled();
                    expect(propertyChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                    element.title = 'test2';
                    expect(propertyChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2');
                    element.age = 42;
                    expect(propertyChangedCallback).toHaveBeenCalledWith('age', undefined, 42);
                    element.setAttribute('title', 'test');
                    expect(propertyChangedCallback).toHaveBeenCalledTimes(3);
                });

                it('should handle state property changes on assignment', () => {
                    const stateChangedCallback = vi.fn();

                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                age: {
                                    type: [Number],
                                    state: true,
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                        }

                        stateChangedCallback(...args) {
                            super.stateChangedCallback(...args);
                            stateChangedCallback(...args);
                        }
                    };

                    __decorate([DNA.state({ type: [String] })], TestElement.prototype, 'title', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    expect(stateChangedCallback).not.toHaveBeenCalled();
                    element.title = 'test';
                    expect(stateChangedCallback).toHaveBeenCalled();
                    expect(stateChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                    element.title = 'test2';
                    expect(stateChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2');
                    element.age = 42;
                    expect(stateChangedCallback).toHaveBeenCalledWith('age', undefined, 42);
                    element.setAttribute('title', 'test');
                    expect(stateChangedCallback).toHaveBeenCalledTimes(3);
                });

                it('should not loop on connection assignement', async () => {
                    const propertyChangedCallback = vi.fn();
                    const name = getComponentName();
                    wrapper.innerHTML = `<section is="${name}" page="1"></section>`;
                    const element = wrapper.children[0];
                    DNA.define(
                        name,
                        class TestElement extends DNA.Component {
                            static get properties() {
                                return {
                                    page: {
                                        type: Number,
                                    },
                                };
                            }

                            connectedCallback() {
                                super.connectedCallback();
                                this.page = 2;
                            }

                            propertyChangedCallback(...args) {
                                super.propertyChangedCallback(...args);
                                propertyChangedCallback(...args);
                            }
                        },
                        {
                            extends: 'section',
                        }
                    );
                    window.customElements.upgrade(element);
                    await new Promise((r) => setTimeout(r, 0));

                    expect(propertyChangedCallback).toHaveBeenCalled();
                    expect(propertyChangedCallback).toHaveBeenCalledWith('page', 1, 2);
                    expect(propertyChangedCallback).toHaveBeenCalledTimes(2);
                });

                it('should NOT handle property changes on delete', () => {
                    const propertyChangedCallback = vi.fn((name, old, value) => [name, old, value]);

                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                age: {
                                    type: [Number],
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                        }

                        propertyChangedCallback(...args) {
                            super.propertyChangedCallback(...args);
                            propertyChangedCallback(...args);
                        }
                    };

                    __decorate([DNA.property()], TestElement.prototype, 'title', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    expect(propertyChangedCallback).not.toHaveBeenCalled();
                    element.title = 'test';
                    expect(propertyChangedCallback).toHaveBeenCalled();
                    expect(propertyChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                    delete element.title;
                    expect(propertyChangedCallback).toHaveBeenCalledOnce();
                });

                it('should should re-render on property changes', () => {
                    let TestElement = class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.title = '';
                        }

                        render() {
                            return DNA.html`<h1>${this.title}</h1>`;
                        }
                    };

                    __decorate([DNA.property({ type: [String] })], TestElement.prototype, 'title', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    expect(element.innerHTML).toBe('<h1></h1>');
                    element.title = 'test';
                    expect(element.innerHTML).toBe('<h1>test</h1>');
                });

                it('should should re-render once using assign', () => {
                    const spy = vi.fn();
                    let TestElement = class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.title = '';
                            this.description = '';
                        }

                        render() {
                            spy();
                            return DNA.html`<h1>${this.title}</h1><h2>${this.description}</h2>`;
                        }
                    };

                    __decorate([DNA.property({ type: [String] })], TestElement.prototype, 'title', undefined);
                    __decorate([DNA.property({ type: [String] })], TestElement.prototype, 'description', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    expect(element.innerHTML).toBe('<h1></h1><h2></h2>');
                    element.assign({
                        title: 'test',
                        description: 'test',
                    });
                    expect(element.innerHTML).toBe('<h1>test</h1><h2>test</h2>');
                    expect(spy).toHaveBeenCalledTimes(2);
                });

                it('should should re-render once using assign inside rendering cycle', () => {
                    const spy = vi.fn();
                    let TestElement = class TestElement extends DNA.Component {
                        constructor(...args) {
                            super(...args);
                            this.title = '';
                            this.description = '';
                        }

                        render() {
                            spy();
                            const tpl = DNA.html`<h1>${this.title}</h1><h2>${this.description}</h2>`;
                            if (!this.title) {
                                this.assign({
                                    title: 'test',
                                    description: 'test',
                                });
                            }
                            return tpl;
                        }
                    };

                    __decorate([DNA.property({ type: [String] })], TestElement.prototype, 'title', undefined);
                    __decorate([DNA.property({ type: [String] })], TestElement.prototype, 'description', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    wrapper.appendChild(element);
                    expect(element.innerHTML).toBe('<h1>test</h1><h2>test</h2>');
                    expect(spy).toHaveBeenCalledTimes(2);
                });

                it('should render only once after construction', () => {
                    const callback = vi.fn();

                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                author: String,
                                date: {
                                    type: Date,
                                    defaultValue: new Date(0),
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                            this.description = '';
                            this.body = 'Test';
                        }

                        render() {
                            callback();
                            return DNA.html`
                        <div>${this.title}</div>
                        <div>${this.description}</div>
                        <div>${this.body}</div>
                        <div>${this.author}</div>
                        <div>${this.date.getTime()}</div>
                    `;
                        }
                    };

                    __decorate([DNA.property()], TestElement.prototype, 'title', undefined);
                    __decorate([DNA.property()], TestElement.prototype, 'description', undefined);
                    __decorate([DNA.property()], TestElement.prototype, 'body', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    expect(callback).not.toHaveBeenCalled();
                    const element = new TestElement();
                    element.title = 'Test';
                    element.description = 'Test';
                    element.author = 'Test';
                    wrapper.appendChild(element);
                    expect(callback).toHaveBeenCalledTimes(4);
                    expect(element.innerHTML).toBe(
                        '<div>Test</div><div>Test</div><div>Test</div><div>Test</div><div>0</div>'
                    );
                });

                it('should NOT handle property if nothing changed on assignment', () => {
                    const propertyChangedCallback = vi.fn();

                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                age: {
                                    type: [Number],
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                        }

                        propertyChangedCallback(...args) {
                            super.propertyChangedCallback(...args);
                            propertyChangedCallback(...args);
                        }
                    };

                    __decorate([DNA.property({ type: [String] })], TestElement.prototype, 'title', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    expect(propertyChangedCallback).not.toHaveBeenCalled();
                    element.title = 'test';
                    expect(propertyChangedCallback).toHaveBeenCalled();
                    expect(propertyChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                    element.title = 'test';
                    expect(propertyChangedCallback).toHaveBeenCalledOnce();
                });

                it('should dispatch custom event', () => {
                    const callback1 = vi.fn();
                    const callback2 = vi.fn();

                    let TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                age: {
                                    type: [Number],
                                    event: true,
                                    defaultValue: 20,
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                        }
                    };

                    __decorate([DNA.property({ event: 'titleupdate' })], TestElement.prototype, 'title', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);

                    const element = new TestElement();
                    element.addEventListener('agechange', (event) =>
                        callback1(event.type, event.detail.oldValue, event.detail.newValue)
                    );
                    element.addEventListener('titleupdate', (event) =>
                        callback2(event.type, event.detail.oldValue, event.detail.newValue)
                    );
                    expect(callback1).not.toHaveBeenCalled();
                    expect(callback2).not.toHaveBeenCalled();
                    element.age = 25;
                    expect(callback1).toHaveBeenCalled();
                    expect(callback2).not.toHaveBeenCalled();
                    expect(callback1).toHaveBeenCalledWith('agechange', 20, 25);
                    element.title = 'Test';
                    expect(callback2).toHaveBeenCalled();
                    expect(callback2).toHaveBeenCalledWith('titleupdate', '', 'Test');
                });
            });

            describe('#textContent', () => {
                it('should retrieve whole textContent', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot></slot> inner text
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();

                    element.textContent = 'Test';
                    expect(element.textContent).toBe('Test inner text');
                });

                it('should set slot text using textContent setter', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot></slot>
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    element.textContent = 'Test';

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].textContent).toBe('Test');
                    realm.dangerouslyClose();
                });
            });

            describe('#innerHTML', () => {
                it('should retrieve whole innerHTML', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot></slot> inner text
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    element.innerHTML = '<span>Test</span>';

                    expect(element.innerHTML.indexOf('<div>')).toBe(0);
                    expect(element.innerHTML.indexOf('<span>Test</span>')).not.toBe(-1);
                });

                it('should set slot text using innerHTML setter', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot></slot>
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    element.innerHTML = '<span>Test</span>';

                    realm.dangerouslyOpen();
                    expect(element.children).toHaveLength(1);
                    expect(element.children[0].tagName).toBe('DIV');
                    expect(element.children[0].children[0].tagName).toBe('SPAN');
                    expect(element.children[0].children[0].textContent).toBe('Test');
                    realm.dangerouslyClose();
                });
            });

            describe('#appendChild', () => {
                it('should append and connect child', () => {
                    const connectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    element.appendChild(child);
                    expect(connectedCallback).toHaveBeenCalled();
                    element.appendChild(child);
                    expect(connectedCallback).toHaveBeenCalledOnce();
                });

                it('should move and connect a child from a parent', () => {
                    const connectedCallback = vi.fn();
                    const disconnectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                disconnectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    wrapper.appendChild(child);
                    expect(connectedCallback).toHaveBeenCalled();
                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    element.appendChild(child);
                    expect(connectedCallback).toHaveBeenCalledTimes(2);
                    expect(disconnectedCallback).toHaveBeenCalled();
                });

                it('should render default slot', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot>
                                    <span>Test</span>
                                </slot>
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    wrapper.appendChild(element);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                    expect(element.childNodes[0].childNodes[0].textContent).toBe('Test');
                    realm.dangerouslyClose();
                });

                it('should append slot item', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot>
                                    <span>Test</span>
                                </slot>
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    const span = document.createElement('span');
                    wrapper.appendChild(element);
                    element.appendChild(span);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                    realm.dangerouslyClose();
                });
            });

            describe('#removeChild', () => {
                it('should remove and disconnect a child', () => {
                    const disconnectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                disconnectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child = new TestChild();

                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    element.appendChild(child);
                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    element.removeChild(child);
                    expect(disconnectedCallback).toHaveBeenCalled();
                });

                it('should remove slot item', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot />
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    const span = document.createElement('span');
                    wrapper.appendChild(element);
                    element.appendChild(span);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                    realm.dangerouslyClose();

                    element.removeChild(span);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes).toHaveLength(0);
                    realm.dangerouslyClose();
                });
            });

            describe('#insertBefore', () => {
                it('should insert and connect a child before another', () => {
                    const connectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child1 = new TestChild();
                    const child2 = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    element.appendChild(child1);
                    element.insertBefore(child2, child1);
                    expect(connectedCallback).toHaveBeenCalledTimes(2);
                    element.insertBefore(child2, child1);
                    expect(element.slotChildNodes.length).toBe(2);
                });

                it('should insert and connect a child (and remove it from the previous parent) before another', () => {
                    const connectedCallback = vi.fn();
                    const disconnectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                disconnectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child1 = new TestChild();
                    const child2 = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    wrapper.appendChild(child2);
                    element.appendChild(child1);
                    element.insertBefore(child2, child1);
                    expect(connectedCallback).toHaveBeenCalledTimes(3);
                    expect(disconnectedCallback).toHaveBeenCalledOnce();
                });

                it('should insert slot item', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                        <slot />
                    </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    const span = document.createElement('span');
                    const input = document.createElement('input');
                    wrapper.appendChild(element);
                    element.appendChild(span);
                    element.insertBefore(input, span);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('INPUT');
                    expect(element.childNodes[0].childNodes[1].tagName).toBe('SPAN');
                    realm.dangerouslyClose();
                });
            });

            describe('#replaceChild', () => {
                it('should reaplce and connect child in a parent', () => {
                    const connectedCallback = vi.fn();
                    const disconnectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                disconnectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child1 = new TestChild();
                    const child2 = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    element.appendChild(child1);
                    element.replaceChild(child2, child1);
                    expect(connectedCallback).toHaveBeenCalledTimes(2);
                    expect(disconnectedCallback).toHaveBeenCalledOnce();
                });

                it('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
                    const connectedCallback = vi.fn();
                    const disconnectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                disconnectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child1 = new TestChild();
                    const child2 = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    expect(disconnectedCallback).not.toHaveBeenCalled();

                    wrapper.appendChild(element);
                    wrapper.appendChild(child2);
                    element.appendChild(child1);
                    element.replaceChild(child2, child1);
                    expect(connectedCallback).toHaveBeenCalledTimes(3);
                    expect(disconnectedCallback).toHaveBeenCalledTimes(2);
                });

                it('should replace slot item', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                        <slot />
                    </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    const span = document.createElement('span');
                    const input = document.createElement('input');
                    wrapper.appendChild(element);
                    element.appendChild(span);
                    element.replaceChild(input, span);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('INPUT');
                    realm.dangerouslyClose();
                });
            });

            describe('#insertAdjacentElement', () => {
                it('should insert and connect a child at first position', () => {
                    const connectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child1 = new TestChild();
                    const child2 = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    element.appendChild(child1);
                    element.insertAdjacentElement('afterbegin', child2);
                    expect(connectedCallback).toHaveBeenCalledTimes(2);
                    element.insertBefore(child2, child1);
                    expect(element.slotChildNodes.length).toBe(2);
                });

                it('should insert and connect a child (and remove it from the previous parent) at last position', () => {
                    const connectedCallback = vi.fn();
                    const disconnectedCallback = vi.fn();
                    const TestElement = DNA.define(getComponentName(), class extends DNA.Component {});
                    const TestChild = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            connectedCallback() {
                                super.connectedCallback();
                                connectedCallback();
                            }
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                disconnectedCallback();
                            }
                        }
                    );
                    const element = new TestElement();
                    const child1 = new TestChild();
                    const child2 = new TestChild();

                    expect(connectedCallback).not.toHaveBeenCalled();
                    expect(disconnectedCallback).not.toHaveBeenCalled();
                    wrapper.appendChild(element);
                    wrapper.appendChild(child2);
                    element.appendChild(child1);
                    element.insertAdjacentElement('beforeend', child2);
                    expect(connectedCallback).toHaveBeenCalledTimes(3);
                    expect(disconnectedCallback).toHaveBeenCalledOnce();
                });

                it('should insert slot item', () => {
                    const TestElement = DNA.define(
                        getComponentName(),
                        class extends DNA.Component {
                            render() {
                                return DNA.html`<div>
                                <slot />
                            </div>`;
                            }
                        }
                    );
                    const element = new TestElement();
                    const realm = element.realm;
                    const span = document.createElement('span');
                    const input = document.createElement('input');
                    wrapper.appendChild(element);
                    element.appendChild(span);
                    element.insertAdjacentElement('afterbegin', input);

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('INPUT');
                    expect(element.childNodes[0].childNodes[1].tagName).toBe('SPAN');
                    realm.dangerouslyClose();
                });
            });

            describe('attributes', () => {
                let element, TestElement;

                beforeAll(() => {
                    TestElement = class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                age: {
                                    type: [Number],
                                },
                            };
                        }

                        constructor(...args) {
                            super(...args);
                            this.title = '';
                            this.test = '';
                        }
                    };

                    __decorate([DNA.property()], TestElement.prototype, 'title', undefined);
                    __decorate([DNA.property({ attribute: 'alias' })], TestElement.prototype, 'test', undefined);
                    TestElement = __decorate([DNA.customElement(getComponentName())], TestElement);
                });

                beforeEach(() => {
                    element = new TestElement();
                    element.title = 'DNA';
                    element.age = 42;
                });

                describe('#getAttribute', () => {
                    it('should get an empty attribute', () => {
                        expect(element.getAttribute('missing')).toBeNull();
                    });

                    it('should get a string attribute', () => {
                        expect(element.getAttribute('title')).toBe('DNA');
                    });

                    it('should get a numeric attribute', () => {
                        expect(element.getAttribute('age')).toBe('42');
                    });
                });

                describe('#setAttribute', () => {
                    it('should set an attribute', () => {
                        element.setAttribute('missing', 'DNA');
                        expect(element.getAttribute('missing')).toBe('DNA');
                    });

                    it('should set a string attribute and update the property', () => {
                        element.setAttribute('title', 'WebComponents');
                        expect(element.title).toBe('WebComponents');
                    });

                    it('should set a string attribute and update the aliased property', () => {
                        element.setAttribute('alias', 'WebComponents');
                        expect(element.test).toBe('WebComponents');
                    });
                });

                describe('#hasAttribute', () => {
                    it('should return `true` if element has an attribute', () => {
                        expect(element.hasAttribute('title')).toBe(true);
                    });

                    it('should return `false` if element has an attribute', () => {
                        expect(element.hasAttribute('missing')).toBe(false);
                    });
                });

                describe('#removeAttribute', () => {
                    it('should remove an attribute', () => {
                        element.removeAttribute('title');
                        expect(element.hasAttribute('title')).toBe(false);
                    });

                    it('should remove a string attribute and update the property', () => {
                        element.removeAttribute('title');
                        expect(element.title).toBeNull();
                    });

                    it('should remove a numeric attribute and update the property', () => {
                        element.removeAttribute('age');
                        expect(element.age).toBeNull();
                    });
                });
            });
        });

        describe.runIf(typeof window === 'undefined')('node', () => {
            it('should define a component', () => {
                expect(() => {
                    const is = getComponentName();
                    DNA.define(is, class TestElement extends DNA.Component {});
                }).not.toThrow();
            });

            it('should define a builtin component', () => {
                expect(() => {
                    const is = getComponentName();
                    DNA.define(is, class TestElement extends DNA.Component {}, {
                        extends: 'article',
                    });
                }).not.toThrow();
            });

            it('should throw on construct', () => {
                expect(() => {
                    const is = getComponentName();
                    const TestElement = DNA.define(is, class TestElement extends DNA.Component {});

                    new TestElement();
                }).toThrow();
            });
        });
    },
    10 * 1000
);
