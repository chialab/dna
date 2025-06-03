import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as Vue from 'vue';
import { IS_BROWSER } from '../helpers';

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
        DNA.define(
            'vue-test-1',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const app = Vue.createApp({
            data() {
                return {
                    text: 'Text',
                };
            },
            render() {
                return Vue.h('vue-test-1', {}, [this.text]);
            },
            methods: {
                updateText(value: string) {
                    this.text = value;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(
            '<vue-test-1 :scope="vue-test-1" :defined=""><span>Text</span><div></div></vue-test-1>'
        );

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateText('Update');
        await Vue.nextTick();

        expect(element.childNodes[0].textContent).toBe('Update');
        expect(wrapper.innerHTML).toBe(
            '<vue-test-1 :scope="vue-test-1" :defined=""><span>Update</span><div></div></vue-test-1>'
        );
    });

    test('should update text content with multiple text nodes', async () => {
        DNA.define(
            'vue-test-2',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const app = Vue.createApp({
            data() {
                return {
                    text: 'Text',
                };
            },
            render() {
                return Vue.h('vue-test-2', {}, [this.text, ' ', 'children']);
            },
            methods: {
                updateText(value: string) {
                    this.text = value;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Text');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            '<vue-test-2 :scope="vue-test-2" :defined=""><span>Text children</span><div></div></vue-test-2>'
        );

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateText('Update');
        await Vue.nextTick();

        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Update');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            '<vue-test-2 :scope="vue-test-2" :defined=""><span>Update children</span><div></div></vue-test-2>'
        );
    });

    test('should update named slots', async () => {
        DNA.define(
            'vue-test-3',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const app = Vue.createApp({
            data() {
                return {
                    title: true,
                };
            },
            render() {
                return Vue.h('vue-test-3', {}, [
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

        const element = wrapper.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(wrapper.innerHTML).toBe(
            '<vue-test-3 :scope="vue-test-3" :defined=""><span>Text \n</span><div><h1 slot="children">Title</h1></div></vue-test-3>'
        );

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateTitle(false);
        await Vue.nextTick();

        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML).toBe(
            '<vue-test-3 :scope="vue-test-3" :defined=""><span>Text \n</span><div><h2 slot="children">Subtitle</h2></div></vue-test-3>'
        );
    });

    test('nested slot', async () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'vue-test-4',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <div class="layout-header">
                                <vue-test-4-title>
                                    <slot name="title" />
                                </vue-test-4-title>
                            </div>
                            <div class="layout-body">
                                <slot />
                            </div>
                        </>
                    );
                }
            }
        );
        DNA.define(
            'vue-test-4-title',
            class MyTitle extends DNA.Component {
                render() {
                    return (
                        <span class="title">
                            <slot>Untitled</slot>
                        </span>
                    );
                }
            }
        );

        const app = Vue.createApp({
            data() {
                return {
                    showTitle: false,
                };
            },
            render() {
                return Vue.h('vue-test-4', { key: '1' }, [
                    this.showTitle ? Vue.h('h1', { slot: 'title' }, 'Title') : null,
                    Vue.h('img', { src: IMG, alt: '' }),
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

        const element = wrapper.children[0];
        expect(element.children).toHaveLength(2);
        expect(element.children[0].tagName).toBe('DIV');
        expect(element.children[0].className).toBe('layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('vue-test-4-title'.toUpperCase());
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Untitled');

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateShowTitle(true);
        await Vue.nextTick();

        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('DIV');
        expect(element.children[1].className).toBe('layout-body');
        expect(element.children[1].children[0].tagName).toBe('IMG');
        expect(element.children[1].children[0].getAttribute('src')).toBe(IMG);
        expect(element.children[1].children[1].tagName).toBe('P');
        expect(element.children[1].children[1].textContent).toBe('Body');
    });

    test('slot moved across elements', async () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'vue-test-5-card',
            class MyCard extends DNA.Component {
                render() {
                    return <slot />;
                }
            }
        );

        const app = Vue.createApp({
            data() {
                return {
                    collapsed: false,
                };
            },
            render() {
                return Vue.h('vue-test-5', { collapsed: this.collapsed }, [
                    Vue.h('h1', null, 'Title'),
                    Vue.h('img', { src: IMG, alt: '' }),
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

        DNA.define(
            'vue-test-5',
            class MyElement extends DNA.Component {
                static get properties() {
                    return {
                        collapsed: Boolean,
                    };
                }

                declare collapsed: boolean;

                render() {
                    if (this.collapsed) {
                        return <slot />;
                    }
                    return (
                        <vue-test-5-card>
                            <slot />
                        </vue-test-5-card>
                    );
                }
            }
        );

        const element = wrapper.children[0];
        window.customElements.upgrade(element);
        expect(element.children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateCollapsed(true);
        await Vue.nextTick();

        expect(element.children[0].tagName).toBe('H1');
        expect(element.children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('IMG');
        expect(element.children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[2].tagName).toBe('P');
        expect(element.children[2].textContent).toBe('Body');

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.updateCollapsed(false);
        await Vue.nextTick();

        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');
    });

    test('slot moved and replaced', async () => {
        DNA.define(
            'vue-test-6',
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        switch: Boolean,
                    };
                }

                declare switch: boolean;

                render() {
                    return (
                        <>
                            <div class="parent-1">{this.switch ? <slot /> : 'Empty'}</div>
                            <div class="parent-2">{!this.switch ? <slot /> : 'Empty'}</div>
                        </>
                    );
                }
            }
        );

        const app = Vue.createApp({
            data() {
                return {
                    switchValue: false,
                };
            },
            render() {
                return Vue.h('vue-test-6', { switch: this.switchValue }, [this.switchValue ? 'World' : 'Hello']);
            },
            methods: {
                toggleSwitch() {
                    this.switchValue = !this.switchValue;
                },
            },
        });
        app.mount(wrapper);

        const element = wrapper.children[0];
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');

        // @ts-ignore We dont care about Vue types
        app._instance?.proxy?.toggleSwitch();
        await Vue.nextTick();

        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
