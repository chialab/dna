import * as DNA from '@chialab/dna';
import { describe, expect, it } from 'vitest';

describe(
    'Component',
    () => {
        it('should define a component', () => {
            expect(() => {
                DNA.define('test-component-73', class TestElement extends DNA.Component {});
            }).not.toThrow();
        });

        it('should define a builtin component', () => {
            expect(() => {
                DNA.define('test-component-74', class TestElement extends DNA.Component {}, {
                    extends: 'article',
                });
            }).not.toThrow();
        });

        it('should throw on construct', () => {
            expect(() => {
                const TestElement = DNA.define('test-component-75', class TestElement extends DNA.Component {});

                new TestElement();
            }).toThrow();
        });
    },
    10 * 1000
);
