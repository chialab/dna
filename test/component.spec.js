// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import _decorate from '@babel/runtime/helpers/decorate';
import { expect } from '@esm-bundle/chai/esm/chai.js';
import { spyFunction, getComponentName } from './helpers.spec.js';

describe('Component', function() {
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

    describe('#new', () => {
        it('should create a node', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.customElements.define(is, TestElement);

            const element = new TestElement();
            expect(element).to.be.an.instanceof(DNA.window.HTMLElement);
            expect(element.is).to.be.equal(is);
            expect(element.tagName).to.be.equal(is.toUpperCase());
        });

        it('should extend a native node', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.customElements.define(is, TestElement, {
                extends: 'article',
            });

            const element = new TestElement();
            expect(element).to.be.an.instanceof(DNA.window.HTMLElement);
            expect(element.is).to.be.equal(is);
            expect(element.tagName).to.be.equal('ARTICLE');
        });

        it('should create a base class starting from the anchor base class', () => {
            const HTMLAnchorElement = DNA.extend(DNA.window.HTMLAnchorElement);
            class TestElement extends HTMLAnchorElement { }
            DNA.customElements.define(getComponentName(), TestElement, { extends: 'a' });
            const element = new TestElement();
            element.href = 'https://www.webcomponents.org/introduction';
            expect(TestElement).to.not.equal(DNA.window.HTMLAnchorElement);
            expect(element).to.be.an.instanceof(DNA.window.HTMLAnchorElement);
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
            let TestElement = class TestElement extends DNA.extend(DNA.Component) {
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
                DNA.customElement(getComponentName(), { extends: 'article' }),
            ], TestElement);

            const element = new TestElement();
            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.not.have.property('myCustomProp4');
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
            DNA.customElements.define(is, TestElement);
            DNA.customElements.upgrade(wrapper);
            expect(connected).to.be.true;
        });
    });

    describe('#connectedCallback|disconnectedCallback', () => {
        it('should connect on appendChild and disconnect on removeChild', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spyFunction();
                    this.spyDisconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyConnectedCallback.invoked).to.be.false;
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                DNA.DOM.appendChild(wrapper, element);
                expect(element.spyConnectedCallback.invoked).to.be.true;
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                DNA.DOM.removeChild(wrapper, element);
                expect(element.spyDisconnectedCallback.invoked).to.be.true;
            });
        });

        it('should connect on replaceChild', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spyFunction();
                    this.spyDisconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                const child = DNA.DOM.createElement('div');
                DNA.DOM.appendChild(wrapper, child);
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                expect(element.spyConnectedCallback.invoked).to.be.false;
                DNA.DOM.replaceChild(wrapper, element, child);
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                expect(element.spyConnectedCallback.invoked).to.be.true;
                DNA.DOM.replaceChild(wrapper, child, element);
                expect(element.spyDisconnectedCallback.invoked).to.be.true;
                expect(element.spyConnectedCallback.invoked).to.be.true;
                expect(element.spyDisconnectedCallback.count).to.be.equal(1);
                expect(element.spyConnectedCallback.count).to.be.equal(1);
            });
        });

        it('should connect on insertBefore', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spyFunction();
                    this.spyDisconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                const child = DNA.DOM.createElement('div');
                DNA.DOM.appendChild(wrapper, child);
                expect(element.spyConnectedCallback.invoked).to.be.false;
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                DNA.DOM.insertBefore(wrapper, element, child);
                expect(element.spyConnectedCallback.invoked).to.be.true;
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                DNA.DOM.insertBefore(wrapper, child, element);
                expect(element.spyConnectedCallback.invoked).to.be.true;
                expect(element.spyConnectedCallback.count).to.be.equal(1);
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
            });
        });

        it('should connect if not moved', () => {
            class TestElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.spyConnectedCallback = spyFunction();
                    this.spyDisconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyConnectedCallback.invoked).to.be.false;
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                DNA.DOM.appendChild(wrapper, element);
                expect(element.spyConnectedCallback.invoked).to.be.true;
                expect(element.spyDisconnectedCallback.invoked).to.be.false;
                DNA.DOM.appendChild(wrapper, element);
                expect(element.spyConnectedCallback.count).to.be.equal(2);
                expect(element.spyDisconnectedCallback.invoked).to.be.true;
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

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.innerHTML).to.be.equal('');
                DNA.DOM.appendChild(wrapper, element);
                expect(element.innerHTML).to.be.equal('<h1>test</h1>');
            });
        });
    });

    describe('~isConnected', () => {
        it('return `true` if element is connected', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.customElements.define(is, TestElement);

            const element = DNA.DOM.createElement(is);
            DNA.DOM.appendChild(wrapper, element);
            expect(element.isConnected).to.be.true;
        });

        it('return `false` if element is disconnected', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.customElements.define(is, TestElement);

            const element = DNA.DOM.createElement(is);
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
                    this.spyAttributeChangedCallback = spyFunction((name, old, value) => [name, old, value]);
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    this.spyAttributeChangedCallback(...args);
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyAttributeChangedCallback.invoked).to.be.false;
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback.invoked).to.be.true;
                expect(element.spyAttributeChangedCallback.response).to.be.deep.equal(['title', null, 'test']);
                element.setAttribute('title', 'test2');
                expect(element.spyAttributeChangedCallback.response).to.be.deep.equal(['title', 'test', 'test2']);
            });
        });

        it('should handle attribute changes on removeAttribute', () => {
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                constructor(...args) {
                    super(...args);
                    this.spyAttributeChangedCallback = spyFunction((name, old, value) => [name, old, value]);
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    this.spyAttributeChangedCallback(...args);
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyAttributeChangedCallback.invoked).to.be.false;
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback.invoked).to.be.true;
                expect(element.spyAttributeChangedCallback.response).to.be.deep.equal(['title', null, 'test']);
                element.removeAttribute('title');
                expect(element.spyAttributeChangedCallback.response).to.be.deep.equal(['title', 'test', null]);
            });
        });

        it('should handle attribute if nothing changed on setAttribute', () => {
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                constructor(...args) {
                    super(...args);
                    this.spyAttributeChangedCallback = spyFunction((name, old, value) => [name, old, value]);
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    this.spyAttributeChangedCallback(...args);
                }
            }

            class TestElement1 extends TestElement {}
            class TestElement2 extends TestElement {}

            DNA.customElements.define(getComponentName(), TestElement1);
            DNA.customElements.define(getComponentName(), TestElement2, {
                extends: 'article',
            });

            [
                new TestElement1(),
                new TestElement2(),
            ].forEach((element) => {
                expect(element.spyAttributeChangedCallback.invoked).to.be.false;
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback.invoked).to.be.true;
                expect(element.spyAttributeChangedCallback.response).to.be.deep.equal(['title', null, 'test']);
                element.setAttribute('title', 'test');
                expect(element.spyAttributeChangedCallback.count).to.be.equal(2);
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
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);

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
            expect(propertyChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            element.title = 'test2';
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', 'test', 'test2']);
            element.age = 42;
            expect(propertyChangedCallback.response).to.be.deep.equal(['age', undefined, 42]);
            element.setAttribute('title', 'test');
            expect(propertyChangedCallback.count).to.be.equal(3);
        });

        it('should handle state property changes on assignment', () => {
            const stateChangedCallback = spyFunction((name, old, value) => [name, old, value]);

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
            expect(stateChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(stateChangedCallback.invoked).to.be.true;
            expect(stateChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            element.title = 'test2';
            expect(stateChangedCallback.response).to.be.deep.equal(['title', 'test', 'test2']);
            element.age = 42;
            expect(stateChangedCallback.response).to.be.deep.equal(['age', undefined, 42]);
            element.setAttribute('title', 'test');
            expect(stateChangedCallback.count).to.be.equal(3);
        });

        it('should not loop on connection assignement', async () => {
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);
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
            DNA.customElements.define(name, TestElement, {
                extends: 'section',
            });
            DNA.customElements.upgrade(element);

            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['page', 1, 2]);
            expect(propertyChangedCallback.count).to.be.equal(2);
        });

        it('should NOT handle property changes on delete', () => {
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);

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
            expect(propertyChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            delete element.title;
            expect(propertyChangedCallback.count).to.be.equal(1);
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
            DNA.DOM.appendChild(wrapper, element);
            expect(element.innerHTML).to.be.equal('<h1></h1>');
            element.title = 'test';
            expect(element.innerHTML).to.be.equal('<h1>test</h1>');
        });

        it('should render only once after construction', () => {
            const callback = spyFunction();

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

            expect(callback.invoked).to.be.false;
            const element = new TestElement({
                title: 'Test',
                description: 'Test',
                author: 'Test',
            });
            DNA.DOM.appendChild(wrapper, element);
            expect(callback.invoked).to.be.true;
            expect(callback.count).to.be.equal(1);
            expect(element.innerHTML).to.be.equal('<div>Test</div><div>Test</div><div>Test</div><div>Test</div><div>0</div>');
        });

        it('should NOT handle property if nothing changed on assignment', () => {
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);

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
            expect(propertyChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            element.title = 'test';
            expect(propertyChangedCallback.count).to.be.equal(1);
        });

        it('should dispatch custom event', () => {
            const callback1 = spyFunction((event) => event);
            const callback2 = spyFunction((event) => event);

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
            element.addEventListener('agechange', callback1);
            element.addEventListener('titleupdate', callback2);
            expect(callback1.invoked).to.be.false;
            expect(callback2.invoked).to.be.false;
            element.age = 25;
            expect(callback1.invoked).to.be.true;
            expect(callback1.response.type).to.be.equal('agechange');
            expect(callback1.response.detail.oldValue).to.be.equal(20);
            expect(callback1.response.detail.newValue).to.be.equal(25);
            element.title = 'Test';
            expect(callback2.invoked).to.be.true;
            expect(callback2.response.type).to.be.equal('titleupdate');
            expect(callback2.response.detail.oldValue).to.be.equal('');
            expect(callback2.response.detail.newValue).to.be.equal('Test');
        });
    });

    describe('#appendChild', () => {
        it('should append and connect child', () => {
            const connectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child);
            expect(connectedCallback.invoked).to.be.true;
            element.appendChild(child);
            expect(element.slotChildNodes.length).to.be.equal(1);
        });

        it('should move and connect a child from a parent', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child);
            expect(connectedCallback.invoked).to.be.true;
            expect(disconnectedCallback.invoked).to.be.false;
            element.appendChild(child);
            expect(connectedCallback.count).to.be.equal(2);
            expect(disconnectedCallback.invoked).to.be.true;
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
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
            expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Test');
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
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            const span = DNA.DOM.createElement('span');
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(span);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
        });
    });

    describe('#removeChild', () => {
        it('should remove and disconnect a child', () => {
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child);
            expect(disconnectedCallback.invoked).to.be.false;
            element.removeChild(child);
            expect(disconnectedCallback.invoked).to.be.true;
        });

        it('should remove slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            const span = DNA.DOM.createElement('span');
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(span);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
            element.removeChild(span);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes).to.have.lengthOf(0);
        });
    });

    describe('#insertBefore', () => {
        it('should insert and connect a child before another', () => {
            const connectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child1);
            element.insertBefore(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(2);
            element.insertBefore(child2, child1);
            expect(element.slotChildNodes.length).to.be.equal(2);
        });

        it('should insert and connect a child (and remove it from the previous parent) before another', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child2);
            element.appendChild(child1);
            element.insertBefore(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(3);
            expect(disconnectedCallback.count).to.be.equal(1);
        });

        it('should insert slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            const span = DNA.DOM.createElement('span');
            const input = DNA.DOM.createElement('input');
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(span);
            element.insertBefore(input, span);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('INPUT');
            expect(element.childNodes[0].childNodes[1].tagName).to.be.equal('SPAN');
        });
    });

    describe('#replaceChild', () => {
        it('should reaplce and connect child in a parent', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child1);
            element.replaceChild(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(2);
            expect(disconnectedCallback.count).to.be.equal(1);
        });

        it('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child2);
            element.appendChild(child1);
            element.replaceChild(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(3);
            expect(disconnectedCallback.count).to.be.equal(2);
        });

        it('should replace slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            const span = DNA.DOM.createElement('span');
            const input = DNA.DOM.createElement('input');
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(span);
            element.replaceChild(input, span);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('INPUT');
        });
    });

    describe('#insertAdjacentElement', () => {
        it('should insert and connect a child at first position', () => {
            const connectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child1);
            element.insertAdjacentElement('afterbegin', child2);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(2);
            element.insertBefore(child2, child1);
            expect(element.slotChildNodes.length).to.be.equal(2);
        });

        it('should insert and connect a child (and remove it from the previous parent) at last position', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
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

            DNA.customElements.define(getComponentName(), TestElement);
            DNA.customElements.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child2);
            element.appendChild(child1);
            element.insertAdjacentElement('beforeend', child2);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(3);
            expect(disconnectedCallback.count).to.be.equal(1);
        });

        it('should insert slot item', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<div>
                        <slot />
                    </div>`;
                }
            }
            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            const span = DNA.DOM.createElement('span');
            const input = DNA.DOM.createElement('input');
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(span);
            element.insertAdjacentElement('afterbegin', input);
            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('DIV');
            expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('INPUT');
            expect(element.childNodes[0].childNodes[1].tagName).to.be.equal('SPAN');
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
            element = new TestElement({
                title: 'DNA',
                age: 42,
            });
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
