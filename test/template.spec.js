import { getModule } from './helpers.js';

let DNA, wrapper;

describe.skip('template', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
    });

    describe('simple', () => {
        const TEMPLATES = {
            JSX() {
                return DNA.h('h1', null, 'Hello world!');
            },
            HTML() {
                return DNA.html`<h1>Hello world!</h1>`;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = '<h1>Hello world!</h1>';
                return DNA.html(template);
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
            JSX() {
                return DNA.h('h1', null, 'Hello! My name is ', this.name, ' and my favorite number is ', this.num);
            },
            HTML() {
                return DNA.html`<h1>Hello! My name is ${this.name} and my favorite number is ${this.num}</h1>`;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = '<h1>Hello! My name is {{name}} and my favorite number is {{num}}</h1>';
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call({
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
            JSX() {
                return DNA.h('input', {
                    name: this.name,
                    disabled: this.disabled,
                    required: true,
                });
            },
            HTML() {
                return DNA.html`<input name=${this.name} disabled=${this.disabled} required />`;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = '<input name={{name}} disabled={{disabled}} required />';
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call({
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
            JSX() {
                return DNA.h('ul', null, this.items.map((item, index) =>
                    DNA.h('li', null, index, '. ', item)
                ));
            },
            HTML() {
                return DNA.html`<ul>
                    ${this.items.map((item, index) => DNA.html`<li>${index}. ${item}</li>`)}
                </ul>`;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = `<ul>
                    <template repeat={items} item="item" key="index">
                        <li>{{index}}. {{item}}</li>
                    </template>
                </ul>`;
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call({
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
            JSX() {
                return DNA.h(DNA.Fragment, null,
                    this.avatar && DNA.h('img', { src: this.avatar }),
                    DNA.h('h1', null, this.title || 'Untitled'),
                    this.members.length ?
                        `${this.members.length} members` :
                        'No members'
                );
            },
            HTML() {
                return DNA.html`
                    ${this.avatar && DNA.html`<img src=${this.avatar} />`}
                    <h1>${this.title || 'Untitled'}</h1>
                    ${this.members.length ? DNA.html`${this.members.length} members` : 'No members'}`;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = `<template if={{avatar}}>
                    <img src={{avatar}} />
                </template>
                <h1>{title || 'Untitled'}</h1>
                <template if={{members.length}}>
                    {{members.length}} members
                </template>
                <template if={{!members.length}}>
                    No members
                </template>`;
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call({
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

    describe('slot', () => {
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
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = `<div class="layout-header">
                    <slot name="title" />
                </div>
                <div class="layout-body">
                    <slot />
                </div>`;
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type].call(this);
                    }
                }

                DNA.define(`my-element-${type}`, MyElement);

                const element = DNA.render(wrapper, DNA.h(`my-element-${type}`, null,
                    DNA.h('h1', { slot: 'title' }, 'Title'),
                    DNA.h('img', { src: 'cat.png' }),
                    DNA.h('p', null, 'Body'),
                ));

                expect(element.childNodes).to.have.lengthOf(2);
                expect(element.childNodes[0].tagName).to.be.equal('div');
                expect(element.childNodes[0].className).to.be.equal('layout-header');
                expect(element.childNodes[0].childNodes).to.have.lengthOf(1);
                expect(element.childNodes[0].childNodes[0].tagName).to.be.equal('H1');
                expect(element.childNodes[0].childNodes[0].textContent).to.be.equal('Title');
                expect(element.childNodes[1].tagName).to.be.equal('div');
                expect(element.childNodes[1].className).to.be.equal('layout-body');
                expect(element.childNodes[1].childNodes[0].tagName).to.be.equal('IMG');
                expect(element.childNodes[1].childNodes[0].getAttribute('src')).to.be.equal('cat.png');
                expect(element.childNodes[1].childNodes[2].tagName).to.be.equal('P');
                expect(element.childNodes[1].childNodes[2].textContent).to.be.equal('Body');
            });
        }
    });

    describe('not keyed', () => {
        const TEMPLATES = {
            JSX() {
                return DNA.h('select', null,
                    this.items.map((item) => DNA.h('option', { value: item }, item)),
                    DNA.h('option', { value: 'other' }),
                );
            },
            HTML() {
                return DNA.html`
                    <select>
                        ${this.items.map((item) => DNA.html`
                            <option value=${item}>${item}</option>
                        `)}
                        <option value="other">Other</option>
                    </select>
                `;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = `<select>
                    <template repeat={items} item="item">
                        <option value={{item}}>{{item}}</option>
                    </template>
                    <option value="other">Other</option>
                </select>`;
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call({
                    items: ['Alan', 'Brian', 'Carl'],
                }));
                expect(wrapper.childNodes[0].tagName).to.be.equal('SELECT');
                expect(wrapper.childNodes[0].childNodes).to.have.lengthOf(4);

                const first = wrapper.childNodes[0].childNodes[0];
                expect(first.tagName).to.be.equal('OPTION');
                expect(first.textContent).to.be.equal('Alan');

                const second = wrapper.childNodes[0].childNodes[1];
                expect(second.tagName).to.be.equal('OPTION');
                expect(second.textContent).to.be.equal('Brian');

                const third = wrapper.childNodes[0].childNodes[2];
                expect(third.tagName).to.be.equal('OPTION');
                expect(third.textContent).to.be.equal('Carl');

                const otherOption = wrapper.childNodes[0].childNodes[3];
                expect(otherOption.tagName).to.be.equal('OPTION');
                expect(otherOption.textContent).to.be.equal('Other');

                DNA.render(wrapper, TEMPLATES[type].call({
                    items: ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'],
                }));

                expect(wrapper.childNodes[0].tagName).to.be.equal('SELECT');
                expect(wrapper.childNodes[0].childNodes).to.have.lengthOf(5);

                expect(wrapper.childNodes[0].childNodes[0].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[0].textContent).to.be.equal('Daniel');
                expect(wrapper.childNodes[0].childNodes[0]).to.be.equal(first);

                expect(wrapper.childNodes[0].childNodes[1].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[1].textContent).to.be.equal('Eduardo');
                expect(wrapper.childNodes[0].childNodes[1]).to.be.equal(second);

                expect(wrapper.childNodes[0].childNodes[2].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[2].textContent).to.be.equal('Francesca');
                expect(wrapper.childNodes[0].childNodes[2]).to.be.equal(third);

                expect(wrapper.childNodes[0].childNodes[3].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[3].textContent).to.be.equal('Gabriella');
                expect(wrapper.childNodes[0].childNodes[3]).to.be.equal(otherOption);

                expect(wrapper.childNodes[0].childNodes[4].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[4].textContent).to.be.equal('Other');
                expect(wrapper.childNodes[0].childNodes[3]).to.not.be.equal(otherOption);
            });
        }
    });

    describe('keyed', () => {
        const TEMPLATES = {
            JSX() {
                return DNA.h('select', null,
                    this.items.map((item) => DNA.h('option', { value: item }, item)),
                    DNA.h('option', { key: 'last', value: 'other' }),
                );
            },
            HTML() {
                return DNA.html`
                    <select>
                        ${this.items.map((item) => DNA.html`
                            <option value=${item}>${item}</option>
                        `)}
                        <option key="last" value="other">Other</option>
                    </select>
                `;
            },
            TEMPLATE() {
                const template = DNA.DOM.createElement('template');
                template.innerHTML = `<select>
                    <template repeat={items} item="item">
                        <option value={{item}}>{{item}}</option>
                    </template>
                    <option key="last" value="other">Other</option>
                </select>`;
                return DNA.html(template);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call({
                    items: ['Alan', 'Brian', 'Carl'],
                }));
                expect(wrapper.childNodes[0].tagName).to.be.equal('SELECT');
                expect(wrapper.childNodes[0].childNodes).to.have.lengthOf(4);

                const first = wrapper.childNodes[0].childNodes[0];
                expect(first.tagName).to.be.equal('OPTION');
                expect(first.textContent).to.be.equal('Alan');

                const second = wrapper.childNodes[0].childNodes[1];
                expect(second.tagName).to.be.equal('OPTION');
                expect(second.textContent).to.be.equal('Brian');

                const third = wrapper.childNodes[0].childNodes[2];
                expect(third.tagName).to.be.equal('OPTION');
                expect(third.textContent).to.be.equal('Carl');

                const otherOption = wrapper.childNodes[0].childNodes[3];
                expect(otherOption.tagName).to.be.equal('OPTION');
                expect(otherOption.textContent).to.be.equal('Other');

                DNA.render(wrapper, TEMPLATES[type].call({
                    items: ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'],
                }));

                expect(wrapper.childNodes[0].tagName).to.be.equal('SELECT');
                expect(wrapper.childNodes[0].childNodes).to.have.lengthOf(5);

                expect(wrapper.childNodes[0].childNodes[0].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[0].textContent).to.be.equal('Daniel');
                expect(wrapper.childNodes[0].childNodes[0]).to.be.equal(first);

                expect(wrapper.childNodes[0].childNodes[1].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[1].textContent).to.be.equal('Eduardo');
                expect(wrapper.childNodes[0].childNodes[1]).to.be.equal(second);

                expect(wrapper.childNodes[0].childNodes[2].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[2].textContent).to.be.equal('Francesca');
                expect(wrapper.childNodes[0].childNodes[2]).to.be.equal(third);

                expect(wrapper.childNodes[0].childNodes[3].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[3].textContent).to.be.equal('Gabriella');
                expect(wrapper.childNodes[0].childNodes[3]).to.not.be.equal(otherOption);

                expect(wrapper.childNodes[0].childNodes[4].tagName).to.be.equal('OPTION');
                expect(wrapper.childNodes[0].childNodes[4].textContent).to.be.equal('Other');
                expect(wrapper.childNodes[0].childNodes[3]).to.be.equal(otherOption);
            });
        }

        it('should access keyed element in scope', () => {
            class MyElement extends DNA.Component {
                render() {
                    return DNA.html`<input key="firstName" placeholder="Eg. Alan" />`;
                }
            }

            DNA.define('my-element-keytest', MyElement);

            const element = new MyElement();
            element.forceUpdate();

            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('INPUT');
            expect(element.childNodes[0]).to.be.equal(element.$.firstName);
        });
    });
});
