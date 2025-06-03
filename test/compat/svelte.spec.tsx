import * as DNA from '@chialab/dna';
import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { IS_BROWSER } from '../helpers';

describe.runIf(IS_BROWSER)('Svelte', () => {
    test('should update text content', async () => {
        const { default: Test1 } = await import('./Test1.svelte');
        DNA.define(
            'svelte-test-1',
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
        const { container, rerender } = render(Test1, {
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0];
        expect(element.childNodes[0].textContent).toBe('Text');
        expect(container.innerHTML).toBe(
            '<svelte-test-1 :scope="svelte-test-1" :defined=""><span>Text</span><div></div></svelte-test-1>'
        );

        await rerender({ text: 'Update' });
        expect(element.childNodes[0].textContent).toBe('Update');
        expect(container.innerHTML).toBe(
            '<svelte-test-1 :scope="svelte-test-1" :defined=""><span>Update</span><div></div></svelte-test-1>'
        );
    });

    test('should update text content with multiple text nodes', async () => {
        const { default: Test2 } = await import('./Test2.svelte');
        DNA.define(
            'svelte-test-2',
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
        const { container, rerender } = render(Test2, {
            props: {
                text: 'Text',
            },
        });

        const element = container.children[0];
        expect(element.childNodes[0].textContent).toBe('Text children');
        expect(container.innerHTML).toBe(
            '<svelte-test-2 :scope="svelte-test-2" :defined=""><span>Text children</span><div></div></svelte-test-2>'
        );

        await rerender({ text: 'Update' });
        expect(element.childNodes[0].textContent).toBe('Update children');
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<svelte-test-2 :scope="svelte-test-2" :defined=""><span>Update children</span><div></div></svelte-test-2>'
        );
    });

    test('should update named slots', async () => {
        const { default: Test3 } = await import('./Test3.svelte');
        DNA.define(
            'svelte-test-3',
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
        const { container, rerender } = render(Test3, {
            props: {
                title: true,
            },
        });

        const element = container.children[0];
        const textNode = element.childNodes[0].childNodes[0];
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<svelte-test-3 :scope="svelte-test-3" :defined=""><span>Text  end</span><div><h1 slot="children">Title</h1></div></svelte-test-3>'
        );

        await rerender({ title: false });
        expect(element.childNodes[0].childNodes[0]).toBe(textNode);
        expect(container.innerHTML.replace(/\n\s+/g, ' ')).toBe(
            '<svelte-test-3 :scope="svelte-test-3" :defined=""><span>Text  end</span><div><h2 slot="children">Subitle</h2></div></svelte-test-3>'
        );
    });

    test('nested slot', async () => {
        const { default: Test4 } = await import('./Test4.svelte');
        DNA.define(
            'svelte-test-4',
            class extends DNA.Component {
                render() {
                    return (
                        <>
                            <div class="layout-header">
                                <svelte-test-4-title>
                                    <slot name="title" />
                                </svelte-test-4-title>
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
            'svelte-test-4-title',
            class MyTitle extends DNA.Component {
                render() {
                    return (
                        <>
                            <span class="title">
                                <slot>Untitled</slot>
                            </span>
                        </>
                    );
                }
            }
        );
        const { container, rerender } = render(Test4, {
            props: {
                title: false,
            },
        });
        const element = container.children[0];
        expect(element.children).toHaveLength(2);
        expect(element.children[0].tagName).toBe('DIV');
        expect(element.children[0].className).toBe('layout-header');
        expect(element.children[0].children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('svelte-test-4-title'.toUpperCase());
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Untitled');
        await rerender({ title: true });
        expect(element.children[0].children[0].children[0].tagName).toBe('SPAN');
        expect(element.children[0].children[0].children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('DIV');
        expect(element.children[1].className).toBe('layout-body');
        expect(element.children[1].children[0].tagName).toBe('IMG');
        expect(element.children[1].children[0].getAttribute('src')).toBe('data:image/png;base64,');
        expect(element.children[1].children[1].tagName).toBe('P');
        expect(element.children[1].children[1].textContent).toBe('Body');
    });

    test('slot moved across elements', async () => {
        const { default: Test5 } = await import('./Test5.svelte');
        const { container, rerender } = render(Test5, {
            props: {
                collapsed: false,
            },
        });
        DNA.define(
            'svelte-test-5',
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
                        <svelte-test-5-card>
                            <slot />
                        </svelte-test-5-card>
                    );
                }
            }
        );
        const element = container.children[0];
        window.customElements.upgrade(element);
        expect(element.children).toHaveLength(1);
        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe('data:image/png;base64,');
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');
        await rerender({ collapsed: true });
        expect(element.children[0].tagName).toBe('H1');
        expect(element.children[0].textContent).toBe('Title');
        expect(element.children[1].tagName).toBe('IMG');
        expect(element.children[1].getAttribute('src')).toBe('data:image/png;base64,');
        expect(element.children[2].tagName).toBe('P');
        expect(element.children[2].textContent).toBe('Body');
        await rerender({ collapsed: false });
        expect(element.children[0].children[0].tagName).toBe('H1');
        expect(element.children[0].children[0].textContent).toBe('Title');
        expect(element.children[0].children[1].tagName).toBe('IMG');
        expect(element.children[0].children[1].getAttribute('src')).toBe('data:image/png;base64,');
        expect(element.children[0].children[2].tagName).toBe('P');
        expect(element.children[0].children[2].textContent).toBe('Body');
    });

    test('slot moved and replaced', async () => {
        const { default: Test6 } = await import('./Test6.svelte');
        const { container, rerender } = render(Test6, {
            props: {
                switchValue: false,
            },
        });
        DNA.define(
            'svelte-test-6',
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

        const element = container.children[0];
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');
        await rerender({ switchValue: true });
        expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'World');
        expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
    });
});
