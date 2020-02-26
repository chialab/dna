import htm from 'htm/mini';
import { getModule, spyFunction } from './helpers.js';

let DNA, wrapper;

describe('template', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
    });

    const generate = htm.bind((tag, attrs, ...children) => {
        tag = tag.toLowerCase();
        const elem = DNA.DOM.createElement(tag);
        if (attrs) {
            for (let key in attrs) {
                elem.setAttribute(key, attrs[key] === true ? '' : attrs[key]);
            }
        }
        children.forEach((child) => {
            if (typeof child === 'string') {
                child = DNA.DOM.createTextNode(child);
            }
            if (tag === 'template' && 'content' in elem) {
                elem.content.appendChild(child);
            } else {
                elem.appendChild(child);
            }
        });
        return elem;
    });

    const html = (string) => generate([string]);

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
            TEMPLATE() {
                const template = html('<template><h1>Hello world!</h1></template>');
                return DNA.template(template, this);
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
            TEMPLATE() {
                const template = html('<TEMPLATE><H1>Hello world!</H1></TEMPLATE>');
                return DNA.template(template, this);
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
        const scope = {
            name: 'Alan',
            num: 42,
        };
        const TEMPLATES = {
            JSX() {
                return DNA.h('h1', null, 'Hello! My name is ', this.name, ' and my favorite number is ', this.num);
            },
            HTML() {
                return DNA.html`<h1>Hello! My name is ${this.name} and my favorite number is ${this.num}</h1>`;
            },
            TEMPLATE() {
                const template = html('<template><h1>Hello! My name is {{name}} and my favorite number is {{num}}</h1></template>');
                return DNA.template(template, this);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call(scope));
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('H1');
                expect(wrapper.childNodes[0].textContent).to.be.equal('Hello! My name is Alan and my favorite number is 42');
            });
        }
    });

    describe('attribute interpolation', () => {
        const scope = {
            name: 'filter',
            disabled: true,
        };
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
                const template = html('<template><input name={{name}} disabled={{disabled}} required /></template>');
                return DNA.template(template, this);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call(scope), scope);
                expect(wrapper.childNodes).to.have.lengthOf(1);
                expect(wrapper.childNodes[0].tagName).to.be.equal('INPUT');
                expect(wrapper.childNodes[0].outerHTML).to.be.equal('<input name="filter" disabled="" required="">');
            });
        }
    });

    describe('loops', () => {
        const scope = {
            items: ['Alan', 'Brian', 'Carl'],
        };
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
                const template = html(`<template>
                    <ul>
                        <template repeat={{items}} item="item" key="index">
                            <li>{{index}}. {{item}}</li>
                        </template>
                    </ul>
                </template>`);
                return DNA.template(template, this);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call(scope), scope);
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
        const scope = {
            avatar: 'cat.png',
            title: 'Romeo',
            members: [],
        };
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
                const template = html(`<template>
                    <template if={{avatar}}>
                        <img src={{avatar}} />
                    </template>
                    <h1>{{title || 'Untitled'}}</h1>
                    <template if={{members.length}}>
                        {{members.length}} members
                    </template>
                    <template if={{!members.length}}>
                        No members
                    </template>
                </template>`);
                return DNA.template(template, this);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                DNA.render(wrapper, TEMPLATES[type].call(scope), scope);
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
                const template = html(`<template>
                    <div class="layout-header">
                        <slot name="title" />
                    </div>
                    <div class="layout-body">
                        <slot />
                    </div>
                </template>`);
                return DNA.template(template, this);
            },
        };

        for (let type in TEMPLATES) {
            it(type, () => {
                class MyElement extends DNA.Component {
                    render() {
                        return TEMPLATES[type].call(this);
                    }
                }

                DNA.define(`my-element-${type.toLowerCase()}`, MyElement);

                const element = DNA.render(wrapper, DNA.h(`my-element-${type}`, null,
                    DNA.h('h1', { slot: 'title' }, 'Title'),
                    DNA.h('img', { src: 'cat.png' }),
                    DNA.h('p', null, 'Body'),
                ));

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
                JSX() {
                    return DNA.h('button', { onclick: this.listener });
                },
                HTML() {
                    return DNA.html`<button onclick=${this.listener}></button>`;
                },
                TEMPLATE() {
                    const template = html('<template><button onclick={{listener}}></button></template>');
                    return DNA.template(template, this);
                },
            };

            for (let type in TEMPLATES) {
                it(type, () => {
                    const listener = spyFunction();
                    const scope = {
                        listener,
                    };
                    DNA.render(wrapper, TEMPLATES[type].call(scope));
                    const button = wrapper.childNodes[0];
                    button.click();
                    expect(listener.invoked).to.be.true;
                });
            }
        });
    });
});
