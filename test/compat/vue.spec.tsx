import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as Vue from 'vue';
import { IS_BROWSER } from '../helpers';
import {
    type TestCompat1,
    type TestCompat2,
    type TestCompat3,
    type TestCompat4,
    defineTestCompat3,
} from './TestElements';

describe.runIf(IS_BROWSER)('Vue compatibility', () => {
    let wrapper: HTMLElement;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    test('should update text content', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    text: 'Text',
                };
            },
            render() {
                return Vue.h('test-compat-1', {}, [this.text]);
            },
            methods: {
                updateText(value: string) {
                    this.text = value;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(wrapper.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text</span><div></div></test-compat-1>'
        );

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateText('Update');
        await Vue.nextTick();

        expect(element.slotChildNodes).toHaveLength(1);
        expect(element.childNodesBySlot(null)).toHaveLength(1);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(wrapper.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Update</span><div></div></test-compat-1>'
        );
    });

    test('should update text content with multiple text nodes', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    text: 'Text',
                };
            },
            render() {
                return Vue.h('test-compat-1', {}, [this.text, ' ', 'children']);
            },
            methods: {
                updateText(value: string) {
                    this.text = value;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Text children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Text');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'children');
        expect(wrapper.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text children</span><div></div></test-compat-1>'
        );

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateText('Update');
        await Vue.nextTick();

        expect(element.slotChildNodes).toHaveLength(3);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
        expect(element.childNodes[0]).toHaveProperty('textContent', 'Update children');
        expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Update');
        expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'children');
        expect(wrapper.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Update children</span><div></div></test-compat-1>'
        );
    });

    test('should update named slots', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    title: true,
                };
            },
            render() {
                return Vue.h('test-compat-1', {}, [
                    'Text ',
                    this.title
                        ? Vue.h('h1', { slot: 'children' }, 'Title')
                        : Vue.h('h2', { slot: 'children' }, 'Subtitle'),
                    '\n',
                ]);
            },
            methods: {
                updateTitle(value: boolean) {
                    this.title = value;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0] as TestCompat1;
        const textNode = element.childNodes[0].childNodes[0];
        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H1');
        expect(wrapper.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text \n</span><div><h1 slot="children">Title</h1></div></test-compat-1>'
        );

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateTitle(false);
        await Vue.nextTick();

        expect(element.childNodesBySlot('children')).toHaveLength(1);
        expect(element.childNodesBySlot('children')[0]).toHaveProperty('tagName', 'H2');
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML).toBe(
            '<test-compat-1 :scope="test-compat-1" :defined=""><span>Text \n</span><div><h2 slot="children">Subtitle</h2></div></test-compat-1>'
        );
    });

    test('mixed slots', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    title: false,
                };
            },
            render() {
                return Vue.h('test-compat-1', {}, [
                    Vue.h('span', null, 'Test'),
                    this.title ? Vue.h('h1', { slot: 'children' }, 'Title') : null,
                    Vue.h('span', null, 'Test'),
                    this.title ? Vue.h('h2', { slot: 'children' }, 'Title') : null,
                    Vue.h('span', null, 'Test'),
                ]);
            },
            methods: {
                updateTitle(value: boolean) {
                    this.title = value;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0] as TestCompat1;
        expect(element.slotChildNodes).toHaveLength(5);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateTitle(true);
        await Vue.nextTick();

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

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateTitle(false);
        await Vue.nextTick();

        expect(element.slotChildNodes).toHaveLength(5);
        expect(element.childNodesBySlot(null)).toHaveLength(3);
        expect(element.childNodesBySlot('children')).toHaveLength(0);
    });

    test('nested slot', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    showTitle: false,
                };
            },
            render() {
                return Vue.h('test-compat-2', { key: '1' }, [
                    this.showTitle ? Vue.h('h1', { slot: 'title' }, 'Title') : null,
                    Vue.h('img', { src: 'data:image/png;base64,', alt: '' }),
                    Vue.h('p', null, 'Body'),
                ]);
            },
            methods: {
                updateShowTitle(value: boolean) {
                    this.showTitle = value;
                },
            },
        });
        app.mount(wrapper);

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

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateShowTitle(true);
        await Vue.nextTick();

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
        const app = Vue.createApp({
            data() {
                return {
                    collapsed: false,
                };
            },
            render() {
                return Vue.h('test-compat-3', { collapsed: this.collapsed }, [
                    Vue.h('h1', null, 'Title'),
                    Vue.h('img', { src: 'data:image/png;base64,', alt: '' }),
                    Vue.h('p', null, 'Body'),
                ]);
            },
            methods: {
                updateCollapsed(value: boolean) {
                    this.collapsed = value;
                },
            },
        });
        app.mount(wrapper);
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

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateCollapsed(true);
        await Vue.nextTick();

        expect(element.children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[2]).toHaveProperty('textContent', 'Body');

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateCollapsed(false);
        await Vue.nextTick();

        expect(element.children[0].children[0]).toHaveProperty('tagName', 'H1');
        expect(element.children[0].children[0]).toHaveProperty('textContent', 'Title');
        expect(element.children[0].children[1]).toHaveProperty('tagName', 'IMG');
        expect(element.children[0].children[1]).toHaveProperty('src', 'data:image/png;base64,');
        expect(element.children[0].children[2]).toHaveProperty('tagName', 'P');
        expect(element.children[0].children[2]).toHaveProperty('textContent', 'Body');
    });

    test('slot moved and replaced', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    switchValue: false,
                };
            },
            render() {
                return Vue.h('test-compat-4', { switch: this.switchValue }, [this.switchValue ? 'World' : 'Hello']);
            },
            methods: {
                toggleSwitch() {
                    this.switchValue = !this.switchValue;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0] as TestCompat4;
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.toggleSwitch();
        await Vue.nextTick();

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
