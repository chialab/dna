import * as DNA from '@chialab/dna';
import { describe, expect, it } from 'vitest';

let count = 0;

/**
 * Create unique custom element name.
 * @returns Unique custom element name.
 */
export function getComponentName() {
    return `test-element-${count++}`;
}

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
