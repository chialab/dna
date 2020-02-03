import { getModule } from './helpers.js';

let DNA, wrapper;

describe('property', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
        wrapper = DNA.DOM.createElement('div');
    });

    describe('#defineProperty', () => {
        it.skip('should define a property to an element', () => {
            //
        });

        it.skip('should define a property with a defaultValue to an element', () => {
            //
        });

        it.skip('should define a property with type checker to an element', () => {
            //
        });

        it.skip('should define a property with custom validation to an element', () => {
            //
        });

        it.skip('should define a property with custom getter to an element', () => {
            //
        });

        it.skip('should define a property with custom setter to an element', () => {
            //
        });

        it.skip('should define a property with a single observer to an element', () => {
            //
        });

        it.skip('should define a property with multiple observers to an element', () => {
            //
        });
    });

    describe('#getProperties', () => {
        it.skip('should retrieve all properties of an element', () => {
            //
        });
    });

    describe('#property', () => {
        it.skip('should define a property using the descriptor', () => {
            //
        });
    });
});
