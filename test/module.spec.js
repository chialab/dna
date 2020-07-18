import { getModule } from './helpers.js';

let DNA;

describe('module', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    const EXPECTED_EXPORT_MAP = {
        window: 'object',
        customElements: 'object',
        CustomElementRegistry: 'function',
        DOM: 'object',
        connect: 'function',
        disconnect: 'function',
        extend: 'function',
        render: 'function',
        Fragment: 'symbol',
        h: 'function',
        html: 'function',
        css: 'function',
        delegateEventListener: 'function',
        undelegateEventListener: 'function',
        dispatchEvent: 'function',
        dispatchAsyncEvent: 'function',
        property: 'function',
        Component: 'function',
        until: 'function',
    };

    for (let ref in EXPECTED_EXPORT_MAP) {
        it(`should export "${ref}"`, () => {
            if (ref === 'window') {
                expect(DNA).to.have.property(ref);
            } else {
                expect(DNA[ref]).to.be.a(EXPECTED_EXPORT_MAP[ref]);
            }
        });
    }

    it('should not export other references', () => {
        const actual = Object.keys(DNA).sort();
        // default export may be added by the bundler, ignore it.
        if (actual.indexOf('default') !== -1) {
            actual.splice(actual.indexOf('default'), 1);
        }
        const expected = Object.keys(EXPECTED_EXPORT_MAP).sort();
        expect(actual).to.deep.equal(expected);
    });
});
