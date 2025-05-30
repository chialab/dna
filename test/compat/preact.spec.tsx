import * as DNA from '@chialab/dna';
import { h, render } from 'preact';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('Preact compatibility', () => {
    let wrapper: HTMLElement;
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
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const Template = (text: string) => h('preact-test-1', null, [text]);
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
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const Template = (text: string) => h('preact-test-2', null, [text, ' ', 'children']);
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

    test('nested slot', () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'preact-test-4',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <div class="layout-header">
                                <preact-test-4-title>
                                    <slot name="title" />
                                </preact-test-4-title>
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
            'preact-test-4-title',
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

        const template = (showTitle = false) =>
            h('preact-test-4', { key: '1' }, [
                showTitle ? h('h1', { slot: 'title' }, 'Title') : null,
                h('img', { src: IMG, alt: '' }),
                h('p', null, 'Body'),
            ]);
        render(template(), wrapper);
        const element = wrapper.children[0];
        expect(element.children).toHaveLength(2);
        expect(element.children[0].tagName).toBe('DIV');
        expect(element.children[0].className).toBe('layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('preact-test-4-title'.toUpperCase());
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
            'preact-test-5-card',
            class MyCard extends DNA.Component {
                render() {
                    return <slot />;
                }
            }
        );
        const Template = (collapsed = false) =>
            h('preact-test-5', { collapsed }, [
                h('h1', null, 'Title'),
                h('img', { src: IMG, alt: '' }),
                h('p', null, 'Body'),
            ]);
        render(Template(), wrapper);
        DNA.define(
            'preact-test-5',
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
                        <preact-test-5-card>
                            <slot />
                        </preact-test-5-card>
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
            'preact-test-6',
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
            h('preact-test-6', { switch: switchValue }, [switchValue ? 'World' : 'Hello']);
        render(Template(), wrapper);
        const element = wrapper.children[0];
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');
        render(Template(true), wrapper);
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
