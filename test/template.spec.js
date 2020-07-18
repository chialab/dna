import { Observable } from 'rxjs';
import { getModule, spyFunction, getComponentName, wait } from './helpers.js';

let DNA, wrapper;

describe('template', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        DNA.DOM.appendChild(DNA.window.document.body, wrapper);
    });

    afterEach(() => {
        DNA.DOM.removeChild(DNA.window.document.body, wrapper);
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
                return DNA.html('<h1>Hello world!</h1>');
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type]());
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[0].textContent).to.be.equal('Hello world!');
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

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type]());
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[0].textContent).to.be.equal('Hello world!');
            });
        }
    });

    describe('content interpolation', () => {
        const TEMPLATES = {
            JSX(context) {
                return DNA.h('h1', null, 'Hello! My name is ', context.name, ' and my favorite number is ', context.num);
            },
            HTML(context) {
                return DNA.html`<h1>Hello! My name is ${context.name} and my favorite number is ${context.num}</h1>`;
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type]({
                    name: 'Alan',
                    num: 42,
                }));
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[0].textContent).to.be.equal('Hello! My name is Alan and my favorite number is 42');
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

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type]({
                    name: 'filter',
                    disabled: true,
                }));
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('INPUT');
                expect(wrapper.childNodes[0].outerHTML).to.be.equal('<input name="filter" disabled="" required="">');
            });
        }
    });

    describe('loops', () => {
        const TEMPLATES = {
            JSX(context) {
                return DNA.h('ul', null, context.items.map((item, index) =>
                    DNA.h('li', null, index, '. ', item)
                ));
            },
            HTML(context) {
                return DNA.html`<ul>
                    ${context.items.map((item, index) => DNA.html`<li>${index}. ${item}</li>`)}
                </ul>`;
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type]({
                    items: ['Alan', 'Brian', 'Carl'],
                }));
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
        const TEMPLATES = {
            JSX(context) {
                return DNA.h(DNA.Fragment, null,
                    context.avatar && DNA.h('img', { src: context.avatar }),
                    DNA.h('h1', null, context.title || 'Untitled'),
                    context.members.length ?
                        `${context.members.length} members` :
                        'No members'
                );
            },
            HTML(context) {
                return DNA.html`
                    ${context.avatar && DNA.html`<img src=${context.avatar} />`}
                    <h1>${context.title || 'Untitled'}</h1>
                    ${context.members.length ? DNA.html`${context.members.length} members` : 'No members'}`;
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type]({
                    avatar: 'cat.png',
                    title: 'Romeo',
                    members: [],
                }));
                expect(wrapper.childNodes).to.have.lengthOf(3);
                expect(wrapper.childNodes[0].tagName).to.be.equal('IMG');
                expect(wrapper.childNodes[0].getAttribute('src')).to.be.equal('cat.png');
                expect(wrapper.childNodes[1].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[1].textContent).to.be.equal('Romeo');
                expect(wrapper.childNodes[2].textContent).to.be.equal('No members');
            });
        }
    });

    describe('style', () => {
        const rootName = getComponentName();
        const TEMPLATES = {
            JSX() {
                return DNA.h('style', {}, '.test {}');
            },
            HTML() {
                return DNA.html`<style>.test {}</style>`;
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type]();
                    }
                }

                DNA.customElements.define(`${rootName}-${type.toLowerCase()}`, MyElement);

                const element = DNA.render(wrapper, DNA.h(MyElement));
                expect(element.childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].tagName).to.be.equal('STYLE');
                expect(element.childNodes[0].textContent).to.be.equal(`[is="${rootName}-${type.toLowerCase()}"] .test {}`);
            });
        }
    });

    describe('slot', () => {
        const rootName = getComponentName();
        const titleName = getComponentName();

        const TEMPLATES = {
            JSX() {
                return DNA.h(DNA.Fragment, null,
                    DNA.h('div', { class: 'layout-header' }, DNA.h(`${titleName}-jsx`, null, DNA.h('slot', { name: 'title' }))),
                    DNA.h('div', { class: 'layout-body' }, DNA.h('slot')),
                );
            },
            HTML() {
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

        for (let type in TEMPLATES) {
            it(type, () => {
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type]();
                    }
                }

                DNA.customElements.define(`${rootName}-${type.toLowerCase()}`, MyElement);

                class MyTitle extends DNA.Component {
                    render() {
                        return DNA.h('slot', { name: 'title' });
                    }
                }

                DNA.customElements.define(`${titleName}-${type.toLowerCase()}`, MyTitle);

                const element = DNA.render(wrapper, DNA.h(`${rootName}-${type.toLowerCase()}`, null,
                    DNA.h('h1', { slot: 'title' }, 'Title'),
                    DNA.h('img', { src: 'cat.png' }),
                    DNA.h('p', null, 'Body'),
                ));

                expect(element.childNodes).to.have.lengthOf(2);
                expect(element.childNodes[0].tagName).to.be.equal('DIV');
                expect(element.childNodes[0].className).to.be.equal('layout-header');
                expect(element.childNodes[0].childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal(`${titleName}-${type}`.toUpperCase());
                expect(element.childNodes[0].childNodes[0].childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[1].tagName).to.be.equal('DIV');
                expect(element.childNodes[1].className).to.be.equal('layout-body');
                expect(element.childNodes[1].childNodes[0].tagName).to.be.equal('IMG');
                expect(element.childNodes[1].childNodes[0].getAttribute('src')).to.be.equal('cat.png');
                expect(element.childNodes[1].childNodes[1].tagName).to.be.equal('P');
                expect(element.childNodes[1].childNodes[1].textContent).to.be.equal('Body');
            });
        }
    });

    describe('slot with upgraded elements', () => {
        const TEMPLATES = {
            JSX() {
                return DNA.h(DNA.Fragment, null,
                    DNA.h('div', { class: 'layout-header' }, DNA.h('slot', { name: 'title' })),
                    DNA.h('div', { class: 'layout-body' }, DNA.h('slot')),
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

        for (let type in TEMPLATES) {
            it(type, () => {
                const name = getComponentName();
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type]();
                    }
                }

                const element = DNA.render(wrapper, DNA.h(`${name}-${type.toLowerCase()}`, null,
                    DNA.h('h1', { slot: 'title' }, 'Title'),
                    DNA.h('img', { src: 'cat.png' }),
                    DNA.h('p', null, 'Body'),
                ));

                DNA.customElements.define(`${name}-${type.toLowerCase()}`, MyElement);
                DNA.customElements.upgrade(element);

                expect(element.childNodes).to.have.lengthOf(2);
                expect(element.childNodes[0].tagName).to.be.equal('DIV');
                expect(element.childNodes[0].className).to.be.equal('layout-header');
                expect(element.childNodes[0].childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[1].tagName).to.be.equal('DIV');
                expect(element.childNodes[1].className).to.be.equal('layout-body');
                expect(element.childNodes[1].childNodes[0].tagName).to.be.equal('IMG');
                expect(element.childNodes[1].childNodes[0].getAttribute('src')).to.be.equal('cat.png');
                expect(element.childNodes[1].childNodes[1].tagName).to.be.equal('P');
                expect(element.childNodes[1].childNodes[1].textContent).to.be.equal('Body');
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

            for (let type in TEMPLATES) {
                it(type, () => {
                    const listener = spyFunction();
                    DNA.render(wrapper, TEMPLATES[type]({
                        listener,
                    }));
                    const button = wrapper.childNodes[0];
                    button.click();
                    expect(listener.invoked).to.be.true;
                });
            }
        });
    });

    describe('promises', () => {
        describe('should handle successfull promises', async () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h('div', null,
                        DNA.until(context.promise, 'Loading...'),
                        DNA.h('div', null, context.promise.then((res) => ['Hello ', res]))
                    );
                },
                HTML(context) {
                    return DNA.html`<div>
                        ${DNA.until(context.promise, 'Loading...')}
                        <div>${context.promise.then((res) => DNA.html`Hello ${res}`)}</div>
                    </div>`;
                },
            };

            for (let type in TEMPLATES) {
                it(type, async () => {
                    const promise = new Promise((resolve) => {
                        setTimeout(() => resolve('World!'), 1000);
                    });

                    DNA.render(wrapper, TEMPLATES[type]( {
                        promise,
                    }));

                    expect(wrapper.innerHTML).to.be.equal('<div>Loading...<div></div></div>');
                    DNA.render(wrapper, TEMPLATES[type]( {
                        promise,
                    }));
                    await wait(1500);
                    expect(wrapper.innerHTML).to.be.equal('<div><div>Hello World!</div></div>');
                });
            }
        });

        describe('should handle failed promises', async () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h('div', null,
                        DNA.until(context.promise, 'Loading...'),
                        context.promise.catch((error) => ['Error ', error])
                    );
                },
                HTML(context) {
                    return DNA.html`<div>
                        ${DNA.until(context.promise, 'Loading...')}
                        ${context.promise.catch((error) => DNA.html`Error ${error}`)}
                    </div>`;
                },
            };

            for (let type in TEMPLATES) {
                it(type, async () => {
                    const promise = new Promise((resolve, reject) => {
                        setTimeout(() => reject('timeout'), 1000);
                    });

                    DNA.render(wrapper, TEMPLATES[type]({
                        promise,
                    }));

                    expect(wrapper.innerHTML).to.be.equal('<div>Loading...</div>');
                    DNA.render(wrapper, TEMPLATES[type]({
                        promise,
                    }));
                    await wait(1500);
                    expect(wrapper.innerHTML).to.be.equal('<div>Error timeout</div>');
                });
            }
        });

        it('should ignore outdated promises in template', async () => {
            let flag = false;
            const promise = new Promise((resolve) => {
                setTimeout(() => {
                    flag = true;
                    DNA.render(wrapper, template());
                    resolve('World!');
                }, 1000);
            });
            const template = () => DNA.html`<div>
                ${!flag && DNA.until(promise, 'Loading...')}
                ${flag && 'Done'}
            </div>`;

            DNA.render(wrapper, template());
            expect(wrapper.innerHTML).to.be.equal('<div>Loading...</div>');
            DNA.render(wrapper, template());
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
            const template = DNA.html`<div>${DNA.until(promise2, DNA.html`${promise.then((res) => DNA.html`Hello ${res}`)}`)}</div>`;
            DNA.render(wrapper, template);
            await wait(1500);
            expect(wrapper.innerHTML).to.be.equal('<div></div>');
        });
    });

    describe('observables', () => {
        describe('should subscribe', async () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h('div', null, context.observable$);
                },
                HTML(context) {
                    return DNA.html`<div>
                        ${context.observable$}
                    </div>`;
                },
            };

            for (let type in TEMPLATES) {
                it(type, async () => {
                    const observable$ = new Observable(async (subscriber) => {
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

                    DNA.render(wrapper, TEMPLATES[type]({ observable$ }));

                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div>1</div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div>2</div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div>3</div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div>4</div>');
                });
            }
        });

        describe('should subscribe and pipe', async () => {
            const TEMPLATES = {
                JSX(context) {
                    return DNA.h('div', null, context.observable$.pipe((num) => DNA.h('span', null, num)));
                },
                HTML(context) {
                    return DNA.html`<div>
                        ${context.observable$.pipe((num) => DNA.html`<span>${num}</span>`)}
                    </div>`;
                },
            };

            for (let type in TEMPLATES) {
                it(type, async () => {
                    const observable$ = new Observable(async (subscriber) => {
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

                    DNA.render(wrapper, TEMPLATES[type]({ observable$ }));

                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span>1</span></div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span>2</span></div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span>3</span></div>');
                    await wait(100);
                    expect(wrapper.innerHTML).to.be.equal('<div><span>4</span></div>');
                });
            }
        });
    });
});
