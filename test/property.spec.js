import { spyFunction, getComponentName } from './helpers.js';
import * as DNA from '@chialab/dna';

describe('property', function() {
    this.timeout(10 * 1000);

    describe('@property', () => {
        it('should define a property', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property() testProp = undefined;
            }

            expect(new MyElement()).to.have.property('testProp', undefined);
        });

        it('should define a property with a defaultValue', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property() testProp = 42;
            }

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
        });

        it('should define a property with single type checker', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    type: String,
                })
                testProp = undefined;
            }

            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with multiple type checkers', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    type: [String, Boolean],
                })
                testProp = undefined;
            }

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with custom validation', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    type: [String, Boolean],
                    validate(value) {
                        if (typeof value === 'string') {
                            return value !== 'invalid';
                        }

                        return true;
                    },
                })
                testProp = undefined;
            }

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
            expect(() => new MyElement({ testProp: 'invalid' })).to.throw(TypeError);
        });

        it('should define a property with custom getter', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    getter(value) {
                        return value * 2;
                    },
                })
                testProp = 42;
            }

            expect(new MyElement()).to.have.property('testProp', 84);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 4);
        });

        it('should define a property with custom setter', () => {
            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    setter(value) {
                        return value / 2;
                    },
                })
                testProp = 42;
            }

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 1);
        });

        it('should define a property with a single observer', () => {
            const listener = spyFunction((...args) => args);

            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    observe: listener,
                })
                testProp = 42;
            }

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.deep.equal([42, 84]);
        });

        it('should define a property with multiple observers', () => {
            const listener1 = spyFunction((...args) => args);
            const listener2 = spyFunction((...args) => args);

            @DNA.customElement(getComponentName())
            class MyElement extends DNA.Component {
                @DNA.property({
                    observers: [listener1, listener2],
                })
                testProp = 42;
            }

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
            class BaseElement extends DNA.Component {
                @DNA.property({
                    type: String,
                }) inherit;
                @DNA.property() override = 42;
            }

            @DNA.customElement(getComponentName())
            class MyElement extends BaseElement {
                @DNA.property() override = 84;
                @DNA.property() newProp = true;
            }

            @DNA.customElement(getComponentName())
            class MyElement2 extends BaseElement {
                @DNA.property() newProp = false;
            }

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
