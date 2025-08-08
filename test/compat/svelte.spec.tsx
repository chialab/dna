import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';
import {
    defineTestCompat3,
    type TestCompat1,
    type TestCompat2,
    type TestCompat3,
    type TestCompat4,
} from './TestElements';

describe.runIf(IS_BROWSER)('Svelte', () => {
    test('should update text content', async () => {
        const { default: Test1 } = await import('./Test1.svelte');
        const { container, rerender } = render(Test1, {
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(container.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text</span><div></div></test-compat-1>'
        );

        await rerender({ text: 'Update' });

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(container.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Update</span><div></div></test-compat-1>'
        );
    });

    test('should update text content with multiple text nodes', async () => {
        const { default: Test2 } = await import('./Test2.svelte');
        const { container, rerender } = render(Test2, {
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(container.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text children</span><div></div></test-compat-1>'
        );

        await rerender({ text: 'Update' });

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Update children</span><div></div></test-compat-1>'
        );
    });

    test('should update named slots', async () => {
        const { default: Test3 } = await import('./Test3.svelte');
        const { container, rerender } = render(Test3, {
            props: {
                title: true,
            },
        });

        const element = container.children[0] as TestCompat1;
        const textNode = element.childNodes[0].childNodes[0];
        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H1');
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text  end</span><div><h1 slot="children">Title</h1></div></test-compat-1>'
        );

        await rerender({ title: false });

        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text  end</span><div><h2 slot="children">Subitle</h2></div></test-compat-1>'
        );
    });

    test('mixed slots', async () => {
        const { default: Test7 } = await import('./Test7.svelte');
        const { container, rerender } = render(Test7, {
            props: {
                title: false,
            },
        });

        const element = container.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(9);
        expect(element.childNodesBySlot(null)).toHaveLength(7);
        expect(element.childNodesBySlot('children')).toHaveLength(0);

        await rerender({ title: true });

        expect(element.slotChildNodes).toHaveLength(11);
        expect(element.childNodesBySlot(null)).toHaveLength(7);
        expect(element.childNodesBySlot('children')).toHaveLength(2);
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[0].childNodes[3]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[0].childNodes[6]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'H1');
        expect(element.childNodes[1].childNodes[0]).toHaveProperty('textContent', 'Title');
        expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Title');

        await rerender({ title: false });

        expect(element.slotChildNodes).toHaveLength(9);
        expect(element.childNodesBySlot(null)).toHaveLength(7);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
    });

    test('nested slot', async () => {
        const { default: Test4 } = await import('./Test4.svelte');
        const { container, rerender } = render(Test4, {
            props: {
                title: false,
            },
        });

        const element = container.children[0] as TestCompat2;
        expect(element.childNodesBySlot(null)).toHaveLength(4);
        expect(element.childNodesBySlot('title')).toHaveLength(0);
        expect(element.children).toHaveLength(2);
        expect(element.children[0]).toHaveProperty('tagName', 'DIV');
        expect(element.children[0]).toHaveProperty('className', 'layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0]).toHaveProperty('tagName', 'test-compat-2-title'.toUpperCase());
        expect(element.children[0].children[0].children[0]).toHaveProperty('tagName', 'SPAN');
        expect(element.children[0].children[0].children[0]).toHaveProperty('textContent', 'Untitled');

        await rerender({ title: true });

        expect(element.childNodesBySlot(null)).toHaveLength(4);
        expect(element.childNodesBySlot('title')).toHaveLength(1);
        expect(element.childNodesBySlot('title')[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0].children[0]).toHaveProperty('tagName', 'SPAN');
        expect(element.children[0].children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'DIV');
        expect(element.children[1]).toHaveProperty('className', 'layout-body');
        expect(element.children[1].children[0]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1].children[0]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[1].children[1]).toHaveProperty('tagName', 'P');
        expect(element.children[1].children[1]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved across elements', async () => {
        const { default: Test5 } = await import('./Test5.svelte');
        const { container, rerender } = render(Test5, {
            props: {
                collapsed: false,
            },
        });
        defineTestCompat3();

        const element = container.children[0] as TestCompat3;
        window.customElements.upgrade(element);
        expect(element.children).toHaveLength(1);
        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');

        await rerender({ collapsed: true });

        expect(element.children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[2]).toHaveProperty('textContent', 'Body');

        await rerender({ collapsed: false });

        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved and replaced', async () => {
        const { default: Test6 } = await import('./Test6.svelte');
        const { container, rerender } = render(Test6, {
            props: {
                switchValue: false,
            },
        });

        const element = container.children[0] as TestCompat4;
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');

        await rerender({ switchValue: true });

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
