// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { expect } from '@chialab/ginsenghino';

describe('module', function() {
    this.timeout(10 * 1000);

    const EXPECTED_EXPORT_MAP = {
        window: 'object',
        customElements: 'object',
        customElement: 'function',
        customElementPrototype: 'function',
        Node: 'function',
        HTMLElement: 'function',
        Event: 'function',
        CustomEvent: 'function',
        document: 'object',
        DOM: 'object',
        connect: 'function',
        disconnect: 'function',
        extend: 'function',
        render: 'function',
        Fragment: 'symbol',
        h: 'function',
        jsx: 'function',
        jsxDEV: 'function',
        jsxs: 'function',
        compile: 'function',
        html: 'function',
        css: 'function',
        defineListeners: 'function',
        delegateEventListener: 'function',
        undelegateEventListener: 'function',
        dispatchEvent: 'function',
        dispatchAsyncEvent: 'function',
        defineProperty: 'function',
        defineProperties: 'function',
        getProperty: 'function',
        getProperties: 'function',
        property: 'function',
        state: 'function',
        observe: 'function',
        listen: 'function',
        isComponent: 'function',
        isComponentConstructor: 'function',
        Component: 'function',
        parseDOM: 'function',
        until: 'function',
    };

    for (const ref in EXPECTED_EXPORT_MAP) {
        it(`should export "${ref}"`, () => {
            if ([
                'window',
                'document',
                'Node',
                'HTMLElement',
                'Event',
                'CustomEvent',
            ].indexOf(ref) !== -1) {
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
