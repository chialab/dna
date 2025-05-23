import * as DNA from '@chialab/dna';
import { describe, expect, it } from 'vitest';
import { getComponentName } from '../helpers.js';

describe(
    'Component',
    () => {
        it('should define a component', () => {
            expect(() => {
                const is = getComponentName();
                DNA.define(is, class TestElement extends DNA.Component {});
            }).not.toThrow();
        });

        it('should define a builtin component', () => {
            expect(() => {
                const is = getComponentName();
                DNA.define(is, class TestElement extends DNA.Component {}, {
                    extends: 'article',
                });
            }).not.toThrow();
        });

        it('should throw on construct', () => {
            expect(() => {
                const is = getComponentName();
                const TestElement = DNA.define(is, class TestElement extends DNA.Component {});

                new TestElement();
            }).toThrow();
        });
    },
    10 * 1000
);
