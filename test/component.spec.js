// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import _decorate from '@babel/runtime/helpers/decorate';
import { expect, spy } from '@chialab/ginsenghino';
import { getComponentName } from './helpers.spec.js';

describe('Component', function() {
    this.timeout(10 * 1000);

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
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement);

            const element = new TestElement();
            expect(element).to.be.an.instanceof(HTMLElement);
            expect(element.is).to.be.equal(is);
            expect(element.tagName).to.be.equal(is.toUpperCase());
        });

        it('should extend a native node', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement, {
                extends: 'article',
            });

            const element = new TestElement();
            expect(element).to.be.an.instanceof(HTMLElement);
            expect(element.is).to.be.equal(is);
            expect(element.tagName).to.be.equal('ARTICLE');
        });

        it('should create a base class starting from the anchor base class', () => {
            const HTMLAnchorElement = DNA.extend(window.HTMLAnchorElement);
            class TestElement extends HTMLAnchorElement { }
            DNA.define(getComponentName(), TestElement, { extends: 'a' });
            const element = new TestElement();
            element.href = 'https://www.webcomponents.org/introduction';
            expect(TestElement).to.not.equal(HTMLAnchorElement);
            expect(element).to.be.an.instanceof(HTMLAnchorElement);
            expect('href' in element).to.be.true;
        });

        it('should throw if element is not defined', () => {
            class TestElement extends DNA.Component { }
            expect(() => new TestElement()).to.throw(TypeError);
        });

        it('should setup properties', () => {
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
            };

            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp2', undefined);
            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp3', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.not.have.property('myCustomProp4');
        });

        it('should setup properties with babel decorator', () => {
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
                    }, {
                        kind: 'field',
                        decorators: [DNA.property()],
                        key: 'myCustomProp2',
                        value() {
                            return '';
                        },
                    }, {
                        kind: 'field',
                        decorators: [DNA.property()],
                        key: 'myCustomProp3',
                        value() {
                            return '';
                        },
                    }],
                };
            }, DNA.Component);

            const element = new TestElement();
            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.not.have.property('myCustomProp4');
        });

        it('should setup properties for extended elements', () => {
            const _forceUpdate = spy();
            let TestElement = class TestElement extends DNA.extend(HTMLElement) {
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

            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp2', undefined);
            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp3', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName(), { extends: 'article' }),
            ], TestElement);

            const element = new TestElement();
            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.not.have.property('myCustomProp4');
            expect(_forceUpdate).to.have.not.been.called();

            element.myCustomProp1 = 'Hello';
            element.forceUpdate();
            expect(element.textContent).to.be.equal('Hello');
        });

        it('should setup properties for extended components (ts over ts)', () => {
            let BaseElement = class BaseElement extends DNA.extend(HTMLElement) {
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

            __decorate([
                DNA.property(),
            ], BaseElement.prototype, 'myCustomProp2', undefined);
            __decorate([
                DNA.property(),
            ], BaseElement.prototype, 'myCustomProp3', undefined);
            BaseElement = __decorate([
                DNA.customElement(getComponentName()),
            ], BaseElement);

            const _forceUpdate = spy();
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
            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp4', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.have.property('myCustomProp4');
            expect(element).to.not.have.property('myCustomProp5');
            expect(_forceUpdate).to.have.not.been.called();

            element.myCustomProp1 = 'Hello';
            element.forceUpdate();
            expect(element.textContent).to.be.equal('Hello');
        });

        it('should setup properties for extended components (js over ts)', () => {
            let BaseElement = class BaseElement extends DNA.extend(HTMLElement) {
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

            __decorate([
                DNA.property(),
            ], BaseElement.prototype, 'myCustomProp2', undefined);
            __decorate([
                DNA.property(),
            ], BaseElement.prototype, 'myCustomProp3', undefined);
            BaseElement = __decorate([
                DNA.customElement(getComponentName()),
            ], BaseElement);

            const _forceUpdate = spy();
            class TestElement extends BaseElement {
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
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.have.property('myCustomProp4');
            expect(element).to.not.have.property('myCustomProp5');
            expect(_forceUpdate).to.have.not.been.called();

            element.myCustomProp1 = 'Hello';
            element.forceUpdate();
            expect(element.textContent).to.be.equal('Hello');
        });

        it('should initialize properties', () => {
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
                    this.myCustomProp2 = 'test';
                    this.myCustomProp3 = '';
                }
            };

            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp2', undefined);
            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'myCustomProp3', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement({
                myCustomProp1: 42,
                myCustomProp2: 'toast',
            });

            expect(element.myCustomProp1, 42);
            expect(element.myCustomProp2, 'toast');
        });

        it('should connect already connected nodes', () => {
            const is = getComponentName();
            let connected = false;
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connected = true;
                }
            }

            wrapper.innerHTML = `<${is}></${is}>`;
            expect(connected).to.be.false;
            DNA.define(is, TestElement);
            customElements.upgrade(wrapper);
            expect(connected).to.be.true;
        });
    });

    describe('#connectedCallback|disconnectedCallback', () => {
        it('should connect on appendChild and disconnect on removeChild', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spy();
                    this.spyDisconnectedCallback = spy();
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
            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyConnectedCallback).to.not.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.appendChild(element);
                expect(element.spyConnectedCallback).to.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.removeChild(element);
                expect(element.spyDisconnectedCallback).to.have.been.called();
            });
        });

        it('should connect on replaceChild', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spy();
                    this.spyDisconnectedCallback = spy();
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

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                const child = document.createElement('div');
                wrapper.appendChild(child);
                expect(element.spyConnectedCallback).to.not.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.replaceChild(element, child);
                expect(element.spyConnectedCallback).to.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.replaceChild(child, element);
                expect(element.spyConnectedCallback).to.have.been.called();
                expect(element.spyDisconnectedCallback).to.have.been.called();
                expect(element.spyConnectedCallback).to.have.been.called.once;
                expect(element.spyDisconnectedCallback).to.have.been.called.once;
            });
        });

        it('should connect on insertBefore', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spy();
                    this.spyDisconnectedCallback = spy();
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

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                const child = document.createElement('div');
                wrapper.appendChild(child);
                expect(element.spyConnectedCallback).to.not.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.insertBefore(element, child);
                expect(element.spyConnectedCallback).to.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.insertBefore(child, element);
                expect(element.spyConnectedCallback).to.have.been.called.once;
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
            });
        });

        it('should connect if not moved', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spy();
                    this.spyDisconnectedCallback = spy();
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

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyConnectedCallback).to.not.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.appendChild(element);
                expect(element.spyConnectedCallback).to.have.been.called();
                expect(element.spyDisconnectedCallback).to.not.have.been.called();
                wrapper.appendChild(element);
                expect(element.spyConnectedCallback).to.have.been.called.twice;
                expect(element.spyDisconnectedCallback).to.have.been.called.once;
            });
        });

        it('should render when connected', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<h1>test</h1>`;
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.innerHTML).to.be.equal('');
                wrapper.appendChild(element);
                expect(element.innerHTML).to.be.equal('<h1>test</h1>');
            });
        });
    });

    describe('~isConnected', () => {
        it('return `true` if element is connected', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement);

            const element = document.createElement(is);
            wrapper.appendChild(element);
            expect(element.isConnected).to.be.true;
        });

        it('return `false` if element is disconnected', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement);

            const element = document.createElement(is);
            expect(element.isConnected).to.be.false;
        });
    });

    describe('#attributeChangedCallback', () => {
        it('should handle attribute changes on setAttribute', () => {
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                constructor(...args) {
                    super(...args);
                    this.spyAttributeChangedCallback = spy();
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    this.spyAttributeChangedCallback(...args);
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyAttributeChangedCallback).to.not.have.been.called();
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback).to.have.been.called();
                expect(element.spyAttributeChangedCallback).to.have.been.called.with('title', null, 'test');
                element.setAttribute('title', 'test2');
                expect(element.spyAttributeChangedCallback).to.have.been.called.with('title', 'test', 'test2');
            });
        });

        it('should handle attribute changes on removeAttribute', () => {
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                constructor(...args) {
                    super(...args);
                    this.spyAttributeChangedCallback = spy();
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    this.spyAttributeChangedCallback(...args);
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyAttributeChangedCallback).to.not.have.been.called();
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback).to.have.been.called();
                expect(element.spyAttributeChangedCallback).to.have.been.called.with('title', null, 'test');
                element.removeAttribute('title');
                expect(element.spyAttributeChangedCallback).to.have.been.called.with('title', 'test', null);
            });
        });

        it('should handle attribute if nothing changed on setAttribute', () => {
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                constructor(...args) {
                    super(...args);
                    this.spyAttributeChangedCallback = spy();
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    this.spyAttributeChangedCallback(...args);
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.define(getComponentName(), TestElement1);
            DNA.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyAttributeChangedCallback).to.not.have.been.called();
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback).to.have.been.called();
                expect(element.spyAttributeChangedCallback).to.have.been.called.with('title', null, 'test');
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback).to.have.been.called.twice;
            });
        });

        describe('attribute and properties sync', () => {
            let element;

            before(() => {
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

                __decorate([
                    DNA.property(),
                ], TestElement.prototype, 'any', undefined);
                __decorate([
                    DNA.property({ type: Boolean }),
                ], TestElement.prototype, 'boolean', undefined);
                __decorate([
                    DNA.property({ type: String }),
                ], TestElement.prototype, 'string', undefined);
                __decorate([
                    DNA.property({ type: Number }),
                ], TestElement.prototype, 'number', undefined);
                __decorate([
                    DNA.property({ type: [String, Number], attribute: 'string-number' }),
                ], TestElement.prototype, 'stringNumber', undefined);
                __decorate([
                    DNA.property({ type: [Object] }),
                ], TestElement.prototype, 'object', undefined);
                __decorate([
                    DNA.property({ type: [Array] }),
                ], TestElement.prototype, 'array', undefined);
                __decorate([
                    DNA.property({
                        fromAttribute(value) {
                            return parseInt(value) * 2;
                        },
                        toAttribute(value) {
                            return `${value / 2}`;
                        },
                    }),
                ], TestElement.prototype, 'convertion', undefined);
                TestElement = __decorate([
                    DNA.customElement(getComponentName()),
                ], TestElement);

                element = new TestElement();
            });

            describe('attribute to property value convertion', () => {
                it('should handle unspecified type', () => {
                    element.setAttribute('any', '1');
                    expect(element.any).to.be.equal(1);
                    element.setAttribute('any', 'test');
                    expect(element.any).to.be.equal('test');
                    element.removeAttribute('any');
                    expect(element.any).to.be.null;
                });

                it('should handle boolean type', () => {
                    element.setAttribute('boolean', '');
                    expect(element.boolean).to.be.true;
                    element.removeAttribute('boolean');
                    expect(element.boolean).to.be.false;
                });

                it('should handle string type', () => {
                    element.setAttribute('string', '');
                    expect(element.string).to.be.equal('');
                    element.setAttribute('string', 'test');
                    expect(element.string).to.be.equal('test');
                    element.setAttribute('string', '1234');
                    expect(element.string).to.be.equal('1234');
                    element.setAttribute('string', '{"test":1}');
                    expect(element.string).to.be.equal('{"test":1}');
                    element.setAttribute('string', '[1]');
                    expect(element.string).to.be.equal('[1]');
                    element.removeAttribute('string');
                    expect(element.string).to.be.null;
                });

                it('should handle number type', () => {
                    element.setAttribute('number', '1234');
                    expect(element.number).to.be.equal(1234);
                    element.setAttribute('number', '-1234');
                    expect(element.number).to.be.equal(-1234);
                    element.setAttribute('number', '1234.1234');
                    expect(element.number).to.be.equal(1234.1234);
                    element.removeAttribute('number');
                    expect(element.number).to.be.null;
                });

                it('should handle string/number type', () => {
                    element.setAttribute('string-number', '');
                    expect(element.stringNumber).to.be.equal('');
                    element.setAttribute('string-number', 'test');
                    expect(element.stringNumber).to.be.equal('test');
                    element.setAttribute('string-number', '1234');
                    expect(element.stringNumber).to.be.equal(1234);
                    element.setAttribute('string-number', '{"test":1}');
                    expect(element.stringNumber).to.be.equal('{"test":1}');
                    element.setAttribute('string-number', '[1]');
                    expect(element.stringNumber).to.be.equal('[1]');
                    element.removeAttribute('string-number');
                    expect(element.stringNumber).to.be.null;
                });

                it('should handle object type', () => {
                    element.setAttribute('object', '{}');
                    expect(element.object).to.be.deep.equal({});
                    element.setAttribute('object', '{"test":1}');
                    expect(element.object).to.be.deep.equal({ test: 1 });
                    element.removeAttribute('object');
                    expect(element.object).to.be.null;
                });

                it('should handle array type', () => {
                    element.setAttribute('array', '[]');
                    expect(element.array).to.be.deep.equal([]);
                    element.setAttribute('array', '[1]');
                    expect(element.array).to.be.deep.equal([1]);
                    element.removeAttribute('array');
                    expect(element.array).to.be.null;
                });

                it('should convert using configuration', () => {
                    element.setAttribute('convertion', '2');
                    expect(element.convertion).to.be.equal(4);
                });
            });

            describe('property to attribute value convertion', () => {
                it('should convert using configuration', () => {
                    element.convertion = 4;
                    expect(element.getAttribute('convertion')).to.be.equal('2');
                });
            });
        });
    });

    describe('#propertyChangedCallback/stateChangedCallback', () => {
        it('should handle property changes on assignment', () => {
            const propertyChangedCallback = spy();

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

            __decorate([
                DNA.property({ type: [String], attribute: false }),
            ], TestElement.prototype, 'title', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            expect(propertyChangedCallback).to.not.have.been.called();
            element.title = 'test';
            expect(propertyChangedCallback).to.have.been.called();
            expect(propertyChangedCallback).to.have.been.called.with('title', '', 'test');
            element.title = 'test2';
            expect(propertyChangedCallback).to.have.been.called.with('title', 'test', 'test2');
            element.age = 42;
            expect(propertyChangedCallback).to.have.been.called.with('age', undefined, 42);
            element.setAttribute('title', 'test');
            expect(propertyChangedCallback).to.have.been.called.exactly(3);
        });

        it('should handle state property changes on assignment', () => {
            const stateChangedCallback = spy();

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

            __decorate([
                DNA.state({ type: [String] }),
            ], TestElement.prototype, 'title', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            expect(stateChangedCallback).to.not.have.been.called();
            element.title = 'test';
            expect(stateChangedCallback).to.have.been.called();
            expect(stateChangedCallback).to.have.been.called.with('title', '', 'test');
            element.title = 'test2';
            expect(stateChangedCallback).to.have.been.called.with('title', 'test', 'test2');
            element.age = 42;
            expect(stateChangedCallback).to.have.been.called.with('age', undefined, 42);
            element.setAttribute('title', 'test');
            expect(stateChangedCallback).to.have.been.called.exactly(3);
        });

        it('should not loop on connection assignement', async () => {
            const propertyChangedCallback = spy();

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
            }

            const name = getComponentName();
            wrapper.innerHTML = `<section is="${name}" page="1"></section>`;
            const element = wrapper.children[0];
            DNA.define(name, TestElement, {
                extends: 'section',
            });
            customElements.upgrade(element);

            expect(propertyChangedCallback).to.have.been.called();
            expect(propertyChangedCallback).to.have.been.called.with('page', 1, 2);
            expect(propertyChangedCallback).to.have.been.called.twice;
        });

        it('should NOT handle property changes on delete', () => {
            const propertyChangedCallback = spy((name, old, value) => [name, old, value]);

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

            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'title', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            expect(propertyChangedCallback).to.not.have.been.called();
            element.title = 'test';
            expect(propertyChangedCallback).to.have.been.called();
            expect(propertyChangedCallback).to.have.been.called.with('title', '', 'test');
            delete element.title;
            expect(propertyChangedCallback).to.have.been.called.once;
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

            __decorate([
                DNA.property({ type: [String] }),
            ], TestElement.prototype, 'title', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            wrapper.appendChild(element);
            expect(element.innerHTML).to.be.equal('<h1></h1>');
            element.title = 'test';
            expect(element.innerHTML).to.be.equal('<h1>test</h1>');
        });

        it('should render only once after construction', () => {
            const callback = spy();

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

            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'title', undefined);
            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'description', undefined);
            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'body', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            expect(callback).to.not.have.been.called();
            const element = new TestElement();
            element.title = 'Test';
            element.description = 'Test';
            element.author = 'Test';
            wrapper.appendChild(element);
            expect(callback).to.have.been.called.exactly(4);
            expect(element.innerHTML).to.be.equal('<div>Test</div><div>Test</div><div>Test</div><div>Test</div><div>0</div>');
        });

        it('should NOT handle property if nothing changed on assignment', () => {
            const propertyChangedCallback = spy();

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

            __decorate([
                DNA.property({ type: [String] }),
            ], TestElement.prototype, 'title', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            expect(propertyChangedCallback).to.not.have.been.called();
            element.title = 'test';
            expect(propertyChangedCallback).to.have.been.called();
            expect(propertyChangedCallback).to.have.been.called.with('title', '', 'test');
            element.title = 'test';
            expect(propertyChangedCallback).to.have.been.called.once;
        });

        it('should dispatch custom event', () => {
            const callback1 = spy();
            const callback2 = spy();

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

            __decorate([
                DNA.property({ event: 'titleupdate' }),
            ], TestElement.prototype, 'title', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);

            const element = new TestElement();
            element.addEventListener('agechange', (event) => callback1(event.type, event.detail.oldValue, event.detail.newValue));
            element.addEventListener('titleupdate', (event) => callback2(event.type, event.detail.oldValue, event.detail.newValue));
            expect(callback1).to.not.have.been.called();
            expect(callback2).to.not.have.been.called();
            element.age = 25;
            expect(callback1).to.have.been.called();
            expect(callback2).to.not.have.been.called();
            expect(callback1).to.have.been.called.with('agechange', 20, 25);
            element.title = 'Test';
            expect(callback2).to.have.been.called();
            expect(callback2).to.have.been.called.with('titleupdate', '', 'Test');
        });
    });

    describe('#textContent', () => {
        it('should retrieve whole textContent', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot></slot> inner text
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            element.textContent = 'Test';
            expect(element.textContent).to.be.equal('Test inner text');
        });

        it('should set slot text using textContent setter', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot></slot>
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            element.textContent = 'Test';

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].textContent).to.be.equal('Test');
            realm.dangerouslyClose();
        });
    });

    describe('#innerHTML', () => {
        it('should retrieve whole innerHTML', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot></slot> inner text
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            element.innerHTML = '<span>Test</span>';

            expect(element.innerHTML.indexOf('<div>')).to.be.equal(0);
            expect(element.innerHTML.indexOf('<span>Test</span>')).to.not.be.equal(-1);
        });

        it('should set slot text using innerHTML setter', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot></slot>
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            element.innerHTML = '<span>Test</span>';

            realm.dangerouslyOpen();
            expect(element.children).to.have.lengthOf(1);
            expect(element.children[0].tagName).to.be.equal('DIV');
            expect(element.children[0].children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].children[0].textContent).to.be.equal('Test');
            realm.dangerouslyClose();
        });
    });

    describe('#appendChild', () => {
        it('should append and connect child', () => {
            const connectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            element.appendChild(child);
            expect(connectedCallback).to.have.been.called();
            element.appendChild(child);
            expect(connectedCallback).to.have.been.called.once;
        });

        it('should move and connect a child from a parent', () => {
            const connectedCallback = spy();
            const disconnectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            expect(disconnectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            wrapper.appendChild(child);
            expect(connectedCallback).to.have.been.called();
            expect(disconnectedCallback).to.not.have.been.called();
            element.appendChild(child);
            expect(connectedCallback).to.have.been.called.twice;
            expect(disconnectedCallback).to.have.been.called();
        });

        it('should render default slot', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot>
                            <span>Test</span>
                        </slot>
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            wrapper.appendChild(element);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
            expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Test');
            realm.dangerouslyClose();
        });

        it('should append slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot>
                            <span>Test</span>
                        </slot>
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            const span = document.createElement('span');
            wrapper.appendChild(element);
            element.appendChild(span);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
            realm.dangerouslyClose();
        });
    });

    describe('#removeChild', () => {
        it('should remove and disconnect a child', () => {
            const disconnectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(disconnectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            element.appendChild(child);
            expect(disconnectedCallback).to.not.have.been.called();
            element.removeChild(child);
            expect(disconnectedCallback).to.have.been.called();
        });

        it('should remove slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            const span = document.createElement('span');
            wrapper.appendChild(element);
            element.appendChild(span);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
            realm.dangerouslyClose();

            element.removeChild(span);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes).to.have.lengthOf(0);
            realm.dangerouslyClose();
        });
    });

    describe('#insertBefore', () => {
        it('should insert and connect a child before another', () => {
            const connectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            element.appendChild(child1);
            element.insertBefore(child2, child1);
            expect(connectedCallback).to.have.been.called.twice;
            element.insertBefore(child2, child1);
            expect(element.slotChildNodes.length).to.be.equal(2);
        });

        it('should insert and connect a child (and remove it from the previous parent) before another', () => {
            const connectedCallback = spy();
            const disconnectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            expect(disconnectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            wrapper.appendChild(child2);
            element.appendChild(child1);
            element.insertBefore(child2, child1);
            expect(connectedCallback).to.have.been.called.exactly(3);
            expect(disconnectedCallback).to.have.been.called.once;
        });

        it('should insert slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            const span = document.createElement('span');
            const input = document.createElement('input');
            wrapper.appendChild(element);
            element.appendChild(span);
            element.insertBefore(input, span);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('INPUT');
            expect(element.childNodes[0].childNodes[1].tagName).to.be.equal('SPAN');
            realm.dangerouslyClose();
        });
    });

    describe('#replaceChild', () => {
        it('should reaplce and connect child in a parent', () => {
            const connectedCallback = spy();
            const disconnectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            expect(disconnectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            element.appendChild(child1);
            element.replaceChild(child2, child1);
            expect(connectedCallback).to.have.been.called.twice;
            expect(disconnectedCallback).to.have.been.called.once;
        });

        it('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
            const connectedCallback = spy();
            const disconnectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            expect(disconnectedCallback).to.not.have.been.called();

            wrapper.appendChild(element);
            wrapper.appendChild(child2);
            element.appendChild(child1);
            element.replaceChild(child2, child1);
            expect(connectedCallback).to.have.been.called.exactly(3);
            expect(disconnectedCallback).to.have.been.called.exactly(2);
        });

        it('should replace slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            const span = document.createElement('span');
            const input = document.createElement('input');
            wrapper.appendChild(element);
            element.appendChild(span);
            element.replaceChild(input, span);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('INPUT');
            realm.dangerouslyClose();
        });
    });

    describe('#insertAdjacentElement', () => {
        it('should insert and connect a child at first position', () => {
            const connectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            element.appendChild(child1);
            element.insertAdjacentElement('afterbegin', child2);
            expect(connectedCallback).to.have.been.called.twice;
            element.insertBefore(child2, child1);
            expect(element.slotChildNodes.length).to.be.equal(2);
        });

        it('should insert and connect a child (and remove it from the previous parent) at last position', () => {
            const connectedCallback = spy();
            const disconnectedCallback = spy();

            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback).to.not.have.been.called();
            expect(disconnectedCallback).to.not.have.been.called();
            wrapper.appendChild(element);
            wrapper.appendChild(child2);
            element.appendChild(child1);
            element.insertAdjacentElement('beforeend', child2);
            expect(connectedCallback).to.have.been.called.exactly(3);
            expect(disconnectedCallback).to.have.been.called.once;
        });

        it('should insert slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const realm = element.realm;
            const span = document.createElement('span');
            const input = document.createElement('input');
            wrapper.appendChild(element);
            element.appendChild(span);
            element.insertAdjacentElement('afterbegin', input);

            realm.dangerouslyOpen();
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('INPUT');
            expect(element.childNodes[0].childNodes[1].tagName).to.be.equal('SPAN');
            realm.dangerouslyClose();
        });
    });

    describe('attributes', () => {
        let element, TestElement;

        before(() => {
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

            __decorate([
                DNA.property(),
            ], TestElement.prototype, 'title', undefined);
            __decorate([
                DNA.property({ attribute: 'alias' }),
            ], TestElement.prototype, 'test', undefined);
            TestElement = __decorate([
                DNA.customElement(getComponentName()),
            ], TestElement);
        });

        beforeEach(() => {
            element = new TestElement();
            element.title = 'DNA';
            element.age = 42;
        });

        describe('#getAttribute', () => {
            it('should get an empty attribute', () => {
                expect(element.getAttribute('missing')).to.be.null;
            });

            it('should get a string attribute', () => {
                expect(element.getAttribute('title')).to.be.equal('DNA');
            });

            it('should get a numeric attribute', () => {
                expect(element.getAttribute('age')).to.be.equal('42');
            });
        });

        describe('#setAttribute', () => {
            it('should set an attribute', () => {
                element.setAttribute('missing', 'DNA');
                expect(element.getAttribute('missing')).to.be.equal('DNA');
            });

            it('should set a string attribute and update the property', () => {
                element.setAttribute('title', 'WebComponents');
                expect(element.title).to.be.equal('WebComponents');
            });

            it('should set a string attribute and update the aliased property', () => {
                element.setAttribute('alias', 'WebComponents');
                expect(element.test).to.be.equal('WebComponents');
            });
        });

        describe('#hasAttribute', () => {
            it('should return `true` if element has an attribute', () => {
                expect(element.hasAttribute('title')).to.be.true;
            });

            it('should return `false` if element has an attribute', () => {
                expect(element.hasAttribute('missing')).to.be.false;
            });
        });

        describe('#removeAttribute', () => {
            it('should remove an attribute', () => {
                element.removeAttribute('title');
                expect(element.hasAttribute('title')).to.be.false;
            });

            it('should remove a string attribute and update the property', () => {
                element.removeAttribute('title');
                expect(element.title).to.be.null;
            });

            it('should remove a numeric attribute and update the property', () => {
                element.removeAttribute('age');
                expect(element.age).to.be.null;
            });
        });
    });
});
