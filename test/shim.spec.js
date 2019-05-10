/* eslint-env mocha */
import { getModule } from './module.js';

describe('shim', () => {
    const { shim } = getModule();

    it('should create class shim', () => {
        const TestObject = class extends Object { };
        const ShimTestObject = shim(TestObject);

        expect(ShimTestObject).to.not.equal(TestObject);
        expect(new ShimTestObject).to.be.an.instanceof(TestObject);
    });
});
