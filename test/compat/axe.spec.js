import * as DNA from '@chialab/dna';
import { run } from 'axe-core';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { getComponentName } from '../helpers.js';

describe('Axe compatibility', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    test('should find violations for simple components', async () => {
        const is = getComponentName();
        const Component = DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <input id="input" type="text" />
                    `;
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
        const is = getComponentName();
        const Component = DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <label for="input">Label</label>
                        <input id="input" type="text" />
                    `;
                }
            }
        );

        const element = new Component();
        wrapper.appendChild(element);

        const { violations } = await run(element);
        expect(violations).toHaveLength(0);
    });

    test('should find violations for simple components with slotted children', async () => {
        const is = getComponentName();
        const Component = DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`<slot />`;
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
        const is = getComponentName();
        const Component = DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <label for="input">Label</label>
                        <slot />
                    `;
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
