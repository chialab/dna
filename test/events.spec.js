import { getModule, spyFunction } from './helpers.js';

let DNA;

describe.skip('events', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#listenersGetter', () => {
        it('should add a listener', () => {
            //
        });

        it('should add a delegated listener', () => {
            //
        });
    });

    describe('#listenerDecorator', () => {
        it('should add a listener', () => {
            //
        });

        it('should add a delegated listener', () => {
            //
        });
    });
});
