import * as DNA from '@chialab/dna';
import { describe, expect, it } from 'vitest';

describe(
    'Component',
    () => {
        it('should define a component', () => {
            expect(() => {
                DNA.define(
                    'test-component-1-node',
                    class TestElement extends DNA.Component {
                        static globalStyles = ['test-component-1-node { color: red; }'];
                    }
                );
            }).not.toThrow();
        });

        it('should define a builtin component', () => {
            expect(() => {
                DNA.define('test-component-2-node', class TestElement extends DNA.Component {}, {
                    extends: 'article',
                });
            }).not.toThrow();
        });

        it('should throw on construct', () => {
            expect(() => {
                const TestElement = DNA.define('test-component-3-node', class TestElement extends DNA.Component {});

                new TestElement();
            }).toThrow();
        });
    },
    10 * 1000
);
