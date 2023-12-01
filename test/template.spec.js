import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getComponentName } from './helpers.js';

const IMG = 'data:image/png;base64,';

describe(
    'template',
    () => {
        let wrapper;
        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        describe('simple', () => {
            const TEMPLATES = {
                JSX() {
                    return DNA.h('h1', null, 'Hello world!');
                },
                HTML() {
                    return DNA.html`<h1>Hello world!</h1>`;
                },
                PLAIN_HTML() {
                    return DNA.compile('<h1>Hello world!</h1>');
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    DNA.render(TEMPLATES[type](), wrapper);
                    expect(wrapper.children).toHaveLength(1);
                    expect(wrapper.children[0].tagName).toBe('H1');
                    expect(wrapper.children[0].textContent).toBe('Hello world!');
                });
            }
        });

        describe('simple with uppercase', () => {
            const TEMPLATES = {
                JSX() {
                    return DNA.h('H1', null, 'Hello world!');
                },
                HTML() {
                    return DNA.html`<H1>Hello world!</H1>`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    DNA.render(TEMPLATES[type](), wrapper);
                    expect(wrapper.childNodes).toHaveLength(1);
                    expect(wrapper.childNodes[0].tagName).toBe('H1');
                    expect(wrapper.childNodes[0].textContent).toBe('Hello world!');
                });
            }
        });

        describe('content interpolation', () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h(
                        'h1',
                        null,
                        'Hello! My name is ',
                        context.name,
                        ' and my favorite number is ',
                        context.num
                    );
                },
                HTML(context) {
                    return DNA.html`<h1>Hello! My name is ${context.name} and my favorite number is ${context.num}</h1>`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    DNA.render(
                        TEMPLATES[type]({
                            name: 'Alan',
                            num: 42,
                        }),
                        wrapper
                    );
                    expect(wrapper.childNodes).toHaveLength(1);
                    expect(wrapper.childNodes[0].tagName).toBe('H1');
                    expect(wrapper.childNodes[0].textContent).toBe(
                        'Hello! My name is Alan and my favorite number is 42'
                    );
                });
            }
        });

        describe('attribute interpolation', () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h('input', {
                        name: context.name,
                        disabled: context.disabled,
                        required: true,
                    });
                },
                HTML(context) {
                    return DNA.html`<input name=${context.name} disabled=${context.disabled} required />`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    DNA.render(
                        TEMPLATES[type]({
                            name: 'filter',
                            disabled: true,
                        }),
                        wrapper
                    );
                    expect(wrapper.childNodes).toHaveLength(1);
                    expect(wrapper.childNodes[0].tagName).toBe('INPUT');
                    expect(wrapper.childNodes[0].outerHTML).toBe('<input name="filter" disabled="" required="">');
                });
            }
        });

        describe('loops', () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h(
                        'ul',
                        null,
                        context.items.map((item, index) => DNA.h('li', null, index, '. ', item))
                    );
                },
                HTML(context) {
                    return DNA.html`<ul>
                    ${context.items.map((item, index) => DNA.html`<li>${index}. ${item}</li>`)}
                </ul>`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    DNA.render(
                        TEMPLATES[type]({
                            items: ['Alan', 'Brian', 'Carl'],
                        }),
                        wrapper
                    );
                    expect(wrapper.childNodes).toHaveLength(1);
                    expect(wrapper.childNodes[0].tagName).toBe('UL');
                    expect(wrapper.childNodes[0].childNodes).toHaveLength(3);
                    expect(wrapper.childNodes[0].childNodes[0].tagName).toBe('LI');
                    expect(wrapper.childNodes[0].childNodes[0].textContent).toBe('0. Alan');
                    expect(wrapper.childNodes[0].childNodes[1].tagName).toBe('LI');
                    expect(wrapper.childNodes[0].childNodes[1].textContent).toBe('1. Brian');
                    expect(wrapper.childNodes[0].childNodes[2].tagName).toBe('LI');
                    expect(wrapper.childNodes[0].childNodes[2].textContent).toBe('2. Carl');
                });
            }
        });

        describe('conditionals', () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h(
                        DNA.Fragment,
                        null,
                        context.avatar && DNA.h('img', { src: context.avatar }),
                        DNA.h('h1', null, context.title || 'Untitled'),
                        context.members.length ? `${context.members.length} members` : 'No members'
                    );
                },
                HTML(context) {
                    return DNA.html`
                    ${context.avatar && DNA.html`<img src=${context.avatar} alt="" />`}
                    <h1>${context.title || 'Untitled'}</h1>
                    ${context.members.length ? DNA.html`${context.members.length} members` : 'No members'}`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    DNA.render(
                        TEMPLATES[type]({
                            avatar: IMG,
                            title: 'Romeo',
                            members: [],
                        }),
                        wrapper
                    );
                    expect(wrapper.childNodes).toHaveLength(3);
                    expect(wrapper.childNodes[0].tagName).toBe('IMG');
                    expect(wrapper.childNodes[0].getAttribute('src')).toBe(IMG);
                    expect(wrapper.childNodes[1].tagName).toBe('H1');
                    expect(wrapper.childNodes[1].textContent).toBe('Romeo');
                    expect(wrapper.childNodes[2].textContent).toBe('No members');
                });
            }
        });

        describe('style', () => {
            const TEMPLATES = {
                JSX() {
                    return DNA.h('style', {}, '.test {}');
                },
                HTML() {
                    return DNA.html`<style>.test {}</style>`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, async () => {
                    const rootName = getComponentName();
                    const MyElement = DNA.define(
                        `${rootName}-${type.toLowerCase()}`,
                        class MyElement extends DNA.HTML.Div {
                            render() {
                                return TEMPLATES[type]();
                            }
                        },
                        { extends: 'div' }
                    );

                    const element = DNA.render(DNA.h(MyElement), wrapper);
                    await new Promise((r) => setTimeout(r, 0));

                    const realm = element.realm;
                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].tagName).toBe('STYLE');
                    expect(element.childNodes[0].textContent).toBe(
                        `[:scope="${rootName}-${type.toLowerCase()}"] .test {}`
                    );
                    realm.dangerouslyClose();
                });
            }
        });

        describe('slot', () => {
            const TEMPLATES = {
                JSX(titleName) {
                    return DNA.h(
                        DNA.Fragment,
                        null,
                        DNA.h(
                            'div',
                            { class: 'layout-header' },
                            DNA.h(`${titleName}-jsx`, null, DNA.h('slot', { name: 'title' }))
                        ),
                        DNA.h('div', { class: 'layout-body' }, DNA.h('slot'))
                    );
                },
                HTML(titleName) {
                    return DNA.html`
                    <div class="layout-header">
                        <${`${titleName}-${'html'}`}>
                            <slot name="title" />
                        </>
                    </div>
                    <div class="layout-body">
                        <slot />
                    </div>
                `;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    const rootName = getComponentName();
                    const titleName = getComponentName();
                    DNA.define(
                        `${rootName}-${type.toLowerCase()}`,
                        class MyElement extends DNA.Component {
                            render() {
                                return TEMPLATES[type](titleName);
                            }
                        }
                    );
                    DNA.define(
                        `${titleName}-${type.toLowerCase()}`,
                        class MyTitle extends DNA.Component {
                            render() {
                                return DNA.h('span', { class: 'title' }, DNA.h('slot', {}, ['Untitled']));
                            }
                        }
                    );

                    const element = DNA.render(
                        DNA.h(
                            `${rootName}-${type.toLowerCase()}`,
                            null,
                            DNA.h('img', { src: IMG }),
                            DNA.h('p', null, 'Body')
                        ),
                        wrapper
                    );
                    const realm = element.realm;

                    realm.dangerouslyOpen();
                    const innerRealm = element.childNodes[0].childNodes[0].realm;
                    innerRealm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(2);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].className).toBe('layout-header');
                    expect(element.childNodes[0].childNodes).toHaveLength(1);
                    expect(element.childNodes[0].childNodes[0].tagName).toBe(`${titleName}-${type}`.toUpperCase());
                    expect(element.childNodes[0].childNodes[0].childNodes[0].tagName).toBe('SPAN');
                    expect(element.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('Untitled');
                    innerRealm.dangerouslyClose();
                    realm.dangerouslyClose();

                    DNA.render(
                        DNA.h(
                            `${rootName}-${type.toLowerCase()}`,
                            null,
                            DNA.h('h1', { slot: 'title' }, 'Title'),
                            DNA.h('img', { src: IMG }),
                            DNA.h('p', null, 'Body')
                        ),
                        wrapper
                    );

                    realm.dangerouslyOpen();
                    innerRealm.dangerouslyOpen();
                    expect(element.childNodes[0].childNodes[0].childNodes[0].tagName).toBe('SPAN');
                    expect(element.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('Title');
                    expect(element.childNodes[1].tagName).toBe('DIV');
                    expect(element.childNodes[1].className).toBe('layout-body');
                    expect(element.childNodes[1].childNodes[0].tagName).toBe('IMG');
                    expect(element.childNodes[1].childNodes[0].getAttribute('src')).toBe(IMG);
                    expect(element.childNodes[1].childNodes[1].tagName).toBe('P');
                    expect(element.childNodes[1].childNodes[1].textContent).toBe('Body');
                    innerRealm.dangerouslyClose();
                    realm.dangerouslyClose();
                });
            }
        });

        describe('slot with upgraded elements', () => {
            const TEMPLATES = {
                JSX() {
                    return DNA.h(
                        DNA.Fragment,
                        null,
                        DNA.h('div', { class: 'layout-header' }, DNA.h('slot', { name: 'title' })),
                        DNA.h('div', { class: 'layout-body' }, DNA.h('slot'))
                    );
                },
                HTML() {
                    return DNA.html`
                    <div class="layout-header">
                        <slot name="title" />
                    </div>
                    <div class="layout-body">
                        <slot />
                    </div>
                `;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    const name = getComponentName();
                    const element = DNA.render(
                        DNA.h(
                            `${name}-${type.toLowerCase()}`,
                            null,
                            DNA.h('h1', { slot: 'title' }, 'Title'),
                            DNA.h('img', { src: IMG }),
                            DNA.h('p', null, 'Body')
                        ),
                        wrapper
                    );

                    DNA.define(
                        `${name}-${type.toLowerCase()}`,
                        class MyElement extends DNA.Component {
                            render() {
                                return TEMPLATES[type]();
                            }
                        }
                    );
                    window.customElements.upgrade(element);

                    const realm = element.realm;

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(2);
                    expect(element.childNodes[0].tagName).toBe('DIV');
                    expect(element.childNodes[0].className).toBe('layout-header');
                    expect(element.childNodes[0].childNodes).toHaveLength(1);
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('H1');
                    expect(element.childNodes[0].childNodes[0].textContent).toBe('Title');
                    expect(element.childNodes[1].tagName).toBe('DIV');
                    expect(element.childNodes[1].className).toBe('layout-body');
                    expect(element.childNodes[1].childNodes[0].tagName).toBe('IMG');
                    expect(element.childNodes[1].childNodes[0].getAttribute('src')).toBe(IMG);
                    expect(element.childNodes[1].childNodes[1].tagName).toBe('P');
                    expect(element.childNodes[1].childNodes[1].textContent).toBe('Body');
                    realm.dangerouslyClose();
                });
            }
        });

        describe('slot moved across elements', () => {
            const TEMPLATES = {
                JSX(cardName, collapsed) {
                    if (collapsed) {
                        return DNA.h('slot');
                    }

                    return DNA.h(cardName, {}, DNA.h('slot'));
                },
                HTML(cardName, collapsed) {
                    if (collapsed) {
                        return DNA.html`<slot />`;
                    }

                    return DNA.html`<${cardName}>
                    <slot />
                </div>`;
                },
            };

            for (const type in TEMPLATES) {
                it(type, () => {
                    const name = getComponentName();
                    const cardName = getComponentName();
                    DNA.define(
                        `${cardName}-${type.toLowerCase()}`,
                        class MyCard extends DNA.Component {
                            render() {
                                return DNA.h('slot');
                            }
                        }
                    );

                    const element = DNA.render(
                        DNA.h(
                            `${name}-${type.toLowerCase()}`,
                            null,
                            DNA.h('h1', {}, 'Title'),
                            DNA.h('img', { src: IMG }),
                            DNA.h('p', null, 'Body')
                        ),
                        wrapper
                    );

                    DNA.define(
                        `${name}-${type.toLowerCase()}`,
                        class MyElement extends DNA.Component {
                            render() {
                                return TEMPLATES[type](`${cardName}-${type.toLowerCase()}`, this.collapsed);
                            }
                        }
                    );
                    window.customElements.upgrade(element);
                    const realm = element.realm;

                    realm.dangerouslyOpen();
                    expect(element.childNodes).toHaveLength(1);
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('H1');
                    expect(element.childNodes[0].childNodes[0].textContent).toBe('Title');
                    expect(element.childNodes[0].childNodes[1].tagName).toBe('IMG');
                    expect(element.childNodes[0].childNodes[1].getAttribute('src')).toBe(IMG);
                    expect(element.childNodes[0].childNodes[2].tagName).toBe('P');
                    expect(element.childNodes[0].childNodes[2].textContent).toBe('Body');
                    realm.dangerouslyClose();

                    element.collapsed = true;
                    element.forceUpdate();

                    realm.dangerouslyOpen();
                    expect(element.childNodes[0].tagName).toBe('H1');
                    expect(element.childNodes[0].textContent).toBe('Title');
                    expect(element.childNodes[1].tagName).toBe('IMG');
                    expect(element.childNodes[1].getAttribute('src')).toBe(IMG);
                    expect(element.childNodes[2].tagName).toBe('P');
                    expect(element.childNodes[2].textContent).toBe('Body');
                    realm.dangerouslyClose();

                    element.collapsed = false;
                    element.forceUpdate();

                    realm.dangerouslyOpen();
                    expect(element.childNodes[0].childNodes[0].tagName).toBe('H1');
                    expect(element.childNodes[0].childNodes[0].textContent).toBe('Title');
                    expect(element.childNodes[0].childNodes[1].tagName).toBe('IMG');
                    expect(element.childNodes[0].childNodes[1].getAttribute('src')).toBe(IMG);
                    expect(element.childNodes[0].childNodes[2].tagName).toBe('P');
                    expect(element.childNodes[0].childNodes[2].textContent).toBe('Body');
                    realm.dangerouslyClose();
                });
            }
        });

        describe('events', () => {
            describe('should add an event listener', () => {
                const TEMPLATES = {
                    JSX(context) {
                        return DNA.h('button', { onclick: context.listener });
                    },
                    HTML(context) {
                        return DNA.html`<button onclick=${context.listener}></button>`;
                    },
                };

                for (const type in TEMPLATES) {
                    it(type, () => {
                        const listener = vi.fn((event) => {
                            event.preventDefault();
                        });

                        DNA.render(
                            TEMPLATES[type]({
                                listener,
                            }),
                            wrapper
                        );

                        const button = wrapper.childNodes[0];
                        button.click();

                        expect(listener).toHaveBeenCalled();
                    });
                }
            });
        });

        describe('promises', () => {
            describe('should handle successfull promises', () => {
                const TEMPLATES = {
                    JSX(context) {
                        return DNA.h(
                            'div',
                            null,
                            DNA.$until(context.promise, 'Loading...'),
                            DNA.h('div', null, DNA.$await(context.promise.then((res) => ['Hello ', res])))
                        );
                    },
                    HTML(context) {
                        return DNA.html`<div>
                        ${DNA.$until(context.promise, 'Loading...')}
                        <div>${DNA.$await(context.promise.then((res) => DNA.html`Hello ${res}`))}</div>
                    </div>`;
                    },
                };

                for (const type in TEMPLATES) {
                    it(type, async () => {
                        const promise = new Promise((resolve) => {
                            setTimeout(() => resolve('World!'), 1000);
                        });

                        DNA.render(
                            TEMPLATES[type]({
                                promise,
                            }),
                            wrapper
                        );

                        expect(wrapper.innerHTML).toBe('<div><!---->Loading...<div><!----></div></div>');
                        DNA.render(
                            TEMPLATES[type]({
                                promise,
                            }),
                            wrapper
                        );
                        await new Promise((r) => setTimeout(r, 1500));
                        expect(wrapper.innerHTML).toBe('<div><!----><div><!---->Hello World!</div></div>');
                    });
                }
            });

            describe('should handle failed promises', () => {
                const TEMPLATES = {
                    JSX(context) {
                        return DNA.h(
                            'div',
                            null,
                            DNA.$until(context.promise, 'Loading...'),
                            DNA.$await(context.promise.catch((error) => ['Error ', error]))
                        );
                    },
                    HTML(context) {
                        return DNA.html`<div>
                        ${DNA.$until(context.promise, 'Loading...')}
                        ${DNA.$await(context.promise.catch((error) => DNA.html`Error ${error}`))}
                    </div>`;
                    },
                };

                for (const type in TEMPLATES) {
                    it(type, async () => {
                        const promise = new Promise((resolve, reject) => {
                            setTimeout(() => reject('timeout'), 1000);
                        });

                        DNA.render(
                            TEMPLATES[type]({
                                promise,
                            }),
                            wrapper
                        );

                        expect(wrapper.innerHTML).toBe('<div><!---->Loading...<!----></div>');
                        DNA.render(
                            TEMPLATES[type]({
                                promise,
                            }),
                            wrapper
                        );
                        await new Promise((r) => setTimeout(r, 1500));
                        expect(wrapper.innerHTML).toBe('<div><!----><!---->Error timeout</div>');
                    });
                }
            });

            it('should ignore outdated promises in template', async () => {
                let flag = false;
                const promise = new Promise((resolve) => {
                    setTimeout(() => {
                        flag = true;
                        DNA.render(template(), wrapper);
                        resolve('World!');
                    }, 1000);
                });
                const template = () => DNA.html`<div>
                ${!flag && DNA.$until(promise, 'Loading...')}
                ${flag && 'Done'}
            </div>`;

                DNA.render(template(), wrapper);
                expect(wrapper.innerHTML).toBe('<div><!---->Loading...</div>');
                DNA.render(template(), wrapper);
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
                    DNA.html`<div>
                ${DNA.$until(promise2, DNA.html`${promise.then((res) => DNA.html`Hello ${res}`)}`)}
            </div>`,
                    wrapper
                );
                await new Promise((r) => setTimeout(r, 1500));
                expect(wrapper.innerHTML).toBe('<div><!----></div>');
            });
        });
    },
    10 * 1000
);
