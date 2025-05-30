import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';
import Test1 from './Test1.svelte';
import Test2 from './Test2.svelte';
import Test3 from './Test3.svelte';

describe.runIf(IS_BROWSER)('Svelte', () => {
    test('should update text content', async () => {
        const { container, rerender } = render(Test1, {
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(container.innerHTML).toBe(
            '<svelte-test-1 :scope="svelte-test-1" :defined=""><span>Text</span><div></div></svelte-test-1>'
        );

        await rerender({ text: 'Update' });
        expect(element.childNodes[0].textContent).toBe('Update');
        expect(container.innerHTML).toBe(
            '<svelte-test-1 :scope="svelte-test-1" :defined=""><span>Update</span><div></div></svelte-test-1>'
        );
    });

    test('should update text content with multiple text nodes', async () => {
        const { container, rerender } = render(Test2, {
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(container.innerHTML).toBe(
            '<svelte-test-2 :scope="svelte-test-2" :defined=""><span>Text children</span><div></div></svelte-test-2>'
        );

        await rerender({ text: 'Update' });
        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<svelte-test-2 :scope="svelte-test-2" :defined=""><span>Update children</span><div></div></svelte-test-2>'
        );
    });

    test('should update named slots', async () => {
        const { container, rerender } = render(Test3, {
            props: {
                title: true,
            },
        });

        const element = container.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<svelte-test-3 :scope="svelte-test-3" :defined=""><span>Text  end</span><div><h1 slot="children">Title</h1></div></svelte-test-3>'
        );

        await rerender({ title: false });
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<svelte-test-3 :scope="svelte-test-3" :defined=""><span>Text  end</span><div><h2 slot="children">Subitle</h2></div></svelte-test-3>'
        );
    });
});
