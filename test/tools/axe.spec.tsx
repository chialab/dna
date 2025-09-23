import * as DNA from '@chialab/dna';
import { run } from 'axe-core';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('Axe compatibility', () => {
    let wrapper: HTMLElement;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    test('should find violations for simple components', async () => {
        const Component = DNA.define(
            'test-axe-1',
            class extends DNA.Component {
                render() {
                    return (
                        <input
                            id="input"
                            type="text"
                        />
                    );
                }
            }
        );

        const element = new Component();
        wrapper.appendChild(element);

        const { violations } = await run(element);
        expect(violations).toHaveLength(1);
        expect(violations[0].id).toBe('label');
    });

    test('should not find violations for simple components', async () => {
        const Component = DNA.define(
            'test-axe-2',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <label for="input">Label</label>
                            <input
                                id="input"
                                type="text"
                            />
                        </>
                    );
                }
            }
        );

        const element = new Component();
        wrapper.appendChild(element);

        const { violations } = await run(element);
        expect(violations).toHaveLength(0);
    });

    test('should find violations for simple components with slotted children', async () => {
        const Component = DNA.define(
            'test-axe-3',
            class extends DNA.Component {
                render() {
                    return <slot />;
                }
            }
        );

        const element = new Component();
        wrapper.appendChild(element);
        const input = document.createElement('input');
        input.id = 'input';
        input.type = 'text';
        element.appendChild(input);

        const { violations } = await run(element);
        expect(violations).toHaveLength(1);
        expect(violations[0].id).toBe('label');
    });

    test('should not find violations for simple components with slotted children', async () => {
        const Component = DNA.define(
            'test-axe-4',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <label for="input">Label</label>
                            <slot />
                        </>
                    );
                }
            }
        );

        const element = new Component();
        wrapper.appendChild(element);
        const input = document.createElement('input');
        input.id = 'input';
        input.type = 'text';
        element.appendChild(input);

        const { violations } = await run(element);
        expect(violations).toHaveLength(0);
    });
});
