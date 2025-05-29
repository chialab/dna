import * as DNA from '@chialab/dna';
import { h, render } from 'preact';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('Preact compatibility', () => {
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

    test('should update text content', () => {
        DNA.define(
            'preact-test-1',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => h('preact-test-1', null, [text]);
        render(Template('Text'), wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(
            `<preact-test-1 :scope="preact-test-1" :defined=""><span>Text</span><div></div></preact-test-1>`
        );

        render(Template('Update'), wrapper);
        expect(element.childNodes[0].textContent).toBe('Update');
        expect(wrapper.innerHTML).toBe(
            `<preact-test-1 :scope="preact-test-1" :defined=""><span>Update</span><div></div></preact-test-1>`
        );
    });

    test('should update text content with multiple text nodes', () => {
        DNA.define(
            'preact-test-2',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => h('preact-test-2', null, [text, ' ', 'children']);
        render(Template('Text'), wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Text');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<preact-test-2 :scope="preact-test-2" :defined=""><span>Text children</span><div></div></preact-test-2>`
        );

        render(Template('Update'), wrapper);
        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Update');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<preact-test-2 :scope="preact-test-2" :defined=""><span>Update children</span><div></div></preact-test-2>`
        );
    });

    test('should update named slots', () => {
        DNA.define(
            'preact-test-3',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (title) =>
            h('preact-test-3', null, [
                'Text ',
                title
                    ? h('h1', { slot: 'children', key: 1 }, 'Title')
                    : h('h2', { slot: 'children', key: 2 }, 'Subtitle'),
                '\n',
            ]);
        render(Template(true), wrapper);

        const element = wrapper.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(wrapper.innerHTML).toBe(
            `<preact-test-3 :scope="preact-test-3" :defined=""><span>Text \n</span><div><h1 slot="children">Title</h1></div></preact-test-3>`
        );

        render(Template(false), wrapper);
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML).toBe(
            `<preact-test-3 :scope="preact-test-3" :defined=""><span>Text \n</span><div><h2 slot="children">Subtitle</h2></div></preact-test-3>`
        );
    });
});
