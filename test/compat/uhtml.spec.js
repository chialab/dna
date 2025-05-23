import * as DNA from '@chialab/dna';
import { html, render } from 'uhtml';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('uhtml compatibility', () => {
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
            'uhtml-test-1',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => html`<uhtml-test-1>${text}</uhtml-test-1>`;
        render(wrapper, Template('Text'));

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(
            `<uhtml-test-1 :scope="uhtml-test-1" :defined=""><span>Text</span><div></div></uhtml-test-1>`
        );

        render(wrapper, Template('Update'));
        expect(element.childNodes[0].textContent).toBe('Update');
        expect(wrapper.innerHTML).toBe(
            `<uhtml-test-1 :scope="uhtml-test-1" :defined=""><span>Update</span><div></div></uhtml-test-1>`
        );
    });

    test('should update text content with multiple text nodes', () => {
        DNA.define(
            'uhtml-test-2',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => html`<uhtml-test-2>${text} children</uhtml-test-2>`;
        render(wrapper, Template('Text'));

        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            '<uhtml-test-2 :scope="uhtml-test-2" :defined=""><span>Text children</span><div></div></uhtml-test-2>'
        );

        render(wrapper, Template('Update'));
        expect(wrapper.innerHTML).toBe(
            '<uhtml-test-2 :scope="uhtml-test-2" :defined=""><span>Update children</span><div></div></uhtml-test-2>'
        );
    });

    test('should update named slots', () => {
        DNA.define(
            'uhtml-test-3',
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
            html`<uhtml-test-3>
                Text ${title ? html`<h1 slot="children">Title</h1>` : html`<h2 slot="children">Subtitle</h2>`}
            </uhtml-test-3>`;
        render(wrapper, Template(true));

        const element = wrapper.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            '<uhtml-test-3 :scope="uhtml-test-3" :defined=""><span>Text </span><div><h1 slot="children">Title</h1></div></uhtml-test-3>'
        );

        render(wrapper, Template(false));
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            '<uhtml-test-3 :scope="uhtml-test-3" :defined=""><span>Text </span><div><h2 slot="children">Subtitle</h2></div></uhtml-test-3>'
        );
    });
});
