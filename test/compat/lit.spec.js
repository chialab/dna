import * as DNA from '@chialab/dna';
import { html, render } from 'lit';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('Lit compatibility', () => {
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
            'lit-test-1',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => html`<lit-test-1>${text}</lit-test-1>`;
        render(Template('Text'), wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(
            `<!----><lit-test-1 :scope="lit-test-1" :defined=""><span>Text</span><div></div></lit-test-1>`
        );

        render(Template('Update'), wrapper);
        expect(element.childNodes[0].textContent).toBe('Update');
        expect(wrapper.innerHTML).toBe(
            `<!----><lit-test-1 :scope="lit-test-1" :defined=""><span>Update</span><div></div></lit-test-1>`
        );
    });

    test('should update text content with multiple text nodes', () => {
        DNA.define(
            'lit-test-2',
            class extends DNA.Component {
                render() {
                    return DNA.html`
                        <span>${this.childNodesBySlot(null)}</span>
                        <div>${this.childNodesBySlot('children')}</div>
                    `;
                }
            }
        );
        const Template = (text) => html`<lit-test-2>${text} ${'children'}</lit-test-2>`;
        render(Template('Text'), wrapper);

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Text');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<!----><lit-test-2 :scope="lit-test-2" :defined=""><span>Text children</span><div></div></lit-test-2>`
        );

        render(Template('Update'), wrapper);
        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(element.childNodes[0].childNodes[0].textContent).toBe('Update');
        expect(element.childNodes[0].childNodes[2].textContent).toBe('children');
        expect(wrapper.innerHTML).toBe(
            `<!----><lit-test-2 :scope="lit-test-2" :defined=""><span>Update children</span><div></div></lit-test-2>`
        );
    });

    test('should update named slots', () => {
        DNA.define(
            'lit-test-3',
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
            html`<lit-test-3>
                Text ${title ? html`<h1 slot="children">Title</h1>` : html`<h2 slot="children">Subtitle</h2>`}
            </lit-test-3>`;
        render(Template(true), wrapper);

        const element = wrapper.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            `<!----><lit-test-3 :scope="lit-test-3" :defined=""><span>Text </span><div><h1 slot="children">Title</h1></div></lit-test-3>`
        );

        render(Template(false), wrapper);
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            `<!----><lit-test-3 :scope="lit-test-3" :defined=""><span>Text </span><div><h2 slot="children">Subtitle</h2></div></lit-test-3>`
        );
    });

    test('nested slot', () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'lit-test-4',
            class extends DNA.Component {
                render() {
                    return DNA.h(
                        DNA.Fragment,
                        null,
                        DNA.h(
                            'div',
                            { class: 'layout-header' },
                            DNA.h('lit-test-4-title', null, DNA.h('slot', { name: 'title' }))
                        ),
                        DNA.h('div', { class: 'layout-body' }, DNA.h('slot'))
                    );
                }
            }
        );
        DNA.define(
            'lit-test-4-title',
            class MyTitle extends DNA.Component {
                render() {
                    return DNA.h('span', { class: 'title' }, DNA.h('slot', {}, ['Untitled']));
                }
            }
        );
        const template = (showTitle = false) =>
            html`<lit-test-4 key="1">
                ${showTitle ? html`<h1 slot="title">Title</h1>` : null}
                <img
                    src=${IMG}
                    alt="" />
                <p>Body</p>
            </lit-test-4>`;
        render(template(), wrapper);
        const element = wrapper.children[0];
        expect(element.children).toHaveLength(2);
        expect(element.children[0].tagName).toBe('DIV');
        expect(element.children[0].className).toBe('layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('lit-test-4-title'.toUpperCase());
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Untitled');
        render(template(true), wrapper);
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('DIV');
        expect(element.children[1].className).toBe('layout-body');
        expect(element.children[1].children[0].tagName).toBe('IMG');
        expect(element.children[1].children[0].getAttribute('src')).toBe(IMG);
        expect(element.children[1].children[1].tagName).toBe('P');
        expect(element.children[1].children[1].textContent).toBe('Body');
    });

    test('slot moved across elements', () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'lit-test-5-card',
            class MyCard extends DNA.Component {
                render() {
                    return DNA.h('slot');
                }
            }
        );
        const Template = (collapsed = false) =>
            html`<lit-test-5 .collapsed=${collapsed}>
                <h1>Title</h1>
                <img
                    src=${IMG}
                    alt="" />
                <p>Body</p>
            </lit-test-5>`;
        render(Template(), wrapper);
        DNA.define(
            'lit-test-5',
            class MyElement extends DNA.Component {
                static get properties() {
                    return {
                        collapsed: Boolean,
                    };
                }

                render() {
                    if (this.collapsed) {
                        return DNA.h('slot');
                    }
                    return DNA.h('lit-test-5-card', {}, DNA.h('slot'));
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
        render(Template(true), wrapper);
        expect(element.children[0].tagName).toBe('H1');
        expect(element.children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('IMG');
        expect(element.children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[2].tagName).toBe('P');
        expect(element.children[2].textContent).toBe('Body');
        render(Template(false), wrapper);
        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');
    });

    test('slot moved and replaced', () => {
        DNA.define(
            'lit-test-6',
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        switch: Boolean,
                    };
                }

                render() {
                    return [
                        DNA.h('div', { class: 'parent-1' }, this.switch ? DNA.h('slot') : 'Empty'),
                        DNA.h('div', { class: 'parent-2' }, !this.switch ? DNA.h('slot') : 'Empty'),
                    ];
                }
            }
        );
        const Template = (switchValue = false) =>
            html`<lit-test-6 .switch=${switchValue}>${!switchValue ? 'Hello' : 'World'}</lit-test-6>`;
        render(Template(), wrapper);
        const element = wrapper.children[0];
        expect(element.querySelector('.parent-1').textContent).toBe('Empty');
        expect(element.querySelector('.parent-2').textContent).toBe('Hello');
        render(Template(true), wrapper);
        expect(element.querySelector('.parent-1').textContent).toBe('World');
        expect(element.querySelector('.parent-2').textContent).toBe('Empty');
    });
});
