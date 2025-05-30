import * as DNA from '@chialab/dna';
import { Ivya } from 'ivya';
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('Ivya compatibility', () => {
    let ivya: Ivya;
    let wrapper: HTMLElement;
    beforeAll(() => {
        ivya = Ivya.create({
            browser: 'chromium',
            testIdAttribute: 'data-test-id',
        });
    });

    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    test('should correctly create locator selector for simple component', () => {
        const Component = DNA.define(
            'test-ivya-1',
            class extends DNA.Component {
                render() {
                    return <>Internal</>;
                }
            }
        );
        const element = new Component();
        wrapper.appendChild(element);
        element.textContent = 'Text';

        const selector = ivya.generateSelectorSimple(element);
        expect(selector).toBe('internal:text="Internal"i');
        expect(ivya.queryLocatorSelector(selector)).toBe(element);
    });

    test('should correctly create locator selector for simple component with slot', () => {
        const Component = DNA.define(
            'test-ivya-2',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            Internal
                            <slot />
                        </>
                    );
                }
            }
        );
        const element = new Component();
        wrapper.appendChild(element);
        element.textContent = 'Text';

        const selector = ivya.generateSelectorSimple(element);
        expect(selector).toBe('internal:text="InternalText"i');
        expect(ivya.queryLocatorSelector(selector)).toBe(element);
    });
});
