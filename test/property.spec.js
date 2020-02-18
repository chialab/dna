import { getModule, spyFunction } from './helpers.js';

let DNA;

describe('property', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#propertiesGetter', () => {
        it('should define a property', () => {
            const MyElement = class extends DNA.Component {
                get properties() {
                    return {
                        testProp: String,
                    };
                }
            };

            DNA.define('test-component-prop1', MyElement);

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

            DNA.define('test-component-prop2', MyElement);

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

            DNA.define('test-component-prop3', MyElement);

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

            DNA.define('test-component-prop4', MyElement);

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

            DNA.define('test-component-prop5', MyElement);

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

            DNA.define('test-component-prop6', MyElement);

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

            DNA.define('test-component-prop7', MyElement);

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

            DNA.define('test-component-prop8', MyElement);

            // expect(new MyElement()).to.have.property('testProp', 42);
            // expect(listener.invoked).to.be.false;
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

            DNA.define('test-component-prop9', MyElement);

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

    describe('#propertyDecorator', () => {
        it('should define a property', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property() testProp = undefined;
            };

            DNA.define('test-component-prop10', MyElement);

            expect(new MyElement()).to.have.property('testProp', undefined);
        });

        it('should define a property with a defaultValue', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property() testProp = 42;
            };

            DNA.define('test-component-prop12', MyElement);

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

            DNA.define('test-component-prop13', MyElement);

            expect(() => new MyElement({ testProp: 42 })).to.throw(TypeError);
        });

        it('should define a property with multiple type checkers', () => {
            const MyElement = class extends DNA.Component {
                @DNA.property({
                    types: [String, Boolean],
                })
                testProp = undefined;
            };

            DNA.define('test-component-prop14', MyElement);

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

            DNA.define('test-component-prop15', MyElement);

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

            DNA.define('test-component-prop16', MyElement);

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

            DNA.define('test-component-prop17', MyElement);

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

            DNA.define('test-component-prop18', MyElement);

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

            DNA.define('test-component-prop19', MyElement);

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
});
