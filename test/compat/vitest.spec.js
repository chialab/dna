import * as DNA from '@chialab/dna';
import { userEvent } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getComponentName } from '../helpers.js';

describe('Vitest compatibility', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    describe('user events', () => {
        test('should click internal elements', async () => {
            const is = getComponentName();
            const Component = DNA.define(
                is,
                class extends DNA.Component {
                    render() {
                        return DNA.html`<button><slot /></button>`;
                    }
                }
            );
            const element = new Component();
            wrapper.appendChild(element);
            element.textContent = 'Text';
            const spy = vi.fn();
            const trigger = element.childNodes[0];
            trigger.appendChild(document.createTextNode('Internal'));
            trigger.addEventListener('click', spy);
            await userEvent.click(trigger);

            expect(spy).toHaveBeenCalled();
        });

        test('should click slotted elements', async () => {
            const is = getComponentName();
            const Component = DNA.define(
                is,
                class extends DNA.Component {
                    render() {
                        return DNA.html`<div>Before<slot />After</div>`;
                    }
                }
            );
            const element = new Component();
            wrapper.appendChild(element);
            const spy = vi.fn();
            const trigger = document.createElement('button');
            element.appendChild(trigger);
            trigger.appendChild(document.createTextNode('Internal'));
            trigger.addEventListener('click', spy);
            await userEvent.click(trigger);

            expect(spy).toHaveBeenCalled();
        });
    });
});
