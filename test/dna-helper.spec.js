import { DNAHelper } from '../src/dna-helper.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNAHelper', () => {
    describe('Unit: DNAHelper > getDescriptor', () => {
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

    describe('Unit: DNAHelper > wrapDescriptorGet', () => {
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

    describe('Unit: DNAHelper > wrapDescriptorSet', () => {
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

    describe('Unit: DNAHelper > classToElement', () => {
        it('should transform function name to element tag', () => {
            assert.equal(DNAHelper.classToElement(
                // eslint-disable-next-line
                function namedFunction() {}),
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

    describe('Unit: DNAHelper > elementToClass', () => {
        it('should transform simple tag element to camel case function', () => {
            assert.equal(DNAHelper.elementToClass('simple'), 'Simple');
            assert.equal(DNAHelper.elementToClass('Simple'), 'Simple');
            assert.equal(DNAHelper.elementToClass('SIMPLE'), 'Simple');
        });

        it('should transform complex tag element to camel case function', () => {
            assert.equal(DNAHelper.elementToClass('simple-fn'), 'SimpleFn');
            assert.equal(DNAHelper.elementToClass('SIMPLE-fn'), 'SimpleFn');
            assert.equal(DNAHelper.elementToClass('SIMPLE-FN'), 'SimpleFn');
        });
    });

    describe('Unit: DNAHelper > camelToDash', () => {
        it('should transform transform a camel case string to dashed case', () => {
            assert.equal(DNAHelper.camelToDash('simple'), 'simple');
            assert.equal(DNAHelper.camelToDash('Simple'), 'simple');
            assert.equal(DNAHelper.camelToDash('SimpleString'), 'simple-string');
            assert.equal(DNAHelper.camelToDash('Simple String'), 'simple-string');
        });
    });

    describe('Unit: DNAHelper > dashToCamel', () => {
        it('should transform transform a dashed case string to camel case', () => {
            assert.equal(DNAHelper.dashToCamel('simple'), 'simple');
            assert.equal(DNAHelper.dashToCamel('simple-string'), 'simpleString');
            assert.equal(DNAHelper.dashToCamel('simple-long-string'), 'simpleLongString');
        });
    });
});
