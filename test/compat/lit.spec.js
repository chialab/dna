import * as DNA from '@chialab/dna';
import { render } from 'lit';
import { html, literal } from 'lit/static-html.js';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { getComponentName } from '../helpers.js';

describe.runIf(typeof window !== 'undefined')('Lit', () => {
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
        const is = getComponentName();
        const tag = literal([is]);
        DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => html`<${tag}>${text}</${tag}>`;
        render(Template('Text'), wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(`<!----><${is} :scope="${is}" :defined=""><span>Text</span><div></div></${is}>`);

        render(Template('Update'), wrapper);
        expect(element.childNodes[0].textContent).toBe('Update');
        expect(wrapper.innerHTML).toBe(
            `<!----><${is} :scope="${is}" :defined=""><span>Update</span><div></div></${is}>`
        );
    });

    test('should update text content with multiple text nodes', () => {
        const is = getComponentName();
        const tag = literal([is]);
        DNA.define(
            is,
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => html`<${tag}>${text} ${'children'}</${tag}>`;
        render(Template('Text'), wrapper);

        const element = wrapper.children[0];
        expect(element.parentNode).toBe(wrapper);
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Text');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<!----><${is} :scope="${is}" :defined=""><span>Text children</span><div></div></${is}>`
        );

        render(Template('Update'), wrapper);
        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Update');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<!----><${is} :scope="${is}" :defined=""><span>Update children</span><div></div></${is}>`
        );
    });

    test('should update named slots', () => {
        const is = getComponentName();
        const tag = literal([is]);
        DNA.define(
            is,
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
            html`<${tag}>
                Text ${title ? html`<h1 slot="children">Title</h1>` : html`<h2 slot="children">Subtitle</h2>`}
            </${tag}>`;
        render(Template(true), wrapper);

        const element = wrapper.children[0];
        const textNode = element.childNodes[0];
        const lastNode = element.childNodes[3];

        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            `<!----><${is} :scope="${is}" :defined=""><span>Text </span><div><h1 slot="children">Title</h1></div></${is}>`
        );

        render(Template(false), wrapper);
        expect(element.childNodes[0]).toBe(textNode);
        expect(element.childNodes[3]).toBe(lastNode);
        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            `<!----><${is} :scope="${is}" :defined=""><span>Text </span><div><h2 slot="children">Subtitle</h2></div></${is}>`
        );
    });
});
