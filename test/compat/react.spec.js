import * as DNA from '@chialab/dna';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('React compatibility', () => {
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
            'react-test-1',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => React.createElement('react-test-1', null, [text]);
        const root = ReactDOM.createRoot(wrapper);
        root.render(Template('Text'));
        await new Promise((resolve) => setTimeout(resolve, 10));

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(
            `<react-test-1 :scope="react-test-1" :defined=""><span>Text</span><div></div></react-test-1>`
        );

        root.render(Template('Update'));
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(element.childNodes[0].textContent).toBe('Update');
        expect(wrapper.innerHTML).toBe(
            `<react-test-1 :scope="react-test-1" :defined=""><span>Update</span><div></div></react-test-1>`
        );
    });

    test('should update text content with multiple text nodes', async () => {
        DNA.define(
            'react-test-2',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => React.createElement('react-test-2', null, [text, ' ', 'children']);
        const root = ReactDOM.createRoot(wrapper);
        root.render(Template('Text'));
        await new Promise((resolve) => setTimeout(resolve, 10));

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Text');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<react-test-2 :scope="react-test-2" :defined=""><span>Text children</span><div></div></react-test-2>`
        );

        root.render(Template('Update'));
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Update');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<react-test-2 :scope="react-test-2" :defined=""><span>Update children</span><div></div></react-test-2>`
        );
    });

    test('should update named slots', async () => {
        DNA.define(
            'react-test-3',
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
            React.createElement('react-test-3', null, [
                'Text ',
                title
                    ? React.createElement('h1', { slot: 'children', key: 1 }, 'Title')
                    : React.createElement('h2', { slot: 'children', key: 2 }, 'Subtitle'),
                '\n',
            ]);
        const root = ReactDOM.createRoot(wrapper);
        root.render(Template(true));
        await new Promise((resolve) => setTimeout(resolve, 10));

        const element = wrapper.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(wrapper.innerHTML).toBe(
            `<react-test-3 :scope="react-test-3" :defined=""><span>Text \n</span><div><h1 slot="children">Title</h1></div></react-test-3>`
        );

        root.render(Template(false));
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML).toBe(
            `<react-test-3 :scope="react-test-3" :defined=""><span>Text \n</span><div><h2 slot="children">Subtitle</h2></div></react-test-3>`
        );
    });
});
