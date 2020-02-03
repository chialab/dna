import { getModule } from './helpers.js';

let DNA;

describe('interpolate', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#compile', () => {
        it('should compile a simple string', () => {
            const fn = DNA.compile('hello');
            expect(fn).to.be.a('function');
            expect(fn.call(null)).to.be.equal('hello');
        });

        it('should compile a string with interpolation', () => {
            const fn = DNA.compile('hello {{name}}! do you like {{food}}?');
            expect(fn).to.be.a('function');
            expect(() => fn.call({ name: 'Snow White' })).to.throw(ReferenceError);
            expect(fn.call({ name: 'Snow White', food: 'apples' })).to.be.equal('hello Snow White! do you like apples?');
        });
    });
});
