import { __decorate } from 'tslib';
import * as DNA from '@chialab/dna';
import { expect } from '@esm-bundle/chai/esm/chai.js';
import { spyFunction, getComponentName } from './helpers.spec.js';

describe('property', function() {
    this.timeout(10 * 1000);

    describe('@property', () => {
        it('should define a property', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = undefined;
                }
            };

            __decorate([
                DNA.property(),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement()).to.have.property('testProp', undefined);
        });

        it('should define a property with a defaultValue', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = 42;
                }
            };

            __decorate([
                DNA.property(),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
        });

        it('should define a property with single type checker', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = undefined;
                }
            };

            __decorate([
                DNA.property({
                    type: String,
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with multiple type checkers', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = undefined;
                }
            };

            __decorate([
                DNA.property({
                    type: [String, Boolean],
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with custom validation', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = undefined;
                }
            };

            __decorate([
                DNA.property({
                    type: [String, Boolean],
                    validate(value) {
                        if (typeof value === 'string') {
                            return value !== 'invalid';
                        }

                        return true;
                    },
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
            expect(() => new MyElement({ testProp: 'invalid' })).to.throw(TypeError);
        });

        it('should define a property with custom getter', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = 42;
                }
            };

            __decorate([
                DNA.property({
                    getter(value) {
                        return value * 2;
                    },
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement()).to.have.property('testProp', 84);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 4);
        });

        it('should define a property with custom setter', () => {
            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = 42;
                }
            };

            __decorate([
                DNA.property({
                    attribute: false,
                    setter(value) {
                        return value / 2;
                    },
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 1);
        });

        it('should define a property with a single observer', () => {
            const listener = spyFunction((...args) => args);

            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = 42;
                }
            };

            __decorate([
                DNA.property({
                    observe: listener,
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.deep.equal([42, 84]);
        });

        it('should define a property with multiple observers', () => {
            const listener1 = spyFunction((...args) => args);
            const listener2 = spyFunction((...args) => args);

            let MyElement = class MyElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.testProp = 42;
                }
            };

            __decorate([
                DNA.property({
                    observers: [listener1, listener2],
                }),
            ], MyElement.prototype, 'testProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener1.invoked).to.be.true;
            expect(listener1.response).to.be.deep.equal([42, 84]);
            expect(listener2.invoked).to.be.true;
            expect(listener2.response).to.be.deep.equal([42, 84]);
        });
    });

    describe('properties getter', () => {
        it('should define a property', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: String,
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', undefined);
        });

        it('should define a property with a defaultValue', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
        });

        it('should define a property with single type checker', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            type: String,
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with multiple type checkers', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            type: [String, Boolean],
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with custom validation', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            type: [String, Boolean],
                            validate(value) {
                                if (typeof value === 'string') {
                                    return value !== 'invalid';
                                }

                                return true;
                            },
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
            expect(() => new MyElement({ testProp: 'invalid' })).to.throw(TypeError);
        });

        it('should define a property with custom getter', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                            getter(value) {
                                return value * 2;
                            },
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 84);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 4);
        });

        it('should define a property with custom setter', () => {
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            attribute: false,
                            defaultValue: 42,
                            setter(value) {
                                return value / 2;
                            },
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 1);
        });

        it('should define a property with a single observer', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                            observe: listener,
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.deep.equal([42, 84]);
        });

        it('should define a property with multiple observers', () => {
            const listener1 = spyFunction((...args) => args);
            const listener2 = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                            observers: [listener1, listener2],
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener1.invoked).to.be.true;
            expect(listener1.response).to.be.deep.equal([42, 84]);
            expect(listener2.invoked).to.be.true;
            expect(listener2.response).to.be.deep.equal([42, 84]);
        });

        it('should inherit and reduce the prototype chain', () => {
            class BaseElement extends DNA.Component {
                static get properties() {
                    return {
                        inherit: String,
                        override: {
                            defaultValue: 42,
                        },
                    };
                }
            }

            class MyElement extends BaseElement {
                static get properties() {
                    return {
                        override: {
                            defaultValue: 84,
                        },
                        newProp: {
                            defaultValue: true,
                        },
                    };
                }
            }
            DNA.customElements.define(getComponentName(), MyElement);

            class MyElement2 extends BaseElement {
                static get properties() {
                    return {
                        newProp: {
                            defaultValue: false,
                        },
                    };
                }
            }
            DNA.customElements.define(getComponentName(), MyElement2);

            const element = new MyElement();
            expect(element).to.have.property('inherit');
            expect(element).to.have.property('override', 84);
            expect(element).to.have.property('newProp', true);
            const element2 = new MyElement2();
            expect(element2).to.have.property('inherit');
            expect(element2).to.have.property('override', 42);
            expect(element2).to.have.property('newProp', false);
        });

        it('should inherit and reduce the prototype chain with decorator', () => {
            const BaseElement = class BaseElement extends DNA.Component {
                constructor(...args) {
                    super(...args);
                    this.override = 42;
                }
            };

            __decorate([
                DNA.property({
                    type: String,
                }),
            ], BaseElement.prototype, 'inherit', undefined);
            __decorate([
                DNA.property(),
            ], BaseElement.prototype, 'override', undefined);

            let MyElement = class MyElement extends BaseElement {
                constructor(...args) {
                    super(...args);
                    this.override = 84;
                    this.newProp = true;
                }
            };

            __decorate([
                DNA.property(),
            ], MyElement.prototype, 'override', undefined);
            __decorate([
                DNA.property(),
            ], MyElement.prototype, 'newProp', undefined);
            MyElement = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement);

            let MyElement2 = class MyElement2 extends BaseElement {
                constructor(...args) {
                    super(...args);
                    this.newProp = false;
                }
            };

            __decorate([
                DNA.property(),
            ], MyElement2.prototype, 'newProp', undefined);
            MyElement2 = __decorate([
                DNA.customElement(getComponentName()),
            ], MyElement2);

            const element = new MyElement();
            expect(element).to.have.property('inherit');
            expect(element).to.have.property('override', 84);
            expect(element).to.have.property('newProp', true);
            const element2 = new MyElement2();
            expect(element2).to.have.property('inherit');
            expect(element2).to.have.property('override', 42);
            expect(element2).to.have.property('newProp', false);
        });
    });

    describe('#observe', () => {
        it('should observe property changes', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            const element = new MyElement();
            expect(listener.invoked).to.be.false;
            element.testProp = 100;
            expect(listener.invoked).to.be.false;
            element.observe('testProp', listener);
            element.testProp = 84;
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.deep.equal([100, 84]);
        });

        it('should throw for undeclared properties', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {};

            DNA.customElements.define(getComponentName(), MyElement);

            const element = new MyElement();
            expect(() => element.observe('testProp', listener)).to.throw(Error, 'Missing property testProp');
        });
    });

    describe('#unobserve', () => {
        it('should unobserve property changes', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                static get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                        },
                    };
                }
            };

            DNA.customElements.define(getComponentName(), MyElement);

            const element = new MyElement();
            expect(listener.invoked).to.be.false;
            element.observe('testProp', listener);
            element.testProp = 84;
            expect(listener.invoked).to.be.true;
            element.unobserve('testProp', listener);
            element.testProp = 150;
            expect(listener.count).to.be.equal(1);
        });

        it('should throw for undeclared properties', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {};

            DNA.customElements.define(getComponentName(), MyElement);

            const element = new MyElement();
            expect(() => element.unobserve('testProp', listener)).to.throw(Error, 'Missing property testProp');
        });
    });
});
