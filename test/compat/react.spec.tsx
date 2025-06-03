import * as DNA from '@chialab/dna';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('React compatibility', () => {
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
            'react-test-1',
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
        const Template = (text: string) => React.createElement('react-test-1', null, [text]);
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
                    return (
                        <>
                            <span>{this.childNodesBySlot(null)}</span>
                            <div>{this.childNodesBySlot('children')}</div>
                        </>
                    );
                }
            }
        );
        const Template = (text: string) => React.createElement('react-test-2', null, [text, ' ', 'children']);
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

    test('nested slot', async () => {
        const IMG = 'data:image/png;base64,';
        DNA.define(
            'react-test-4',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <div class="layout-header">
                                <react-test-4-title>
                                    <slot name="title" />
                                </react-test-4-title>
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
            'react-test-4-title',
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
            React.createElement('react-test-4', { key: '1' }, [
                showTitle ? React.createElement('h1', { slot: 'title' }, 'Title') : null,
                React.createElement('img', { src: IMG, alt: '' }),
                React.createElement('p', null, 'Body'),
            ]);
        const root = ReactDOM.createRoot(wrapper);
        root.render(template());
        await new Promise((resolve) => setTimeout(resolve, 10));
        const element = wrapper.children[0];
        expect(element.children).toHaveLength(2);
        expect(element.children[0].tagName).toBe('DIV');
        expect(element.children[0].className).toBe('layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('react-test-4-title'.toUpperCase());
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Untitled');
        root.render(template(true));
        await new Promise((resolve) => setTimeout(resolve, 10));
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
            'react-test-5-card',
            class MyCard extends DNA.Component {
                render() {
                    return <slot />;
                }
            }
        );
        const Template = (collapsed = false) =>
            React.createElement('react-test-5', { collapsed }, [
                React.createElement('h1', null, 'Title'),
                React.createElement('img', { src: IMG, alt: '' }),
                React.createElement('p', null, 'Body'),
            ]);
        const root = ReactDOM.createRoot(wrapper);
        root.render(Template());
        await new Promise((resolve) => setTimeout(resolve, 10));
        DNA.define(
            'react-test-5',
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
                        <react-test-5-card>
                            <slot />
                        </react-test-5-card>
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
        root.render(Template(true));
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(element.children[0].tagName).toBe('H1');
        expect(element.children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('IMG');
        expect(element.children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[2].tagName).toBe('P');
        expect(element.children[2].textContent).toBe('Body');
        root.render(Template(false));
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe(IMG);
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');
    });

    test('slot moved and replaced', async () => {
        DNA.define(
            'react-test-6',
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
            React.createElement('react-test-6', { switch: switchValue }, [switchValue ? 'World' : 'Hello']);
        const root = ReactDOM.createRoot(wrapper);
        root.render(Template());
        await new Promise((resolve) => setTimeout(resolve, 10));
        const element = wrapper.children[0];
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');
        root.render(Template(true));
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
