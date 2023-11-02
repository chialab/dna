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
        describe('#new', () => {
            it('should create a node', () => {
                expect(() => {
                    const is = getComponentName();
                    class TestElement extends DNA.Component {}
                    DNA.define(is, TestElement);
                }).not.toThrow();
            });

            it('should extend a native node', () => {
                expect(() => {
                    const is = getComponentName();
                    class TestElement extends DNA.Component {}
                    DNA.define(is, TestElement, {
                        extends: 'article',
                    });
                }).not.toThrow();
            });

            it('should create a base class starting from the anchor base class', () => {
                expect(() => {
                    class TestElement extends DNA.builtin.HTMLAnchorElement {}
                    DNA.define(getComponentName(), TestElement, { extends: 'a' });
                }).not.toThrow();
            });
        });
    },
    10 * 1000
);
