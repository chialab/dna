import * as DNA from '@chialab/dna';
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('uhtml compatibility', () => {
    let wrapper: HTMLElement;
    let html: typeof import('uhtml').html;
    let render: typeof import('uhtml').render;

    beforeAll(async () => {
        const uhtml = await import('uhtml');
        html = uhtml.html;
        render = uhtml.render;
    });

    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.remove();
    });

    test('should update text content', () => {
        DNA.define(
            'uhtml-test-1',
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
        const template = (text: string) => html`<uhtml-test-1>${text}</uhtml-test-1>`;
        render(wrapper, template('Text'));

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(wrapper.innerHTML).toBe(
            `<uhtml-test-1 :scope="uhtml-test-1" :defined=""><span>Text</span><div></div></uhtml-test-1>`
        );

        render(wrapper, template('Update'));
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
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const Template = (text: string) => html`<uhtml-test-2>${text} children</uhtml-test-2>`;
        render(wrapper, Template('Text'));

        const element = wrapper.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(wrapper.innerHTML.replace(/\n\s+/g, '')).toBe(
            '<uhtml-test-2 :scope="uhtml-test-2" :defined=""><span>Text children</span><div></div></uhtml-test-2>'
        );

        render(wrapper, Template('Update'));
        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(wrapper.innerHTML).toBe(
            '<uhtml-test-2 :scope="uhtml-test-2" :defined=""><span>Update children</span><div></div></uhtml-test-2>'
        );
    });

    test('should update named slots', () => {
        DNA.define(
            'uhtml-test-3',
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
        const Template = (title: boolean) =>
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

    test('nested slot', () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'uhtml-test-4',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <div class="layout-header">
                                <uhtml-test-4-title>
                                    <slot name="title" />
                                </uhtml-test-4-title>
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
            'uhtml-test-4-title',
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

        const Template = (showTitle = false) =>
            html`<uhtml-test-4>
                ${showTitle ? html`<h1 slot="title">Title</h1>` : null}
                <img
                    src=${IMG}
                    alt="" />
                <p>Body</p>
            </uhtml-test-4>`;
        render(wrapper, Template());
        const element = wrapper.children[0];
        expect(element.children).toHaveLength(2);
        expect(element.children[0].tagName).toBe('DIV');
        expect(element.children[0].className).toBe('layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('uhtml-test-4-title'.toUpperCase());
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Untitled');
        render(wrapper, Template(true));
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
            'uhtml-test-5-card',
            class MyCard extends DNA.Component {
                render() {
                    return <slot />;
                }
            }
        );
        const Template = (collapsed = false) =>
            html`<uhtml-test-5 .collapsed=${collapsed}>
                <h1>Title</h1>
                <img
                    src=${IMG}
                    alt="" />
                <p>Body</p>
            </uhtml-test-5>`;
        render(wrapper, Template());
        DNA.define(
            'uhtml-test-5',
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
                        <uhtml-test-5-card>
                            <slot />
                        </uhtml-test-5-card>
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
        render(wrapper, Template(true));
        expect(element.children[0].tagName).toBe('H1');
        expect(element.children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('IMG');
        expect(element.children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[2].tagName).toBe('P');
        expect(element.children[2].textContent).toBe('Body');
        render(wrapper, Template(false));
        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');
    });

    test('slot moved and replaced', () => {
        DNA.define(
            'uhtml-test-6',
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
        const Template = (switchValue = false) =>
            html`<uhtml-test-6 .switch=${switchValue}>${!switchValue ? 'Hello' : 'World'}</uhtml-test-6>`;
        render(wrapper, Template());
        const element = wrapper.children[0];
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');
        render(wrapper, Template(true));
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
