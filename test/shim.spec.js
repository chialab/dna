/* eslint-env mocha */
import { getModule } from './module.js';

describe('shim', () => {
    it('should create class shim', async () => {
        const { shim } = await getModule();
        const TestObject = class extends Object { };
        const ShimTestObject = shim(TestObject);

        expect(ShimTestObject).to.not.equal(TestObject);
        expect(new ShimTestObject).to.be.an.instanceof(TestObject);
    });
});
