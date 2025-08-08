import { render } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';
import {
    defineTestCompat3,
    type TestCompat1,
    type TestCompat2,
    type TestCompat3,
    type TestCompat4,
} from './TestElements';

describe.runIf(IS_BROWSER)('React compatibility', () => {
    let wrapper: HTMLElement;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    test('should update text content', () => {
        const Template = (text: string) => createElement('test-compat-1', null, text);
        render(Template('Text'), {
            container: wrapper,
        });

        const element = wrapper.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(wrapper.innerHTML).toBe(
            `<test-compat-1 :scope="test-compat-1" :defined=""><span>Text</span><div></div></test-compat-1>`
        );

        render(Template('Update'), {
            container: wrapper,
        });

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(wrapper.innerHTML).toBe(
            `<test-compat-1 :scope="test-compat-1" :defined=""><span>Update</span><div></div></test-compat-1>`
        );
    });

    test('should update text content with multiple text nodes', () => {
        const Template = (text: string) => createElement('test-compat-1', null, text, ' ', 'children');
        render(Template('Text'), {
            container: wrapper,
        });

        const element = wrapper.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'children');
        expect(wrapper.innerHTML).toBe(
            `<test-compat-1 :scope="test-compat-1" :defined=""><span>Text children</span><div></div></test-compat-1>`
        );

        render(Template('Update'), {
            container: wrapper,
        });

        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'children');
        expect(wrapper.innerHTML).toBe(
            `<test-compat-1 :scope="test-compat-1" :defined=""><span>Update children</span><div></div></test-compat-1>`
        );
    });

    test('should update named slots', () => {
        const Template = (title: boolean) =>
            createElement(
                'test-compat-1',
                null,
                'Text ',
                title
                    ? createElement('h1', { slot: 'children', key: 1 }, 'Title')
                    : createElement('h2', { slot: 'children', key: 2 }, 'Subtitle'),
                '\n'
            );
        render(Template(true), {
            container: wrapper,
        });

        const element = wrapper.children[0] as TestCompat1;
        const textNode = element.childNodes[0].childNodes[0];
        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H1');
        expect(wrapper.innerHTML).toBe(
            `<test-compat-1 :scope="test-compat-1" :defined=""><span>Text \n</span><div><h1 slot="children">Title</h1></div></test-compat-1>`
        );

        render(Template(false), {
            container: wrapper,
        });

        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML).toBe(
            `<test-compat-1 :scope="test-compat-1" :defined=""><span>Text \n</span><div><h2 slot="children">Subtitle</h2></div></test-compat-1>`
        );
    });

    test('mixed slots', () => {
        const Template = (showTitle = false) =>
            createElement(
                'test-compat-1',
                {},
                createElement('span', null, 'Test'),
                showTitle ? createElement('h1', { slot: 'children' }, 'Title') : null,
                createElement('span', null, 'Test'),
                showTitle ? createElement('h2', { slot: 'children' }, 'Title') : null,
                createElement('span', null, 'Test')
            );
        render(Template(), {
            container: wrapper,
        });

        const element = wrapper.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);

        render(Template(true), {
            container: wrapper,
        });

        expect(element.slotChildNodes).toHaveLength(5);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(2);
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[0].childNodes[1]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Test');
        expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'H1');
        expect(element.childNodes[1].childNodes[0]).toHaveProperty('textContent', 'Title');
        expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Title');

        render(Template(false), {
            container: wrapper,
        });

        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
    });

    test('nested slot', () => {
        const Template = (showTitle = false) =>
            createElement(
                'test-compat-2',
                { key: '1' },
                showTitle ? createElement('h1', { slot: 'title' }, 'Title') : null,
                createElement('img', { src: 'data:image/png;base64,', alt: '' }),
                createElement('p', null, 'Body')
            );
        render(Template(), {
            container: wrapper,
        });

        const element = wrapper.children[0] as TestCompat2;
        expect(element.childNodesBySlot(null)).toHaveLength(2);
        expect(element.childNodesBySlot('title')).toHaveLength(0);
        expect(element.children).toHaveLength(2);
        expect(element.children[0]).toHaveProperty('tagName', 'DIV');
        expect(element.children[0]).toHaveProperty('className', 'layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0]).toHaveProperty('tagName', 'test-compat-2-title'.toUpperCase());
        expect(element.children[0].children[0].children[0]).toHaveProperty('tagName', 'SPAN');
        expect(element.children[0].children[0].children[0]).toHaveProperty('textContent', 'Untitled');

        render(Template(true), {
            container: wrapper,
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

    test('slot moved across elements', () => {
        const Template = (collapsed = false) =>
            createElement(
                'test-compat-3',
                { collapsed },
                createElement('h1', null, 'Title'),
                createElement('img', { src: 'data:image/png;base64,', alt: '' }),
                createElement('p', null, 'Body')
            );
        render(Template(), {
            container: wrapper,
        });
        defineTestCompat3();

        const element = wrapper.children[0] as TestCompat3;
        window.customElements.upgrade(element);
        expect(element.children).toHaveLength(1);
        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');

        render(Template(true), {
            container: wrapper,
        });

        expect(element.children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[2]).toHaveProperty('textContent', 'Body');

        render(Template(false), {
            container: wrapper,
        });

        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved and replaced', () => {
        const Template = (switchValue = false) =>
            createElement('test-compat-4', { switch: switchValue }, switchValue ? 'World' : 'Hello');
        render(Template(), {
            container: wrapper,
        });

        const element = wrapper.children[0] as TestCompat4;
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');

        render(Template(true), {
            container: wrapper,
        });

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
