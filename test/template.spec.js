// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { expect, spy, wait } from '@chialab/ginsenghino';
import { Observable } from 'rxjs';
import { getComponentName } from './helpers.spec.js';

const IMG = 'data:image/png;base64,';

describe('template', function () {
    let wrapper;
    this.timeout(10 * 1000);

    beforeEach(() => {
        wrapper = DNA.document.createElement('div');
        DNA.document.body.appendChild(wrapper);
    });

    afterEach(() => {
        DNA.document.body.removeChild(wrapper);
    });

    describe('simple', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                DNA.render(TEMPLATES[type](), wrapper);
                expect(wrapper.children).to.have.lengthOf(1);
                expect(wrapper.children[0].tagName).to.be.equal('H1');
                expect(wrapper.children[0].textContent).to.be.equal('Hello world!');
            });
        }
    });

    describe('simple with uppercase', () => {
        /* eslint-disable mocha/no-setup-in-describe */
        const TEMPLATES = {
            JSX() {
                return DNA.h('H1', null, 'Hello world!');
            },
            HTML() {
                return DNA.html`<H1>Hello world!</H1>`;
            },
        };
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                DNA.render(TEMPLATES[type](), wrapper);
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[0].textContent).to.be.equal('Hello world!');
            });
        }
    });

    describe('content interpolation', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                DNA.render(
                    TEMPLATES[type]({
                        name: 'Alan',
                        num: 42,
                    }),
                    wrapper
                );
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[0].textContent).to.be.equal(
                    'Hello! My name is Alan and my favorite number is 42'
                );
            });
        }
    });

    describe('attribute interpolation', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                DNA.render(
                    TEMPLATES[type]({
                        name: 'filter',
                        disabled: true,
                    }),
                    wrapper
                );
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('INPUT');
                expect(wrapper.childNodes[0].outerHTML).to.be.equal('<input name="filter" disabled="" required="">');
            });
        }
    });

    describe('loops', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                DNA.render(
                    TEMPLATES[type]({
                        items: ['Alan', 'Brian', 'Carl'],
                    }),
                    wrapper
                );
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('UL');
                expect(wrapper.childNodes[0].childNodes).to.have.lengthOf(3);
                expect(wrapper.childNodes[0].childNodes[0].tagName).to.be.equal('LI');
                expect(wrapper.childNodes[0].childNodes[0].textContent).to.be.equal('0. Alan');
                expect(wrapper.childNodes[0].childNodes[1].tagName).to.be.equal('LI');
                expect(wrapper.childNodes[0].childNodes[1].textContent).to.be.equal('1. Brian');
                expect(wrapper.childNodes[0].childNodes[2].tagName).to.be.equal('LI');
                expect(wrapper.childNodes[0].childNodes[2].textContent).to.be.equal('2. Carl');
            });
        }
    });

    describe('conditionals', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

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
                expect(wrapper.childNodes).to.have.lengthOf(3);
                expect(wrapper.childNodes[0].tagName).to.be.equal('IMG');
                expect(wrapper.childNodes[0].getAttribute('src')).to.be.equal(IMG);
                expect(wrapper.childNodes[1].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[1].textContent).to.be.equal('Romeo');
                expect(wrapper.childNodes[2].textContent).to.be.equal('No members');
            });
        }
    });

    describe('style', () => {
        /* eslint-disable mocha/no-setup-in-describe */
        const TEMPLATES = {
            JSX() {
                return DNA.h('style', {}, '.test {}');
            },
            HTML() {
                return DNA.html`<style>.test {}</style>`;
            },
        };
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, async () => {
                const rootName = getComponentName();
                class MyElement extends DNA.extend(DNA.window.HTMLDivElement) {
                    render() {
                        return TEMPLATES[type]();
                    }
                }

                DNA.define(`${rootName}-${type.toLowerCase()}`, MyElement, { extends: 'div' });

                const element = DNA.render(DNA.h(MyElement), wrapper);
                await wait(0);

                const realm = element.realm;
                realm.dangerouslyOpen();
                expect(element.childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].tagName).to.be.equal('STYLE');
                expect(element.childNodes[0].textContent).to.be.equal(
                    `[:scope="${rootName}-${type.toLowerCase()}"] .test {}`
                );
                realm.dangerouslyClose();
            });
        }
    });

    describe('slot', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                const rootName = getComponentName();
                const titleName = getComponentName();
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type](titleName);
                    }
                }

                DNA.define(`${rootName}-${type.toLowerCase()}`, MyElement);

                class MyTitle extends DNA.Component {
                    render() {
                        return DNA.h('span', { class: 'title' }, DNA.h('slot', {}, ['Untitled']));
                    }
                }

                DNA.define(`${titleName}-${type.toLowerCase()}`, MyTitle);

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
                expect(element.childNodes).to.have.lengthOf(2);
                expect(element.childNodes[0].tagName).to.be.equal('DIV');
                expect(element.childNodes[0].className).to.be.equal('layout-header');
                expect(element.childNodes[0].childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal(`${titleName}-${type}`.toUpperCase());
                expect(element.childNodes[0].childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
                expect(element.childNodes[0].childNodes[0].childNodes[0].textContent).to.be.equal('Untitled');
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
                expect(element.childNodes[0].childNodes[0].childNodes[0].tagName).to.be.equal('SPAN');
                expect(element.childNodes[0].childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[1].tagName).to.be.equal('DIV');
                expect(element.childNodes[1].className).to.be.equal('layout-body');
                expect(element.childNodes[1].childNodes[0].tagName).to.be.equal('IMG');
                expect(element.childNodes[1].childNodes[0].getAttribute('src')).to.be.equal(IMG);
                expect(element.childNodes[1].childNodes[1].tagName).to.be.equal('P');
                expect(element.childNodes[1].childNodes[1].textContent).to.be.equal('Body');
                innerRealm.dangerouslyClose();
                realm.dangerouslyClose();
            });
        }
    });

    describe('slot with upgraded elements', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                const name = getComponentName();
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type]();
                    }
                }

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

                DNA.define(`${name}-${type.toLowerCase()}`, MyElement);
                DNA.customElements.upgrade(element);

                const realm = element.realm;

                realm.dangerouslyOpen();
                expect(element.childNodes).to.have.lengthOf(2);
                expect(element.childNodes[0].tagName).to.be.equal('DIV');
                expect(element.childNodes[0].className).to.be.equal('layout-header');
                expect(element.childNodes[0].childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[1].tagName).to.be.equal('DIV');
                expect(element.childNodes[1].className).to.be.equal('layout-body');
                expect(element.childNodes[1].childNodes[0].tagName).to.be.equal('IMG');
                expect(element.childNodes[1].childNodes[0].getAttribute('src')).to.be.equal(IMG);
                expect(element.childNodes[1].childNodes[1].tagName).to.be.equal('P');
                expect(element.childNodes[1].childNodes[1].textContent).to.be.equal('Body');
                realm.dangerouslyClose();
            });
        }
    });

    describe('slot moved across elements', () => {
        /* eslint-disable mocha/no-setup-in-describe */
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
        /* eslint-enable mocha/no-setup-in-describe */

        for (const type in TEMPLATES) {
            it(type, () => {
                const name = getComponentName();
                const cardName = getComponentName();

                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type](`${cardName}-${type.toLowerCase()}`, this.collapsed);
                    }
                }

                class MyCard extends DNA.Component {
                    render() {
                        return DNA.h('slot');
                    }
                }

                DNA.define(`${cardName}-${type.toLowerCase()}`, MyCard);

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

                DNA.define(`${name}-${type.toLowerCase()}`, MyElement);
                DNA.customElements.upgrade(element);
                const realm = element.realm;

                realm.dangerouslyOpen();
                expect(element.childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[0].childNodes[1].tagName).to.be.equal('IMG');
                expect(element.childNodes[0].childNodes[1].getAttribute('src')).to.be.equal(IMG);
                expect(element.childNodes[0].childNodes[2].tagName).to.be.equal('P');
                expect(element.childNodes[0].childNodes[2].textContent).to.be.equal('Body');
                realm.dangerouslyClose();

                element.collapsed = true;
                element.forceUpdate();

                realm.dangerouslyOpen();
                expect(element.childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[1].tagName).to.be.equal('IMG');
                expect(element.childNodes[1].getAttribute('src')).to.be.equal(IMG);
                expect(element.childNodes[2].tagName).to.be.equal('P');
                expect(element.childNodes[2].textContent).to.be.equal('Body');
                realm.dangerouslyClose();

                element.collapsed = false;
                element.forceUpdate();

                realm.dangerouslyOpen();
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[0].childNodes[1].tagName).to.be.equal('IMG');
                expect(element.childNodes[0].childNodes[1].getAttribute('src')).to.be.equal(IMG);
                expect(element.childNodes[0].childNodes[2].tagName).to.be.equal('P');
                expect(element.childNodes[0].childNodes[2].textContent).to.be.equal('Body');
                realm.dangerouslyClose();
            });
        }
    });

    describe('events', () => {
        describe('should add an event listener', () => {
            /* eslint-disable mocha/no-setup-in-describe */
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h('button', { onclick: context.listener });
                },
                HTML(context) {
                    return DNA.html`<button onclick=${context.listener}></button>`;
                },
            };
            /* eslint-enable mocha/no-setup-in-describe */

            for (const type in TEMPLATES) {
                it(type, () => {
                    const listener = spy((event) => {
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

                    expect(listener).to.have.been.called();
                });
            }
        });
    });

    describe('promises', () => {
        describe('should handle successfull promises', () => {
            /* eslint-disable mocha/no-setup-in-describe */
            const TEMPLATES = {
                JSX(context) {
                    /* eslint-disable mocha/no-setup-in-describe */
                    return DNA.h(
                        'div',
                        null,
                        DNA.until(context.promise, 'Loading...'),
                        DNA.h('div', null, DNA.then(context.promise.then((res) => ['Hello ', res])))
                    );
                },
                HTML(context) {
                    /* eslint-disable mocha/no-setup-in-describe */
                    return DNA.html`<div>
                        ${DNA.until(context.promise, 'Loading...')}
                        <div>${DNA.then(context.promise.then((res) => DNA.html`Hello ${res}`))}</div>
                    </div>`;
                },
            };
            /* eslint-enable mocha/no-setup-in-describe */

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

                    expect(wrapper.innerHTML).to.be.equal('<div><!---->Loading...<div><!----></div></div>');
                    DNA.render(
                        TEMPLATES[type]({
                            promise,
                        }),
                        wrapper
                    );
                    await wait(1500);
                    expect(wrapper.innerHTML).to.be.equal('<div><!----><div><!---->Hello World!</div></div>');
                });
            }
        });

        describe('should handle failed promises', () => {
            /* eslint-disable mocha/no-setup-in-describe */
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h(
                        'div',
                        null,
                        DNA.until(context.promise, 'Loading...'),
                        DNA.then(context.promise.catch((error) => ['Error ', error]))
                    );
                },
                HTML(context) {
                    return DNA.html`<div>
                        ${DNA.until(context.promise, 'Loading...')}
                        ${DNA.then(context.promise.catch((error) => DNA.html`Error ${error}`))}
                    </div>`;
                },
            };
            /* eslint-enable mocha/no-setup-in-describe */

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

                    expect(wrapper.innerHTML).to.be.equal('<div><!---->Loading...<!----></div>');
                    DNA.render(
                        TEMPLATES[type]({
                            promise,
                        }),
                        wrapper
                    );
                    await wait(1500);
                    expect(wrapper.innerHTML).to.be.equal('<div><!----><!---->Error timeout</div>');
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
                ${!flag && DNA.until(promise, 'Loading...')}
                ${flag && 'Done'}
            </div>`;

            DNA.render(template(), wrapper);
            expect(wrapper.innerHTML).to.be.equal('<div><!---->Loading...</div>');
            DNA.render(template(), wrapper);
            await wait(1500);
            expect(wrapper.innerHTML).to.be.equal('<div>Done</div>');
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
                ${DNA.until(promise2, DNA.html`${promise.then((res) => DNA.html`Hello ${res}`)}`)}
            </div>`,
                wrapper
            );
            await wait(1500);
            expect(wrapper.innerHTML).to.be.equal('<div><!----></div>');
        });
    });

    describe('observables', () => {
        describe('should subscribe', () => {
            /* eslint-disable mocha/no-setup-in-describe */
            const TEMPLATES = {
                JSX(context) {
                    /* eslint-disable mocha/no-setup-in-describe */
                    return DNA.h('div', null, DNA.pipe(context.observable$));
                },
                HTML(context) {
                    /* eslint-disable mocha/no-setup-in-describe */
                    return DNA.html`<div>
                        ${DNA.pipe(context.observable$)}
                    </div>`;
                },
            };
            /* eslint-enable mocha/no-setup-in-describe */

            for (const type in TEMPLATES) {
                it(type, async () => {
                    const observable$ = new Observable((subscriber) => {
                        Promise.resolve().then(async () => {
                            await wait(100);
                            subscriber.next(1);
                            await wait(100);
                            subscriber.next(2);
                            await wait(100);
                            subscriber.next(3);
                            await wait(100);
                            subscriber.next(4);
                            subscriber.complete();
                        });
                    });

                    DNA.render(TEMPLATES[type]({ observable$ }), wrapper);

                    await wait(150);
                    expect(wrapper.innerHTML).to.be.equal('<div><!---->1</div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><!---->2</div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><!---->3</div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><!---->4</div>');
                });
            }
        });

        describe('should subscribe and pipe', () => {
            /* eslint-disable mocha/no-setup-in-describe */
            const TEMPLATES = {
                JSX(context) {
                    /* eslint-disable mocha/no-setup-in-describe */
                    return DNA.h(
                        'div',
                        null,
                        context.observable$.pipe((num) => DNA.h('span', null, DNA.pipe(num)))
                    );
                },
                HTML(context) {
                    /* eslint-disable mocha/no-setup-in-describe */
                    return DNA.html`<div>
                        ${context.observable$.pipe((num) => DNA.html`<span>${DNA.pipe(num)}</span>`)}
                    </div>`;
                },
            };
            /* eslint-enable mocha/no-setup-in-describe */

            for (const type in TEMPLATES) {
                it(type, async () => {
                    const observable$ = new Observable((subscriber) => {
                        Promise.resolve().then(async () => {
                            await wait(100);
                            subscriber.next(1);
                            await wait(100);
                            subscriber.next(2);
                            await wait(100);
                            subscriber.next(3);
                            await wait(100);
                            subscriber.next(4);
                            subscriber.complete();
                        });
                    });

                    DNA.render(TEMPLATES[type]({ observable$ }), wrapper);

                    await wait(150);
                    expect(wrapper.innerHTML).to.be.equal('<div><span><!---->1</span></div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span><!---->2</span></div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span><!---->3</span></div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span><!---->4</span></div>');
                });
            }
        });
    });
});
