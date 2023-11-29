import * as DNA from '@chialab/dna';
import { describe, expect, it } from 'vitest';

describe(
    'module',
    () => {
        const EXPECTED_EXPORT_MAP = {
            customElement: 'function',
            define: 'function',
            HTML: 'object',
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
            $parse: 'function',
            $await: 'function',
            $until: 'function',
            $pipe: 'function',
        };

        for (const ref in EXPECTED_EXPORT_MAP) {
            it(`should export "${ref}"`, () => {
                expect(DNA[ref]).toBeTypeOf(EXPECTED_EXPORT_MAP[ref]);
            });
        }

        it('should not export other references', () => {
            const actual = Object.keys(DNA).sort();
            // default export may be added by the bundler, ignore it.
            if (actual.indexOf('default') !== -1) {
                actual.splice(actual.indexOf('default'), 1);
            }
            const expected = Object.keys(EXPECTED_EXPORT_MAP).sort();
            expect(actual).toStrictEqual(expected);
        });
    },
    10 * 1000
);
