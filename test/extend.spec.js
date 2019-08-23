/* eslint-env mocha */
import { getModule } from './helpers.js';

let DNA;

describe('extend', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    it('should create a base class starting from anchor', () => {
        const BaseClass = DNA.extend('a');
        const TestClass = class extends BaseClass {};
        expect(TestClass).to.not.equal(BaseClass);
        expect(TestClass.prototype).to.be.an.instanceof(BaseClass);
        expect('href' in TestClass.prototype).to.be.true;
    });
});
