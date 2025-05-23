import * as DNA from '@chialab/dna';
import { Ivya } from 'ivya';
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { getComponentName } from '../helpers.js';

describe('Ivya compatibility', () => {
    let ivya;
    let wrapper;
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
        const is = getComponentName();
        const Component = DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`Internal`;
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
        const is = getComponentName();
        const Component = DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`Internal<slot />`;
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
