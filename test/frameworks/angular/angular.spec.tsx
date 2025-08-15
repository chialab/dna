import 'zone.js';
import 'zone.js/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ɵgetCleanupHook as getCleanupHook, getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { render } from '@testing-library/angular';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { IS_BROWSER } from '../../helpers';
import '../../polyfills';
import {
    defineTestElements,
    type TestElement1,
    type TestElement2,
    type TestElement3,
    type TestElement4,
    type TestElement5,
    type TestElement6,
} from '../TestElements';
import '../TestElements';

describe.runIf(IS_BROWSER)('Angular', () => {
    beforeAll(() => {
        getTestBed().resetTestEnvironment();
        getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    });
    beforeEach(getCleanupHook(false));
    afterEach(getCleanupHook(true));

    test('should update text content', async () => {
        const { container, rerender } = await render('<test-frameworks-1>{{ text }}</test-frameworks-1>', {
            imports: [BrowserTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            componentProperties: {
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
            componentProperties: { text: 'Update' },
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
        const { container, rerender } = await render('<test-frameworks-1>{{ text }} children</test-frameworks-1>', {
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            componentProperties: {
                text: 'Text',
            },
        });

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(container.innerHTML).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span>Text children</span><div></div></test-frameworks-1>'
        );

        await rerender({
            componentProperties: { text: 'Update' },
        });

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(container.innerHTML.replace(/\n\s*/g, ' ')).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span>Update children</span><div></div></test-frameworks-1>'
        );
    });

    test('should update named slots', async () => {
        const { container, rerender } = await render(
            `<test-frameworks-1>
    Text
    <h1 *ngIf="title" slot="children">Title</h1>
    <h2 *ngIf="!title" slot="children">Subtitle</h2>
    end
</test-frameworks-1>`,
            {
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                componentProperties: {
                    title: true,
                },
            }
        );

        const element = container.children[0] as TestElement1;
        const textNode = element.childNodes[0].childNodes[0];
        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H1');
        expect(container.innerHTML.replace(/\n\s*/g, ' ')).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span> Text  end </span><div><h1 slot="children">Title</h1></div></test-frameworks-1>'
        );

        await rerender({
            componentProperties: { title: false },
        });

        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(container.innerHTML.replace(/\n\s*/g, ' ')).toBe(
            '<test-frameworks-1 :scope="test-frameworks-1" :defined=""><span> Text  end </span><div><h2 slot="children">Subtitle</h2></div></test-frameworks-1>'
        );
    });

    test('mixed slots', async () => {
        const { container, rerender } = await render(
            `<test-frameworks-1>
    <span>Test</span>
    <h1 *ngIf="title" slot="children">Title</h1>
    <span>Test</span>
    <h2 *ngIf="title" slot="children">Title</h2>
    <span>Test</span>
</test-frameworks-1>`,
            {
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                componentProperties: {
                    title: false,
                },
            }
        );

        const element = container.children[0] as TestElement1;
        expect(element.slotChildNodes).toHaveLength(5);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);

        await rerender({ componentProperties: { title: true } });

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

        await rerender({ componentProperties: { title: false } });

        expect(element.slotChildNodes).toHaveLength(5);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
    });

    test('nested slot', async () => {
        const { container, rerender } = await render(
            `<test-frameworks-2>
    <h1 *ngIf="title" slot="title">Title</h1>
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</test-frameworks-2>`,
            {
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                componentProperties: {
                    title: false,
                },
            }
        );

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

        await rerender({ componentProperties: { title: true } });

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
        const { container, rerender } = await render(
            `<test-frameworks-3 [collapsed]="collapsed">
    <h1>Title</h1>
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</test-frameworks-3>`,
            {
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                componentProperties: {
                    collapsed: false,
                },
            }
        );
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

        await rerender({ componentProperties: { collapsed: true } });

        expect(element.children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[2]).toHaveProperty('textContent', 'Body');

        await rerender({ componentProperties: { collapsed: false } });

        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved and replaced', async () => {
        const { container, rerender } = await render(
            `<test-frameworks-4 [switch]="switchValue">
    <ng-container *ngIf="switchValue">World</ng-container>
    <ng-container *ngIf="!switchValue">Hello</ng-container>
</test-frameworks-4>`,
            {
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                componentProperties: {
                    switchValue: false,
                },
            }
        );

        const element = container.children[0] as TestElement4;
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');

        await rerender({ componentProperties: { switchValue: true } });

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });

    test('autonomous properties', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const { rerender, container } = await render(
            `<test-frameworks-5
    [stringProp]="stringProp"
    [booleanProp]="booleanProp"
    [numericProp]="numericProp"
    [objectProp]="objectProp"
    (click)="onClick?.($event)"
    (stringchange)="onStringChange?.($event)"
    data-attr="test"
></test-frameworks-5>`,
            {
                componentProperties: {
                    'stringProp': 'test',
                    'booleanProp': true,
                    'numericProp': 1,
                    'objectProp': { test: true },
                },
            }
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
        await rerender({
            componentProperties: {
                onClick,
                onStringChange,
                stringProp: 'changed',
            },
        });
        expect(element.stringProp).toBe('changed');
        expect(onStringChange).toHaveBeenCalledOnce();
        element.click();
        expect(onClick).toHaveBeenCalledOnce();
    });

    /** @TODO https://github.com/angular/angular/issues/63174 */
    test.skip('builtin properties', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const { rerender, container } = await render(
            `<a
    is="test-frameworks-6"
    [stringProp]="stringProp"
    [booleanProp]="booleanProp"
    [numericProp]="numericProp"
    [objectProp]="objectProp"
    (click)="onClick?.($event)"
    (stringchange)="onStringChange?.($event)"
    data-attr="test"
></a>`,
            {
                componentProperties: {
                    'stringProp': 'test',
                    'booleanProp': true,
                    'numericProp': 1,
                    'objectProp': { test: true },
                },
            }
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
        await rerender({
            componentProperties: {
                onClick,
                onStringChange,
                stringProp: 'changed',
            },
        });
        expect(element.stringProp).toBe('changed');
        expect(onStringChange).toHaveBeenCalledOnce();
        element.click();
        expect(onClick).toHaveBeenCalledOnce();
    });
});
