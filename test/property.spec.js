import { getModule, spyFunction, getComponentName } from './helpers.js';

let DNA;

describe('property', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('@property', () => {
        it('should define a property', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property() testProp = undefined;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', undefined);
        });

        it('should define a property with a defaultValue', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property() testProp = 42;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
        });

        it('should define a property with single type checker', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    types: String,
                })
                testProp = undefined;
            };

            DNA.define(getComponentName(), MyElement);

            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with multiple type checkers', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    types: [String, Boolean],
                })
                testProp = undefined;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with custom validation', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    types: [String, Boolean],
                    validate(value) {
                        if (typeof value === 'string') {
                            return value !== 'invalid';
                        }

                        return true;
                    },
                })
                testProp = undefined;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
            expect(() => new MyElement({ testProp: 'invalid' })).to.throw(TypeError);
        });

        it('should define a property with custom getter', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    getter(value) {
                        return value * 2;
                    },
                })
                testProp = 42;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 84);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 4);
        });

        it('should define a property with custom setter', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    setter(value) {
                        return value / 2;
                    },
                })
                testProp = 42;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 1);
        });

        it('should define a property with a single observer', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    observe: listener,
                })
                testProp = 42;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.deep.equal([undefined, 84]);
        });

        it('should define a property with multiple observers', () => {
            const listener1 = spyFunction((...args) => args);
            const listener2 = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    observers: [listener1, listener2],
                })
                testProp = 42;
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener1.invoked).to.be.true;
            expect(listener1.response).to.be.deep.equal([undefined, 84]);
            expect(listener2.invoked).to.be.true;
            expect(listener2.response).to.be.deep.equal([undefined, 84]);
        });
    });

    describe('get properties()', () => {
        it('should define a property', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: String,
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', undefined);
        });

        it('should define a property with a defaultValue', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
        });

        it('should define a property with single type checker', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            types: String,
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with multiple type checkers', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            types: [String, Boolean],
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with custom validation', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            types: [String, Boolean],
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

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement({ testProp: 'string' })).to.have.property('testProp', 'string');
            expect(new MyElement({ testProp: true })).to.have.property('testProp', true);
            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
            expect(() => new MyElement({ testProp: 'invalid' })).to.throw(TypeError);
        });

        it('should define a property with custom getter', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
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

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 84);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 4);
        });

        it('should define a property with custom setter', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
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

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(new MyElement({ testProp: 2 })).to.have.property('testProp', 1);
        });

        it('should define a property with a single observer', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                            observe: listener,
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.deep.equal([undefined, 84]);
        });

        it('should define a property with multiple observers', () => {
            const listener1 = spyFunction((...args) => args);
            const listener2 = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                            observers: [listener1, listener2],
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

            expect(new MyElement()).to.have.property('testProp', 42);
            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.false;
            expect(new MyElement({ testProp: 84 })).to.have.property('testProp', 84);
            expect(listener1.invoked).to.be.true;
            expect(listener1.response).to.be.deep.equal([undefined, 84]);
            expect(listener2.invoked).to.be.true;
            expect(listener2.response).to.be.deep.equal([undefined, 84]);
        });
    });

    describe('#observe', () => {
        it('should observe property changes', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

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

            DNA.define(getComponentName(), MyElement);

            const element = new MyElement();
            expect(() => element.observe('testProp', listener)).to.throw(Error, 'missing property testProp');
        });
    });

    describe('#unobserve', () => {
        it('should unobserve property changes', () => {
            const listener = spyFunction((...args) => args);
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: {
                            defaultValue: 42,
                        },
                    };
                }
            };

            DNA.define(getComponentName(), MyElement);

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

            DNA.define(getComponentName(), MyElement);

            const element = new MyElement();
            expect(() => element.unobserve('testProp', listener)).to.throw(Error, 'missing property testProp');
        });
    });
});
