import * as DNA from '@chialab/dna';
import { describe, expect, it } from 'vitest';

describe(
    'module',
    () => {
        const EXPECTED_EXPORT_MAP = [
            [DNA.customElement, 'customElement', 'function'],
            [DNA.define, 'define', 'function'],
            [DNA.HTML, 'HTML', 'object'],
            [DNA.extend, 'extend', 'function'],
            [DNA.render, 'render', 'function'],
            [DNA.Fragment, 'Fragment', 'function'],
            [DNA.h, 'h', 'function'],
            [DNA.jsx, 'jsx', 'function'],
            [DNA.jsxDEV, 'jsxDEV', 'function'],
            [DNA.jsxs, 'jsxs', 'function'],
            [DNA.compile, 'compile', 'function'],
            [DNA.html, 'html', 'function'],
            [DNA.css, 'css', 'function'],
            [DNA.delegateEventListener, 'delegateEventListener', 'function'],
            [DNA.undelegateEventListener, 'undelegateEventListener', 'function'],
            [DNA.dispatchEvent, 'dispatchEvent', 'function'],
            [DNA.dispatchAsyncEvent, 'dispatchAsyncEvent', 'function'],
            [DNA.defineProperty, 'defineProperty', 'function'],
            [DNA.getProperty, 'getProperty', 'function'],
            [DNA.getProperties, 'getProperties', 'function'],
            [DNA.property, 'property', 'function'],
            [DNA.state, 'state', 'function'],
            [DNA.observe, 'observe', 'function'],
            [DNA.listen, 'listen', 'function'],
            [DNA.fires, 'fires', 'function'],
            [DNA.isComponent, 'isComponent', 'function'],
            [DNA.isComponentConstructor, 'isComponentConstructor', 'function'],
            [DNA.Component, 'Component', 'function'],
            [DNA.isHydrating, 'isHydrating', 'function'],
            [DNA.$parse, '$parse', 'function'],
            [DNA.$await, '$await', 'function'],
            [DNA.$until, '$until', 'function'],
        ] as const;

        for (const [value, ref, type] of EXPECTED_EXPORT_MAP) {
            it(`should export "${ref}"`, () => {
                expect(value).toBeTypeOf(type);
            });
        }

        it('should not export other references', () => {
            const actual = Object.keys(DNA).sort();
            // default export may be added by the bundler, ignore it.
            if (actual.indexOf('default') !== -1) {
                actual.splice(actual.indexOf('default'), 1);
            }
            const expected = EXPECTED_EXPORT_MAP.map((entry) => entry[1]).sort();
            expect(actual).toStrictEqual(expected);
        });
    },
    10 * 1000
);
