/* eslint-env mocha */
import { getModule } from './helpers.js';

let DNA;

describe('module', () => {
    before(async () => {
        DNA = await getModule();
    });

    const EXPECTED_EXPORT_MAP = {
        DOM: 'object',
        shim: 'function',
        render: 'function',
        get: 'function',
        define: 'function',
        whenDefined: 'function',
        upgrade: 'function',
        Fragment: 'function',
        h: 'function',
        html: 'function',
        css: 'function',
        compile: 'function',
        property: 'function',
        delegate: 'function',
        undelegate: 'function',
        dispatchEvent: 'function',
        Component: 'function',
    };

    for (let ref in EXPECTED_EXPORT_MAP) {
        it(`should export "${ref}"`, () => {
            expect(DNA[ref]).to.be.a(EXPECTED_EXPORT_MAP[ref]);
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
