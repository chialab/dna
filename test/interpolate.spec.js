import { getModule } from './helpers.js';

let DNA;

describe('interpolate', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#compile', () => {
        it('should compile a simple string', () => {
            const result = DNA.interpolate('hello');
            expect(result).to.be.a('string');
            expect(result).to.be.equal('hello');
        });

        it('should compile a string with interpolation', () => {
            expect(() => DNA.interpolate('hello {{name}}! do you like {{food}}?', { name: 'Snow White' })).to.throw(ReferenceError);
            const result = DNA.interpolate('hello {{name}}! do you like {{food}}?', { name: 'Snow White', food: 'apples' });
            expect(result).to.be.a('array');
            expect(result.join('')).to.be.equal('hello Snow White! do you like apples?');
        });
    });
});
