import * as DNA from '@chialab/dna';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('Vitest compatibility', () => {
    let wrapper: HTMLElement;
    let userEvent: typeof import('@vitest/browser/context').userEvent;

    beforeAll(async () => {
        const context = await import('@vitest/browser/context');
        userEvent = context.userEvent;
    });

    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    describe('user events', () => {
        test('should click internal elements', async () => {
            const Component = DNA.define(
                'test-vitest-1',
                class extends DNA.Component {
                    render() {
                        return (
                            <button type="button">
                                <slot />
                            </button>
                        );
                    }
                }
            );
            const element = new Component();
            wrapper.appendChild(element);
            element.textContent = 'Text';
            const spy = vi.fn();
            const trigger = element.childNodes[0] as HTMLButtonElement;
            trigger.appendChild(document.createTextNode('Internal'));
            trigger.addEventListener('click', spy);
            await userEvent.click(trigger);

            expect(spy).toHaveBeenCalled();
        });

        test('should click slotted elements', async () => {
            const Component = DNA.define(
                'test-vitest-2',
                class extends DNA.Component {
                    render() {
                        return (
                            <div>
                                Before
                                <slot />
                                After
                            </div>
                        );
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
