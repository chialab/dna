import * as DNA from '@chialab/dna/compat.js';
import * as DNA_OLD from '@dnajs/idom';

describe('[Compat] module', function() {
    this.timeout(10 * 1000);

    const EXPECTED_EXPORT_MAP = {
        window: 'object',
        customElements: 'object',
        CustomElementRegistry: 'function',
        DOM: 'object',
        connect: 'function',
        disconnect: 'function',
        extend: 'function',
        render: 'function',
        get: 'function',
        define: 'function',
        whenDefined: 'function',
        upgrade: 'function',
        Fragment: 'function',
        h: 'function',
        html: 'function',
        template: 'function',
        css: 'function',
        interpolate: 'function',
        delegateEventListener: 'function',
        undelegateEventListener: 'function',
        dispatchEvent: 'function',
        dispatchAsyncEvent: 'function',
        property: 'function',
        isComponent: 'function',
        Component: 'function',
        // COMPAT
        namespace: 'object',
        registry: 'object',
        DNA_SYMBOL: 'symbol',
        COMPONENT_SYMBOL: 'symbol',
        NODE_SYMBOL: 'symbol',
        CONNECTED_SYMBOL: 'symbol',
        STYLE_SYMBOL: 'symbol',
        MIXINS: 'object',
        IDOM: 'object',
        IDOMMixin: 'function',
        mixin: 'function',
        BaseComponent: 'function',
        trust: 'function',
        prop: 'function',
        bootstrap: 'function',
        mix: 'function',
        proxy: 'function',
        scopeStyle: 'function',
    };

    for (let ref in EXPECTED_EXPORT_MAP) {
        it(`should export "${ref}"`, () => {
            if (ref === 'namespace' || ref === 'window') {
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

    it('should export all 2.x references', () => {
        for (let ref in DNA_OLD) {
            expect(DNA).to.have.property(ref);
            if (Object.prototype.toString.call(DNA_OLD[ref]) === '[object Object]' && ref !== 'namespace') {
                Object.keys(DNA_OLD[ref]).forEach((key) => {
                    expect(DNA[ref]).to.have.property(key);
                    expect(DNA[ref][key]).to.be.a(typeof DNA_OLD[ref][key]);
                });
            }
        }
    });
});
