import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import * as Vue from 'vue';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('Vue compatibility', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        if (wrapper.parentNode) {
            document.body.removeChild(wrapper);
        }
    });

    test('should update text content', async () => {
        DNA.define(
            'vue-test-1',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
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
                updateText(value) {
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

        app._instance.proxy.updateText('Update');
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
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
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
                updateText(value) {
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

        app._instance.proxy.updateText('Update');
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
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
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
                updateTitle(value) {
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

        app._instance.proxy.updateTitle(false);
        await Vue.nextTick();

        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML).toBe(
            '<vue-test-3 :scope="vue-test-3" :defined=""><span>Text \n</span><div><h2 slot="children">Subtitle</h2></div></vue-test-3>'
        );
    });
});
