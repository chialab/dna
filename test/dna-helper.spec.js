import DNAHelper from '../src/dna-helper.js';

/* globals describe, before, it, assert */
describe('Unit: DNAHelper', () => {
    describe('getDescriptor', () => {
        let obj = {
            get prop() {
                return true;
            },
            set prop(val) {
                return val * 2;
            },
        };
        let descriptor = DNAHelper.getDescriptor(obj, 'prop');
        it('should get object descriptor for a property', () => {
            assert.equal(typeof descriptor.get, 'function');
            assert.equal(typeof descriptor.set, 'function');
            assert.equal(descriptor.get.call(obj), true);
            assert.equal(descriptor.set.call(obj, 2), 4);
        });
    });

    describe('wrapDescriptorGet', () => {
        it('should create a getter for a property', () => {
            let obj = {
                __prop: true,
            };
            let descriptor = DNAHelper.getDescriptor(obj, 'prop') || {};
            let get = DNAHelper.wrapDescriptorGet('prop', descriptor);
            assert.equal(get.call(obj), true);
        });

        it('should wrap a getter for a property', () => {
            let obj = {
                get className() {
                    return true;
                },
            };
            let descriptor = DNAHelper.getDescriptor(obj, 'className') || {};
            let get = DNAHelper.wrapDescriptorGet('className', descriptor);
            assert.equal(get.call(obj), true);
        });
    });

    describe('wrapDescriptorSet', () => {
        it('should create a setter for a property', () => {
            let obj = {};
            let descriptor = DNAHelper.getDescriptor(obj, 'prop') || {};
            let newDescriptor = {
                get: DNAHelper.wrapDescriptorGet('prop', descriptor),
                set: DNAHelper.wrapDescriptorSet('prop', descriptor),
            };
            Object.defineProperty(obj, 'prop', newDescriptor);
            obj.prop = 5;
            assert.equal(obj.prop, 5);
        });

        it('should wrap a setter for a property', () => {
            let obj = {
                get prop() {
                    return this.__prop;
                },
                set prop(val) {
                    this.__prop = val * 2;
                    return this.prop;
                },
            };
            let descriptor = DNAHelper.getDescriptor(obj, 'prop') || {};
            let newDescriptor = {
                get: DNAHelper.wrapDescriptorGet('prop', descriptor),
                set: DNAHelper.wrapDescriptorSet('prop', descriptor),
            };
            Object.defineProperty(obj, 'prop', newDescriptor);
            obj.prop = 10;
            assert.equal(obj.prop, 20);
        });

        it('should wrap a setter for a property and trigger callback', () => {
            let obj = {
                get prop() {
                    return this.__prop;
                },
                set prop(val) {
                    this.__prop = val * 2;
                    return this.prop;
                },
            };
            let descriptor = DNAHelper.getDescriptor(obj, 'prop') || {};
            let check = {};
            let newDescriptor = {
                get: DNAHelper.wrapDescriptorGet('prop', descriptor),
                set: DNAHelper.wrapDescriptorSet('prop', descriptor, (prop, res) => {
                    check[prop] = res * 5;
                }),
            };
            Object.defineProperty(obj, 'prop', newDescriptor);
            obj.prop = 10;
            assert.equal(obj.prop, 20);
            assert.equal(check.prop, 100);
        });
    });

    describe('classToElement', () => {
        it('should transform function name to element tag', () => {
            assert.equal(DNAHelper.classToElement(
                    // eslint-disable-next-line
                    function namedFunction() {}
                ),
                'named-function'
            );
        });

        it('should transform function variable name to element tag', () => {
            let fn2 = () => {};
            assert.equal(DNAHelper.classToElement(fn2), 'fn2');
        });

        it('should return undefined element for anonymous function', () => {
            assert.equal(DNAHelper.classToElement(() => {}), undefined);
        });
    });

    describe('camelToDash', () => {
        it('should transform transform a camel case string to dashed case', () => {
            assert.equal(DNAHelper.camelToDash('simple'), 'simple');
            assert.equal(DNAHelper.camelToDash('Simple'), 'simple');
            assert.equal(DNAHelper.camelToDash('SimpleString'), 'simple-string');
            assert.equal(DNAHelper.camelToDash('Simple String'), 'simple-string');
        });
    });

    describe('dashToCamel', () => {
        it('should transform transform a dashed case string to camel case', () => {
            assert.equal(DNAHelper.dashToCamel('simple'), 'simple');
            assert.equal(DNAHelper.dashToCamel('simple-string'), 'simpleString');
            assert.equal(DNAHelper.dashToCamel('simple-long-string'), 'simpleLongString');
        });
    });

    describe('register', () => {
        class TestComponent extends HTMLElement {
            static get tagName() {
                return 'test1-helper-component';
            }

            createdCallback() {
                this.name = 'Alan';
                this.lastName = 'Turing';
            }
        }

        class Test2Component extends TestComponent {
            static get extends() {
                return 'div';
            }
        }

        describe('register simple element', () => {
            const Test1 = DNAHelper.register(TestComponent);

            const Test2 = DNAHelper.register('test2-helper-component', {
                prototype: TestComponent,
            });

            const Test3 = DNAHelper.register('test3-helper-component', TestComponent);

            const Test4 = DNAHelper.register('test4-helper-component', {
                prototype: TestComponent.prototype,
            });

            it('should register a custom element', () => {
                let elem1 = new Test1();
                let elem2 = new Test2();
                let elem3 = new Test3();
                let elem4 = new Test4();
                assert.equal(elem1.tagName.toLowerCase(), 'test1-helper-component');
                assert.equal(elem1.name, 'Alan');
                assert.equal(elem1.lastName, 'Turing');
                assert.equal(elem2.tagName.toLowerCase(), 'test2-helper-component');
                assert.equal(elem2.name, 'Alan');
                assert.equal(elem2.lastName, 'Turing');
                assert.equal(elem3.tagName.toLowerCase(), 'test3-helper-component');
                assert.equal(elem3.name, 'Alan');
                assert.equal(elem3.lastName, 'Turing');
                assert.equal(elem4.tagName.toLowerCase(), 'test4-helper-component');
                assert.equal(elem4.name, 'Alan');
                assert.equal(elem4.lastName, 'Turing');
            });
        });

        describe('register with extends field', () => {
            const Test1 = DNAHelper.register('test1-helper-register-component', {
                prototype: Test2Component,
                extends: 'div',
            });

            const Test2 = DNAHelper.register('test2-helper-register-component', {
                prototype: Test2Component,
            });

            it('should register a custom element with extends field', () => {
                let elem1 = new Test1();
                let elem2 = new Test2();
                assert.equal(elem1.tagName.toLowerCase(), 'div');
                assert.equal(elem1.name, 'Alan');
                assert.equal(elem1.lastName, 'Turing');
                assert.equal(elem2.tagName.toLowerCase(), 'div');
                assert.equal(elem2.name, 'Alan');
                assert.equal(elem2.lastName, 'Turing');
            });
        });
    });
});
