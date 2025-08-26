/** @jsxImportSource preact */

import { render } from '@testing-library/preact';
import { describe, expect, test, vi } from 'vitest';
import {
    defineTestElements,
    type TestElement1,
    type TestElement2,
    type TestElement3,
    type TestElement4,
    type TestElement5,
    type TestElement6,
} from '../TestElements';

describe('Preact', () => {
    test('should update text content', () => {
        const Template = (text: string) => <test-frameworks-1>{text}</test-frameworks-1>;
        const { rerender, container } = render(Template('Text'));

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(container.innerHTML).toMatchSnapshot();

        rerender(Template('Update'));

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(container.innerHTML).toMatchSnapshot();
    });

    test('should update text content with multiple text nodes', () => {
        const Template = (text: string) => (
            <test-frameworks-1>
                {text} {'children'}
            </test-frameworks-1>
        );
        const { rerender, container } = render(Template('Text'));

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'children');
        expect(container.innerHTML).toMatchSnapshot();

        rerender(Template('Update'));

        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'children');
        expect(container.innerHTML).toMatchSnapshot();
    });

    test('should update named slots', () => {
        const Template = (title: boolean) => (
            <test-frameworks-1>
                Text {title ? <h1 slot="children">Title</h1> : <h2 slot="children">Subtitle</h2>}
                {'\n'}
            </test-frameworks-1>
        );
        const { rerender, container } = render(Template(true));

        const element = container.children[0] as TestElement1;
        const textNode = element.childNodes[0].childNodes[0];
        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H1');
        expect(container.innerHTML).toMatchSnapshot();

        rerender(Template(false));

        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(container.innerHTML).toMatchSnapshot();
    });

    test('mixed slots', () => {
        const Template = (showTitle = false) => (
            <test-frameworks-1>
                <span>Test</span>
                {showTitle && <h1 slot="children">Title</h1>}
                <span>Test</span>
                {showTitle && <h2 slot="children">Title</h2>}
                <span>Test</span>
            </test-frameworks-1>
        );
        const { rerender, container } = render(Template());

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);

        rerender(Template(true));

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

        rerender(Template(false));

        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
    });

    test('nested slot', () => {
        const Template = (showTitle = false) => (
            <test-frameworks-2 key="1">
                {showTitle && <h1 slot="title">Title</h1>}
                <img
                    src="data:image/png;base64,"
                    alt=""
                />
                <p>Body</p>
            </test-frameworks-2>
        );
        const { rerender, container } = render(Template());

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

        rerender(Template(true));

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
        const Template = (collapsed = false) => (
            <test-frameworks-3 collapsed={collapsed}>
                <h1>Title</h1>
                <img
                    src="data:image/png;base64,"
                    alt=""
                />
                <p>Body</p>
            </test-frameworks-3>
        );
        const { rerender, container } = render(Template());
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

        rerender(Template(true));

        expect(element.children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[2]).toHaveProperty('textContent', 'Body');

        rerender(Template(false));

        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved and replaced', () => {
        const Template = (switchValue = false) => (
            <test-frameworks-4 switch={switchValue}>{switchValue ? 'World' : 'Hello'}</test-frameworks-4>
        );
        const { rerender, container } = render(Template());

        const element = container.children[0] as TestElement4;
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');

        rerender(Template(true));

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });

    test('autonomous properties', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const Template = (props: {
            stringProp?: string;
            booleanProp?: boolean;
            numericProp?: number;
            objectProp?: object;
            onClick?: (event: MouseEvent) => void;
            onStringChange?: (event: CustomEvent<string>) => void;
        }) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: Assignment test
            <test-frameworks-5
                onClick={props.onClick}
                onstringchange={props.onStringChange}
                stringProp={props.stringProp}
                booleanProp={props.booleanProp}
                numericProp={props.numericProp}
                objectProp={props.objectProp}
                data-attr="test"
            />
        );
        const { rerender, container } = render(
            Template({
                stringProp: 'test',
                booleanProp: true,
                numericProp: 1,
                objectProp: { test: true },
            })
        );

        const element = container.children[0] as TestElement5;
        expect(element.stringProp).toBe('test');
        expect(element.booleanProp).toBe(true);
        expect(element.numericProp).toBe(1);
        expect(element.objectProp).toEqual({ test: true });
        expect(element.defaultValue).toBe(0);
        expect(element.getAttribute('data-attr')).toBe('test');
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        rerender(
            Template({
                onClick,
                onStringChange,
                stringProp: 'changed',
            })
        );
        expect(element.stringProp).toBe('changed');
        expect(onStringChange).toHaveBeenCalledOnce();
        element.click();
        expect(onClick).toHaveBeenCalledOnce();
    });

    test('builtin properties', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const Template = (props: {
            stringProp?: string;
            booleanProp?: boolean;
            numericProp?: number;
            objectProp?: object;
            onClick?: (event: MouseEvent) => void;
            onStringChange?: (event: CustomEvent<string>) => void;
        }) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: Assignment test
            // biome-ignore lint/a11y/useAnchorContent: Assignment test
            <a
                is="test-frameworks-6"
                // biome-ignore lint/a11y/useValidAnchor: Assignment test
                onClick={props.onClick}
                onstringchange={props.onStringChange}
                stringProp={props.stringProp}
                booleanProp={props.booleanProp}
                numericProp={props.numericProp}
                objectProp={props.objectProp}
                data-attr="test"
            />
        );
        const { rerender, container } = render(
            Template({
                stringProp: 'test',
                booleanProp: true,
                numericProp: 1,
                objectProp: { test: true },
            })
        );

        const element = container.children[0] as TestElement6;
        expect(element.stringProp).toBe('test');
        expect(element.booleanProp).toBe(true);
        expect(element.numericProp).toBe(1);
        expect(element.objectProp).toEqual({ test: true });
        expect(element.defaultValue).toBe(0);
        expect(element.getAttribute('data-attr')).toBe('test');
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        rerender(
            Template({
                onClick,
                onStringChange,
                stringProp: 'changed',
            })
        );
        expect(element.stringProp).toBe('changed');
        expect(onStringChange).toHaveBeenCalledOnce();
        element.click();
        expect(onClick).toHaveBeenCalledOnce();
    });
});
