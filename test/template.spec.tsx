import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IS_BROWSER } from './helpers';

describe.runIf(IS_BROWSER)(
    'template',
    () => {
        const IMG = 'data:image/png;base64,';

        let wrapper: HTMLElement;
        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        describe('simple', () => {
            it('jsx', () => {
                DNA.render(<h1>Hello world!</h1>, wrapper);
                expect(wrapper.children).toHaveLength(1);
                expect(wrapper.children[0]).toHaveProperty('tagName', 'H1');
                expect(wrapper.children[0]).toHaveProperty('textContent', 'Hello world!');
            });

            it('html helper', () => {
                DNA.render(DNA.html`<h1>Hello world!</h1>`, wrapper);
                expect(wrapper.children).toHaveLength(1);
                expect(wrapper.children[0]).toHaveProperty('tagName', 'H1');
                expect(wrapper.children[0]).toHaveProperty('textContent', 'Hello world!');
            });

            it('html helper (with uppercase)', () => {
                DNA.render(DNA.html`<H1>Hello world!</H1>`, wrapper);
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(wrapper.childNodes[0]).toHaveProperty('textContent', 'Hello world!');
            });

            it('compile helper', () => {
                DNA.render(DNA.compile('<h1>Hello world!</h1>'), wrapper);
                expect(wrapper.children).toHaveLength(1);
                expect(wrapper.children[0]).toHaveProperty('tagName', 'H1');
                expect(wrapper.children[0]).toHaveProperty('textContent', 'Hello world!');
            });
        });

        describe('content interpolation', () => {
            it('jsx', () => {
                DNA.render(
                    <h1>
                        Hello! My name is {'Alan'} and my favorite number is {42}
                    </h1>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(wrapper.childNodes[0]).toHaveProperty(
                    'textContent',
                    'Hello! My name is Alan and my favorite number is 42'
                );
            });

            it('html helper', () => {
                DNA.render(DNA.html`<h1>Hello! My name is ${'Alan'} and my favorite number is ${42}</h1>`, wrapper);
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(wrapper.childNodes[0]).toHaveProperty(
                    'textContent',
                    'Hello! My name is Alan and my favorite number is 42'
                );
            });
        });

        describe('attribute interpolation', () => {
            it('jsx', () => {
                DNA.render(
                    <input
                        name={'filter'}
                        disabled={true}
                        required
                    />,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'INPUT');
                expect(wrapper.childNodes[0]).toHaveProperty(
                    'outerHTML',
                    '<input name="filter" disabled="" required="">'
                );
            });

            it('html helper', () => {
                DNA.render(DNA.html`<input name=${'filter'} disabled=${true} required />`, wrapper);
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'INPUT');
                expect(wrapper.childNodes[0]).toHaveProperty(
                    'outerHTML',
                    '<input name="filter" disabled="" required="">'
                );
            });
        });

        describe('loops', () => {
            it('jsx', () => {
                DNA.render(
                    <ul>
                        {['Alan', 'Brian', 'Carl'].map((item, index) => (
                            <li>
                                {index}. {item}
                            </li>
                        ))}
                    </ul>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'UL');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(3);
                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'LI');
                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('textContent', '0. Alan');
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'LI');
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('textContent', '1. Brian');
                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'LI');
                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('textContent', '2. Carl');
            });

            it('html helper', () => {
                DNA.render(
                    DNA.html`<ul>
                        ${['Alan', 'Brian', 'Carl'].map((item, index) => DNA.html`<li>${index}. ${item}</li>`)}
                    </ul>`,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(1);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'UL');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(3);
                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'LI');
                expect(wrapper.childNodes[0].childNodes[0]).toHaveProperty('textContent', '0. Alan');
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'LI');
                expect(wrapper.childNodes[0].childNodes[1]).toHaveProperty('textContent', '1. Brian');
                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'LI');
                expect(wrapper.childNodes[0].childNodes[2]).toHaveProperty('textContent', '2. Carl');
            });
        });

        describe('conditionals', () => {
            const avatar = IMG;
            const title = 'Romeo';
            const members: string[] = [];

            it('jsx', () => {
                DNA.render(
                    <>
                        {avatar && (
                            <img
                                src={avatar}
                                alt=""
                            />
                        )}
                        <h1>{title || 'Untitled'}</h1>
                        {members.length ? `${members.length} members` : 'No members'}
                    </>,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(3);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'IMG');
                expect(wrapper.childNodes[0]).toHaveProperty('src', IMG);
                expect(wrapper.childNodes[1]).toHaveProperty('tagName', 'H1');
                expect(wrapper.childNodes[1]).toHaveProperty('textContent', 'Romeo');
                expect(wrapper.childNodes[2]).toHaveProperty('textContent', 'No members');
            });

            it('html helper', () => {
                DNA.render(
                    DNA.html`
                        ${avatar && DNA.html`<img src=${avatar} alt="" />`}
                        <h1>${title || 'Untitled'}</h1>
                        ${members.length ? DNA.html`${members.length} members` : 'No members'}
                    `,
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(3);
                expect(wrapper.childNodes[0]).toHaveProperty('tagName', 'IMG');
                expect(wrapper.childNodes[0]).toHaveProperty('src', IMG);
                expect(wrapper.childNodes[1]).toHaveProperty('tagName', 'H1');
                expect(wrapper.childNodes[1]).toHaveProperty('textContent', 'Romeo');
                expect(wrapper.childNodes[2]).toHaveProperty('textContent', 'No members');
            });
        });

        describe('style', () => {
            it('jsx', async () => {
                @DNA.customElement('test-template-1', { extends: 'div' })
                class MyElement extends DNA.HTML.Div {
                    render() {
                        return <style>{'.test {}'}</style>;
                    }
                }

                // @ts-ignore We cannot define a builtin custom element type inside a test
                const element = DNA.render(<div is="test-template-1" />, wrapper) as MyElement;
                await new Promise((r) => setTimeout(r, 0));
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'STYLE');
                expect(element.childNodes[0]).toHaveProperty('textContent', '[:scope="test-template-1"] .test {}');
            });

            it('html helper', async () => {
                @DNA.customElement('test-template-2', { extends: 'div' })
                class MyElement extends DNA.HTML.Div {
                    render() {
                        return DNA.html`<style>.test {}</style>`;
                    }
                }

                // @ts-ignore We cannot define a builtin custom element type inside a test
                const element = DNA.render(<div is="test-template-2" />, wrapper) as MyElement;
                await new Promise((r) => setTimeout(r, 0));
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'STYLE');
                expect(element.childNodes[0]).toHaveProperty('textContent', '[:scope="test-template-2"] .test {}');
            });
        });

        describe('slot', () => {
            it('jsx', () => {
                @DNA.customElement('test-template-3')
                class MyElement extends DNA.Component {
                    render() {
                        return (
                            <>
                                <div class="layout-header">
                                    <test-template-4>
                                        <slot name="title" />
                                    </test-template-4>
                                </div>
                                <div class="layout-body">
                                    <slot />
                                </div>
                            </>
                        );
                    }
                }

                @DNA.customElement('test-template-4')
                class MyTitle extends DNA.Component {
                    render() {
                        return (
                            <span class="title">
                                <slot>Untitled</slot>
                            </span>
                        );
                    }
                }

                const element = DNA.render(
                    <test-template-3>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-3>,
                    wrapper
                ) as MyElement;
                expect(element.childNodes).toHaveLength(2);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0]).toHaveProperty('className', 'layout-header');
                expect(element.childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'TEST-TEMPLATE-4');
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Untitled');
                DNA.render(
                    <test-template-3>
                        <h1 slot="title">Title</h1>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-3>,
                    wrapper
                );
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[1]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[1]).toHaveProperty('className', 'layout-body');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('src', IMG);
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Body');
            });

            it('html helper', () => {
                @DNA.customElement('test-template-5')
                class MyElement extends DNA.Component {
                    render() {
                        return DNA.html`
                            <div class="layout-header">
                                <test-template-6>
                                    <slot name="title" />
                                </test-template-6>
                            </div>
                            <div class="layout-body">
                                <slot />
                            </div>
                        `;
                    }
                }

                @DNA.customElement('test-template-6')
                class MyTitle extends DNA.Component {
                    render() {
                        return (
                            <span class="title">
                                <slot>Untitled</slot>
                            </span>
                        );
                    }
                }

                const element = DNA.render(
                    <test-template-5>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-5>,
                    wrapper
                ) as MyElement;
                expect(element.childNodes).toHaveLength(2);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0]).toHaveProperty('className', 'layout-header');
                expect(element.childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'TEST-TEMPLATE-6');
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Untitled');
                DNA.render(
                    <test-template-5>
                        <h1 slot="title">Title</h1>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-5>,
                    wrapper
                );
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[1]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[1]).toHaveProperty('className', 'layout-body');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('src', IMG);
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Body');
            });
        });

        describe('slot with upgraded elements', () => {
            it('jsx', () => {
                const element = DNA.render(
                    <test-template-7>
                        <h1 slot="title">Title</h1>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-7>,
                    wrapper
                ) as MyElement;

                @DNA.customElement('test-template-7')
                class MyElement extends DNA.Component {
                    render() {
                        return (
                            <>
                                <div class="layout-header">
                                    <slot name="title" />
                                </div>
                                <div class="layout-body">
                                    <slot />
                                </div>
                            </>
                        );
                    }
                }
                window.customElements.upgrade(element);

                expect(element.childNodes).toHaveLength(2);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0]).toHaveProperty('className', 'layout-header');
                expect(element.childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[1]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[1]).toHaveProperty('className', 'layout-body');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('src', IMG);
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Body');
            });

            it('html helper', () => {
                const element = DNA.render(
                    <test-template-8>
                        <h1 slot="title">Title</h1>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-8>,
                    wrapper
                ) as MyElement;

                @DNA.customElement('test-template-8')
                class MyElement extends DNA.Component {
                    render() {
                        return DNA.html`
                            <div class="layout-header">
                                <slot name="title" />
                            </div>
                            <div class="layout-body">
                                <slot />
                            </div>
                        `;
                    }
                }
                window.customElements.upgrade(element);

                expect(element.childNodes).toHaveLength(2);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0]).toHaveProperty('className', 'layout-header');
                expect(element.childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[1]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[1]).toHaveProperty('className', 'layout-body');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[1].childNodes[0]).toHaveProperty('src', IMG);
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[1].childNodes[1]).toHaveProperty('textContent', 'Body');
            });
        });

        describe('slot moved across elements', () => {
            it('jsx', () => {
                const element = DNA.render(
                    <test-template-9>
                        <h1>Title</h1>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-9>,
                    wrapper
                ) as MyElement;

                @DNA.customElement('test-template-10')
                class MyCard extends DNA.Component {
                    render() {
                        return <slot />;
                    }
                }

                @DNA.customElement('test-template-9')
                class MyElement extends DNA.Component {
                    @DNA.property({ type: Boolean })
                    collapsed = false;

                    render() {
                        if (this.collapsed) {
                            return <slot />;
                        }

                        return (
                            <test-template-10>
                                <slot />
                            </test-template-10>
                        );
                    }
                }

                window.customElements.upgrade(element);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('src', IMG);
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Body');
                element.collapsed = true;
                expect(element.childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[1]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[1]).toHaveProperty('src', IMG);
                expect(element.childNodes[2]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[2]).toHaveProperty('textContent', 'Body');
                element.collapsed = false;
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('src', IMG);
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Body');
            });

            it('html helper', () => {
                const element = DNA.render(
                    <test-template-11>
                        <h1>Title</h1>
                        <img
                            src={IMG}
                            alt=""
                        />
                        <p>Body</p>
                    </test-template-11>,
                    wrapper
                ) as MyElement;

                @DNA.customElement('test-template-12')
                class MyCard extends DNA.Component {
                    render() {
                        return DNA.html`<slot />`;
                    }
                }

                @DNA.customElement('test-template-11')
                class MyElement extends DNA.Component {
                    @DNA.property({ type: Boolean })
                    collapsed = false;

                    render() {
                        if (this.collapsed) {
                            return DNA.html`<slot />`;
                        }

                        return DNA.html`<test-template-12>
                            <slot />
                        </test-template-12>`;
                    }
                }

                window.customElements.upgrade(element);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('src', IMG);
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Body');
                element.collapsed = true;
                expect(element.childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[1]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[1]).toHaveProperty('src', IMG);
                expect(element.childNodes[2]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[2]).toHaveProperty('textContent', 'Body');
                element.collapsed = false;
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'H1');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Title');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'IMG');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('src', IMG);
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('tagName', 'P');
                expect(element.childNodes[0].childNodes[2]).toHaveProperty('textContent', 'Body');
            });
        });

        describe('slot moved and replaced', () => {
            it('jsx', () => {
                @DNA.customElement('test-template-13')
                class TestElement extends DNA.Component {
                    @DNA.property({ type: Boolean })
                    switch = false;

                    render() {
                        return (
                            <>
                                <div class="parent-1">{this.switch ? <slot /> : 'Empty'}</div>
                                <div class="parent-2">{!this.switch ? <slot /> : 'Empty'}</div>
                            </>
                        );
                    }
                }

                const element = new TestElement();
                wrapper.appendChild(element);
                element.appendChild(document.createTextNode('Hello'));
                expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
                expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');
                element.switch = true;
                expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Hello');
                expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
            });

            it('html helper', () => {
                @DNA.customElement('test-template-14')
                class TestElement extends DNA.Component {
                    @DNA.property({ type: Boolean })
                    switch = false;

                    render() {
                        return DNA.html`
                            <div class="parent-1">${this.switch ? DNA.html`<slot />` : 'Empty'}</div>
                            <div class="parent-2">${!this.switch ? DNA.html`<slot />` : 'Empty'}</div>
                        `;
                    }
                }

                const element = new TestElement();
                wrapper.appendChild(element);
                element.appendChild(document.createTextNode('Hello'));
                expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Empty');
                expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Hello');
                element.switch = true;
                expect(element.querySelector('.parent-1')).toHaveProperty('textContent', 'Hello');
                expect(element.querySelector('.parent-2')).toHaveProperty('textContent', 'Empty');
            });
        });

        describe('events', () => {
            describe('should add an event listener', () => {
                it('jsx', () => {
                    const listener = vi.fn((event) => {
                        event.preventDefault();
                    });

                    const button = DNA.render(
                        <button
                            type="button"
                            onclick={listener}>
                            click me
                        </button>,
                        wrapper
                    ) as HTMLButtonElement;
                    button.click();

                    expect(listener).toHaveBeenCalled();
                });

                it('html helper', () => {
                    const listener = vi.fn((event) => {
                        event.preventDefault();
                    });

                    const button = DNA.render(
                        DNA.html`<button type="button" onclick=${listener}>click me</button>`,
                        wrapper
                    ) as HTMLButtonElement;
                    button.click();

                    expect(listener).toHaveBeenCalled();
                });
            });
        });

        describe('promises', () => {
            describe('should handle successfull promises', () => {
                it('jsx', async () => {
                    const promise = new Promise<string>((resolve) => {
                        setTimeout(() => resolve('World!'), 1000);
                    });

                    DNA.render(
                        <div>
                            {DNA.$until(promise, 'Loading...')}
                            <div>{DNA.$await(promise.then((res) => ['Hello ', res]))}</div>
                        </div>,
                        wrapper
                    );

                    expect(wrapper.innerHTML).toBe('<div><!---->Loading...<div><!----></div></div>');
                    DNA.render(
                        <div>
                            {DNA.$until(promise, 'Loading...')}
                            <div>{DNA.$await(promise.then((res) => ['Hello ', res]))}</div>
                        </div>,
                        wrapper
                    );
                    await new Promise((r) => setTimeout(r, 1500));
                    expect(wrapper.innerHTML).toBe('<div><!----><div><!---->Hello World!</div></div>');
                });

                it('html helper', async () => {
                    const promise = new Promise<string>((resolve) => {
                        setTimeout(() => resolve('World!'), 1000);
                    });

                    DNA.render(
                        DNA.html`<div>
                                ${DNA.$until(promise, 'Loading...')}
                                <div>${DNA.$await(promise.then((res) => DNA.html`Hello ${res}`))}</div>
                            </div>`,
                        wrapper
                    );

                    expect(wrapper.innerHTML).toBe('<div><!---->Loading...<div><!----></div></div>');
                    DNA.render(
                        DNA.html`<div>
                                ${DNA.$until(promise, 'Loading...')}
                                <div>${DNA.$await(promise.then((res) => DNA.html`Hello ${res}`))}</div>
                            </div>`,
                        wrapper
                    );
                    await new Promise((r) => setTimeout(r, 1500));
                    expect(wrapper.innerHTML).toBe('<div><!----><div><!---->Hello World!</div></div>');
                });
            });

            describe('should handle failed promises', () => {
                it('jsx', async () => {
                    const promise = new Promise((resolve, reject) => {
                        setTimeout(() => reject('timeout'), 1000);
                    });

                    DNA.render(
                        <div>
                            {DNA.$until(promise, 'Loading...')}
                            {DNA.$await(promise.catch((error) => ['Error ', error]))}
                        </div>,
                        wrapper
                    );

                    expect(wrapper.innerHTML).toBe('<div><!---->Loading...<!----></div>');
                    DNA.render(
                        <div>
                            {DNA.$until(promise, 'Loading...')}
                            {DNA.$await(promise.catch((error) => ['Error ', error]))}
                        </div>,
                        wrapper
                    );
                    await new Promise((r) => setTimeout(r, 1500));
                    expect(wrapper.innerHTML).toBe('<div><!----><!---->Error timeout</div>');
                });

                it('html helper', async () => {
                    const promise = new Promise((resolve, reject) => {
                        setTimeout(() => reject('timeout'), 1000);
                    });

                    DNA.render(
                        DNA.html`<div>
                            ${DNA.$until(promise, 'Loading...')}
                            ${DNA.$await(promise.catch((error) => DNA.html`Error ${error}`))}
                        </div>`,
                        wrapper
                    );

                    expect(wrapper.innerHTML).toBe('<div><!---->Loading...<!----></div>');
                    DNA.render(
                        DNA.html`<div>
                            ${DNA.$until(promise, 'Loading...')}
                            ${DNA.$await(promise.catch((error) => DNA.html`Error ${error}`))}
                        </div>`,
                        wrapper
                    );
                    await new Promise((r) => setTimeout(r, 1500));
                    expect(wrapper.innerHTML).toBe('<div><!----><!---->Error timeout</div>');
                });
            });

            it('should ignore outdated promises in template', async () => {
                let flag = false;
                const promise = new Promise((resolve) => {
                    setTimeout(() => {
                        flag = true;
                        DNA.render(Template(), wrapper);
                        resolve('World!');
                    }, 1000);
                });

                const Template = () => (
                    <div>
                        {!flag && DNA.$until(promise, 'Loading...')}
                        {flag && 'Done'}
                    </div>
                );

                DNA.render(Template(), wrapper);
                expect(wrapper.innerHTML).toBe('<div><!---->Loading...</div>');
                DNA.render(Template(), wrapper);
                await new Promise((r) => setTimeout(r, 1500));
                expect(wrapper.innerHTML).toBe('<div>Done</div>');
            });

            it('should ignore outdated dependents promises in template', async () => {
                const promise = new Promise((resolve) => {
                    setTimeout(() => resolve('World!'), 1000);
                });
                const promise2 = new Promise((resolve) => {
                    setTimeout(() => resolve('World!'), 500);
                });
                DNA.render(
                    <div>
                        {DNA.$until(
                            promise2,
                            promise.then((res) => <>Hello {res}</>)
                        )}
                    </div>,
                    wrapper
                );
                await new Promise((r) => setTimeout(r, 1500));
                expect(wrapper.innerHTML).toBe('<div><!----></div>');
            });
        });
    },
    10 * 1000
);
