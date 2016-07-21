import { getDescriptor, wrapDescriptorGet, wrapDescriptorSet } from '../src/helpers/descriptor.js';
import { camelToDash, dashToCamel } from '../src/helpers/strings.js';
import { register } from '../src/helpers/register.js';
import { DNAComponent } from '../src/dna-component.js';

/* globals describe, before, it, assert */
describe('Unit: Helpers', () => {
    describe('getDescriptor', () => {
        let obj = {
            get prop() {
                return true;
            },
            set prop(val) {
                return val * 2;
            },
        };
        let descriptor = getDescriptor(obj, 'prop');
        it('should get object descriptor for a property', () => {
            assert.equal(typeof descriptor.get, 'function');
            assert.equal(typeof descriptor.set, 'function');
            assert.equal(descriptor.get.call(obj), true);
            assert.equal(descriptor.set.call(obj, 2), 4);
        });
    });

    describe('wrapDescriptorGet', () => {
        it('should create a getter for a property', () => {
            let obj = {};
            let descriptor = getDescriptor(obj, 'prop') || {};
            let get = wrapDescriptorGet('prop', descriptor, true);
            assert.equal(get.call(obj), true);
        });

        it('should wrap a getter for a property', () => {
            let obj = {
                get className() {
                    return true;
                },
            };
            let descriptor = getDescriptor(obj, 'className') || {};
            let get = wrapDescriptorGet('className', descriptor);
            assert.equal(get.call(obj), true);
        });
    });

    describe('wrapDescriptorSet', () => {
        it('should create a setter for a property', () => {
            let obj = {};
            let descriptor = getDescriptor(obj, 'prop') || {};
            let newDescriptor = {
                get: wrapDescriptorGet('prop', descriptor),
                set: wrapDescriptorSet('prop', descriptor),
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
            let descriptor = getDescriptor(obj, 'prop') || {};
            let newDescriptor = {
                get: wrapDescriptorGet('prop', descriptor),
                set: wrapDescriptorSet('prop', descriptor),
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
            let descriptor = getDescriptor(obj, 'prop') || {};
            let check = {};
            let newDescriptor = {
                get: wrapDescriptorGet('prop', descriptor),
                set: wrapDescriptorSet('prop', descriptor, (prop, res) => {
                    check[prop] = res * 5;
                }),
            };
            Object.defineProperty(obj, 'prop', newDescriptor);
            obj.prop = 10;
            assert.equal(obj.prop, 20);
            assert.equal(check.prop, 100);
        });
    });

    describe('camelToDash', () => {
        it('should transform transform a camel case string to dashed case', () => {
            assert.equal(camelToDash('simple'), 'simple');
            assert.equal(camelToDash('Simple'), 'simple');
            assert.equal(camelToDash('SimpleString'), 'simple-string');
            assert.equal(camelToDash('Simple String'), 'simple-string');
        });
    });

    describe('dashToCamel', () => {
        it('should transform transform a dashed case string to camel case', () => {
            assert.equal(dashToCamel('simple'), 'simple');
            assert.equal(dashToCamel('simple-string'), 'simpleString');
            assert.equal(dashToCamel('simple-long-string'), 'simpleLongString');
        });
    });

    describe('register', () => {
        class TestComponent extends DNAComponent {
            constructor() {
                super();
                this.name = 'Alan';
                this.lastName = 'Turing';
            }
        }

        describe('a simple element', () => {
            const Test = register('test1-helper-component', TestComponent);

            it('should register a custom element', () => {
                let elem = new Test();
                assert.equal(elem.tagName.toLowerCase(), 'test1-helper-component');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });

        describe('a with extends field', () => {
            const Test = register('test1-helper-register-component', TestComponent, {
                extends: 'div',
            });

            it('should register a custom element with extends field', () => {
                let elem = new Test();
                assert.equal(elem.tagName.toLowerCase(), 'div');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });
    });
});
