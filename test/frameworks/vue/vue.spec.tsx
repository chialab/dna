import { render } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { IS_BROWSER } from '../../helpers';
import {
    defineTestElements,
    type TestElement1,
    type TestElement2,
    type TestElement3,
    type TestElement4,
    type TestElement5,
    type TestElement6,
} from '../TestElements';

describe.runIf(IS_BROWSER)('Vue compatibility', () => {
    let container: HTMLElement;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    test('should update text content', async () => {
        const { default: Test } = await import('./Test1.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(container.innerHTML).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span>Text</span><div></div></test-frameworks-1>'
        );

        await rerender({
            text: 'Update',
        });

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(container.innerHTML).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span>Update</span><div></div></test-frameworks-1>'
        );
    });

    test('should update text content with multiple text nodes', async () => {
        const { default: Test } = await import('./Test2.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(container.innerHTML).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span>Text children</span><div></div></test-frameworks-1>'
        );

        await rerender({
            text: 'Update',
        });

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(container.innerHTML).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span>Update children</span><div></div></test-frameworks-1>'
        );
    });

    test('should update named slots', async () => {
        const { default: Test } = await import('./Test3.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                title: true,
            },
        });

        const element = container.children[0] as TestElement1;
        const textNode = element.childNodes[0].childNodes[0];
        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H1');
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span> Text  end </span><div><h1 slot="children">Title</h1></div></test-frameworks-1>'
        );

        await rerender({
            title: false,
        });

        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span> Text  end </span><div><h2 slot="children">Subtitle</h2></div></test-frameworks-1>'
        );
    });

    test('mixed slots', async () => {
        const { default: Test } = await import('./Test7.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                title: false,
            },
        });

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(7);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);

        await rerender({
            title: true,
        });

        expect(element.slotChildNodes).toHaveLength(7);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(2);
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[0].childNodes[1]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'H1');
        expect(element.childNodes[1].childNodes[0]).toHaveProperty('textContent', 'Title');
        expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Title');

        await rerender({
            title: false,
        });

        expect(element.slotChildNodes).toHaveLength(7);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
    });

    test('nested slot', async () => {
        const { default: Test } = await import('./Test4.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                title: false,
            },
        });

        const element = container.children[0] as TestElement2;
        expect(element.childNodesBySlot(null)).toHaveLength(2);
        expect(element.childNodesBySlot('title')).toHaveLength(0);
        expect(element.children).toHaveLength(2);
        expect(element.children[0]).toHaveProperty('tagName', 'DIV');
        expect(element.children[0]).toHaveProperty('className', 'layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0]).toHaveProperty('tagName', 'test-frameworks-title'.toUpperCase());
        expect(element.children[0].children[0].children[0]).toHaveProperty('tagName', 'SPAN');
        expect(element.children[0].children[0].children[0]).toHaveProperty('textContent', 'Untitled');

        await rerender({
            title: true,
        });

        expect(element.childNodesBySlot(null)).toHaveLength(2);
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
        const { default: Test } = await import('./Test5.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                collapsed: false,
            },
        });
        defineTestElements();

        const element = container.children[0] as TestElement3;
        window.customElements.upgrade(element);
        expect(element.children).toHaveLength(1);
        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');

        await rerender({
            collapsed: true,
        });

        expect(element.children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[2]).toHaveProperty('textContent', 'Body');

        await rerender({
            collapsed: false,
        });

        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved and replaced', async () => {
        const { default: Test } = await import('./Test6.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                switchValue: false,
            },
        });

        const element = container.children[0] as TestElement4;
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', ' Hello ');

        await rerender({
            switchValue: true,
        });

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', ' World ');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });

    test('autonomous properties', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const { default: Test } = await import('./Test8.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                stringProp: 'test',
                booleanProp: true,
                numericProp: 1,
                objectProp: { test: true },
            },
        });

        const element = container.children[0] as TestElement5;
        expect(element.stringProp).toBe('test');
        expect(element.booleanProp).toBe(true);
        expect(element.numericProp).toBe(1);
        expect(element.objectProp).toEqual({ test: true });
        expect(element.defaultValue).toBe(0);
        expect(element.getAttribute('data-attr')).toBe('test');
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        await rerender({
            onClick,
            onStringChange,
            stringProp: 'changed',
        });
        expect(onStringChange).toHaveBeenCalledOnce();
        element.click();
        expect(onClick).toHaveBeenCalledOnce();
    });

    test('builtin properties', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const { default: Test } = await import('./Test9.vue');
        const { rerender } = render(Test, {
            container,
            props: {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
            },
        });

        const element = container.children[0] as TestElement6;
        expect(element.stringProp).toBe('test');
        expect(element.booleanProp).toBe(true);
        expect(element.numericProp).toBe(1);
        expect(element.objectProp).toEqual({ test: true });
        expect(element.defaultValue).toBe(0);
        expect(element.getAttribute('data-attr')).toBe('test');
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        await rerender({
            onClick,
            onStringChange,
            stringProp: 'changed',
        });
        expect(onStringChange).toHaveBeenCalledOnce();
        element.click();
        expect(onClick).toHaveBeenCalledOnce();
    });
});
