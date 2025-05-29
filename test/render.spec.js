import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getComponentName } from './helpers.js';

describe.runIf(typeof window !== 'undefined')(
    'render',
    () => {
        let wrapper;
        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        describe('render', () => {
            it('should render string', () => {
                expect(DNA.render('hello').textContent).toBe('hello');
            });

            it('should render HTML string as simple string', () => {
                expect(DNA.render('<h1>hello</h1>').textContent).toBe('<h1>hello</h1>');
            });

            it('should render number', () => {
                expect(DNA.render(42).textContent).toBe('42');
            });

            it('should render boolean', () => {
                expect(DNA.render(true).textContent).toBe('true');
                expect(DNA.render(false)).toBeUndefined();
            });

            it('should render undefined', () => {
                expect(DNA.render(undefined)).toBeUndefined();
            });

            it('should render null', () => {
                expect(DNA.render(null)).toBeUndefined();
            });

            it('should render hyper function', () => {
                const ul = DNA.render(
                    DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'))
                );
                expect(ul.childNodes).toHaveLength(2);
                expect(ul.querySelector('li:nth-child(1)').textContent).toBe('One');
                expect(ul.querySelector('li:nth-child(2)').textContent).toBe('Two');
            });

            it('should render a text node', () => {
                expect(DNA.render(document.createTextNode('Hello')).textContent).toBe('Hello');
            });

            it('should render an element node', () => {
                expect(DNA.render(document.createElement('div')).tagName).toBe('DIV');
            });

            it('should render an element node using the `ref` property', () => {
                const div = document.createElement('div');
                div.setAttribute('class', 'test');
                div.innerHTML = '<span>test</span>';
                DNA.render(DNA.html`<div><div ref=${div} id="test" /></div>`);
                expect(div.id).toBe('test');
                expect(div.className).toBe('test');
                expect(div.textContent).toBe('test');
                expect(div.childNodes).toHaveLength(1);
                expect(div.parentNode.tagName).toBe('DIV');
            });

            it('should render an element node using the `h` helper', () => {
                const div = document.createElement('div');
                div.setAttribute('class', 'test');
                div.innerHTML = '<span>test</span>';
                DNA.render(DNA.html`<div><${div} id="test" /></div>`);
                expect(div.id).toBe('test');
                expect(div.className).toBe('test');
                expect(div.textContent).toBe('test');
                expect(div.childNodes).toHaveLength(1);
                expect(div.parentNode.tagName).toBe('DIV');
            });

            it('should render an element node using the `h` helper inside a component', () => {
                const name = getComponentName();
                const name2 = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        render() {
                            return this.realm.childNodes.map((node) => DNA.html`<${node} id="test" />`);
                        }
                    }
                );
                DNA.define(
                    name2,
                    class TestElement2 extends DNA.Component {
                        render() {
                            return DNA.h(
                                name,
                                {},
                                DNA.h('div', { class: 'test', key: 0 }, 'test'),
                                DNA.h('div', { class: 'test', key: 1 }, 'test')
                            );
                        }
                    }
                );

                const root = DNA.render(DNA.h(name2), wrapper);
                const elem = wrapper.querySelector(name);
                const divs = [elem.children[0], elem.children[1]];
                // force renders in order to check if keyed elements are respected
                root.forceUpdate();
                elem.forceUpdate();
                expect(elem).toBe(wrapper.querySelector(name));
                expect(elem.children[0]).toBe(divs[0]);
                expect(elem.children[1]).toBe(divs[1]);

                divs.forEach((div) => {
                    expect(div.className).toBe('test');
                    expect(div.id).toBe('test');
                    expect(div.textContent).toBe('test');
                    expect(div.childNodes).toHaveLength(1);
                });
            });

            it('should render mixed content', () => {
                DNA.render(
                    [
                        'hello',
                        'world',
                        true,
                        DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                        document.createTextNode('Hello'),
                        document.createElement('div'),
                    ],
                    wrapper
                );
                expect(wrapper.childNodes).toHaveLength(6);
            });

            it('should render component function', () => {
                const Test = function Test() {
                    return [
                        'hello',
                        'world',
                        true,
                        DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                        document.createTextNode('Hello'),
                        document.createElement('div'),
                    ];
                };

                DNA.render(DNA.h(Test), wrapper);
                expect(wrapper.childNodes).toHaveLength(7);
            });

            it('should render component function with keys', () => {
                const Test = function Test() {
                    return ['hello', 'world'];
                };

                DNA.render([DNA.h(Test, { key: 1 }), DNA.h(Test, { key: 2 })], wrapper);
                const [, , , comment, text1, text2] = wrapper.childNodes;
                expect(wrapper.childNodes).toHaveLength(6);
                DNA.render([DNA.h(Test, { key: 2 })], wrapper);
                expect(wrapper.childNodes).toHaveLength(3);
                expect(wrapper.childNodes[0]).toBe(comment);
                expect(wrapper.childNodes[1]).toBe(text1);
                expect(wrapper.childNodes[2]).toBe(text2);
            });

            it('should re-render component function only', async () => {
                const render1 = vi.fn();
                const render2 = vi.fn();

                const Test = function Test() {
                    render1();
                    return 'hello';
                };

                const Clock = function Clock(props, { useState }) {
                    render2();
                    const [count, setCount] = useState(1);
                    if (count === 1) {
                        setTimeout(() => {
                            setCount(count + 1);
                        }, 200);
                    }

                    return count;
                };

                DNA.render([DNA.h(Test), DNA.h(Clock)], wrapper);
                expect(wrapper.childNodes).toHaveLength(4);
                expect(wrapper.childNodes[1].textContent).toBe('hello');
                expect(wrapper.childNodes[3].textContent).toBe('1');
                await new Promise((r) => setTimeout(r, 500));
                expect(wrapper.childNodes[1].textContent).toBe('hello');
                expect(wrapper.childNodes[3].textContent).toBe('2');
                expect(render1).toHaveBeenCalledOnce();
                expect(render2).toHaveBeenCalledTimes(2);
            });

            it('should add nodes', () => {
                DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')), wrapper);
                const list = wrapper.querySelector('ul.list');
                const children = list.childNodes;
                expect(children).toHaveLength(2);
                DNA.render(
                    DNA.h(
                        'ul',
                        { class: 'list' },
                        DNA.h('li', null, 'One'),
                        DNA.h('li', null, 'Two'),
                        DNA.h('li', null, 'Three'),
                        DNA.h('li', null, 'Four')
                    ),
                    wrapper
                );
                const newChildren = list.childNodes;
                expect(newChildren).toHaveLength(4);
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
            });

            it('should remove nodes', () => {
                DNA.render(
                    DNA.h(
                        'ul',
                        { class: 'list' },
                        DNA.h('li', null, 'One'),
                        DNA.h('li', null, 'Two'),
                        DNA.h('li', null, 'Three'),
                        DNA.h('li', null, 'Four')
                    ),
                    wrapper
                );
                const list = wrapper.querySelector('ul.list');
                const children = list.childNodes;
                expect(children).toHaveLength(4);
                DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')), wrapper);
                const newChildren = list.childNodes;
                expect(newChildren).toHaveLength(2);
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
            });

            it('should update nodes', () => {
                DNA.render(
                    DNA.h(
                        'ul',
                        { class: 'list' },
                        DNA.h('li', null, 'One'),
                        DNA.h('li', null, 'Two'),
                        DNA.h('li', null, 'Three'),
                        DNA.h('li', null, 'Four'),
                        DNA.h('li', null, 5),
                        DNA.h('li', null, '6')
                    ),
                    wrapper
                );
                const list = wrapper.querySelector('ul.list');
                const children = list.childNodes;
                expect(children[0].textContent).toBe('One');
                expect(children[1].textContent).toBe('Two');
                expect(children[2].textContent).toBe('Three');
                expect(children[3].textContent).toBe('Four');
                expect(children[4].textContent).toBe('5');
                expect(children[5].textContent).toBe('6');
                DNA.render(
                    DNA.h(
                        'ul',
                        { class: 'list' },
                        DNA.h('li', null, 'Seven'),
                        DNA.h('li', null, 'Eight'),
                        DNA.h('li', null, 'Nine'),
                        DNA.h('li', null, 'Ten'),
                        DNA.h('li', null, 11),
                        DNA.h('li', null, 12)
                    ),
                    wrapper
                );
                const newChildren = list.childNodes;
                expect(children[0]).toBe(newChildren[0]);
                expect(children[1]).toBe(newChildren[1]);
                expect(children[2]).toBe(newChildren[2]);
                expect(children[3]).toBe(newChildren[3]);
                expect(children[4]).toBe(newChildren[4]);
                expect(children[5]).toBe(newChildren[5]);
                expect(children[0].textContent).toBe('Seven');
                expect(children[1].textContent).toBe('Eight');
                expect(children[2].textContent).toBe('Nine');
                expect(children[3].textContent).toBe('Ten');
                expect(children[4].textContent).toBe('11');
                expect(children[5].textContent).toBe('12');
            });

            it('should update add and remove attributes', () => {
                DNA.render(DNA.h('div', { prop1: 'test1', prop2: 2 }), wrapper);
                const elem = wrapper.children[0];
                expect(elem.getAttribute('prop1')).toBe('test1');
                expect(elem.getAttribute('prop2')).toBe('2');
                DNA.render(DNA.h('div', { prop1: 'test1', prop3: true }), wrapper);
                expect(elem.getAttribute('prop1')).toBe('test1');
                expect(elem.getAttribute('prop2')).toBeNull();
                expect(elem.getAttribute('prop3')).toBe('');
            });

            it('should add and remove native listeners', () => {
                const listener = vi.fn();
                DNA.render(DNA.h('div', { onclick: listener }), wrapper);
                const elem = wrapper.children[0];
                expect(listener).not.toHaveBeenCalled();
                elem.click();
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledOnce();
                DNA.render(DNA.h('div', { onclick: null }), wrapper);
                elem.click();
                expect(listener).toHaveBeenCalledOnce();
            });

            it('should add and remove custom listeners', () => {
                const listener = vi.fn();
                DNA.render(DNA.h('div', { onCustom: listener }), wrapper);
                const elem = wrapper.children[0];
                expect(listener).not.toHaveBeenCalled();
                DNA.dispatchEvent(elem, 'Custom');
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledOnce();
                DNA.render(DNA.h('div', { onCustom: null }), wrapper);
                elem.click();
                expect(listener).toHaveBeenCalledOnce();
            });

            it('should update native properties', () => {
                DNA.render(
                    DNA.html`<form>
                        <input type="radio" name="test" value="1" checked=${false} />
                        <input type="radio" name="test" value="2" checked=${false} />
                    </form>`,
                    wrapper
                );
                const elem = wrapper.querySelector('input[value="2"]');
                expect(elem.getAttribute('checked')).toBeNull();
                expect(elem.checked).toBe(false);
                elem.checked = true;
                expect(elem.checked).toBe(true);
                DNA.render(
                    DNA.html`<form>
                        <input type="radio" name="test" value="1" checked=${false} />
                        <input type="radio" name="test" value="2" checked=${false} />
                    </form>`,
                    wrapper
                );
                expect(elem.getAttribute('checked')).toBeNull();
                expect(elem.checked).toBe(false);

                DNA.render(DNA.html`<img src="" alt="" />`, wrapper);
                const img = wrapper.querySelector('img');
                expect(img.draggable).toBe(true);
                DNA.render(DNA.html`<img src="" alt="" draggable=${false} />`, wrapper);
                expect(img.draggable).toBe(false);

                expect(() => DNA.render(DNA.html`<svg width=${12}></svg>`, wrapper)).to.not.throw();
                const svg = wrapper.querySelector('svg');
                expect(svg.getAttribute('width')).to.be.equal('12');
            });

            it('should convert observed attributes', () => {
                const name = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                number: {
                                    type: Number,
                                },
                            };
                        }
                    }
                );

                const elem = DNA.render(DNA.h(name, { number: '2' }), wrapper);
                expect(elem.number).toBe(2);
            });

            it('should assign properties and attributes to component', () => {
                const name = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                number: {
                                    type: Number,
                                },
                                camelCase: {
                                    type: String,
                                    attribute: 'camel-case',
                                },
                            };
                        }
                    }
                );

                const elem = DNA.render(
                    DNA.h(name, { 'number': 2, 'camelCase': 'test', 'string': '2', 'object': {}, 'data-test': '3' }),
                    wrapper
                );
                expect(elem.number).toBe(2);
                expect(elem.string).toBeUndefined();
                expect(elem.camelCase).toBe('test');
                expect(elem.getAttribute('camelCase')).toBeNull();
                expect(elem.getAttribute('camel-case')).toBe('test');
                expect(elem.getAttribute('string')).toBe('2');
                expect(elem.object).toBeTypeOf('object');
                expect(elem.getAttribute('object')).toBeNull();
                expect(elem['data-test']).toBeUndefined();
                expect(elem.getAttribute('data-test')).toBe('3');
                expect(elem.dataset.test).toBe('3');
            });

            it('should update add and remove classes', () => {
                DNA.render(DNA.h('div', { class: 'test1' }), wrapper);
                const elem = wrapper.children[0];
                expect(elem.getAttribute('class')).toBe('test1');
                elem.classList.add('test2');
                expect(elem.getAttribute('class')).toBe('test1 test2');
                DNA.render(DNA.h('div', { class: { test3: true } }), wrapper);
                expect(elem.getAttribute('class')).toBe('test2 test3');
                DNA.render(DNA.h('div', undefined), wrapper);
                expect(elem.getAttribute('class')).toBe(null);
            });

            it('should update add and remove styles', () => {
                DNA.render(DNA.h('div', { style: 'color: red;' }), wrapper);
                const elem = wrapper.children[0];
                elem.style.fontFamily = 'sans-serif';
                expect(['rgb(255, 0, 0)', 'red']).toContain(window.getComputedStyle(elem).color);
                expect(['sans-serif']).toContain(window.getComputedStyle(elem).fontFamily);
                DNA.render(DNA.h('div', { style: { backgroundColor: 'blue' } }), wrapper);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(elem).color);
                expect(['rgb(0, 0, 255)', 'blue']).toContain(window.getComputedStyle(elem).backgroundColor);
                expect(['sans-serif']).toContain(window.getComputedStyle(elem).fontFamily);
                DNA.render(DNA.h('div', { style: 'font-weight: bold;' }), wrapper);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(elem).color);
                expect(['rgba(0, 0, 0, 0)', '', 'transparent']).toContain(
                    window.getComputedStyle(elem).backgroundColor
                );
                expect(['700', 'bold']).toContain(window.getComputedStyle(elem).fontWeight);
                expect(['sans-serif']).toContain(window.getComputedStyle(elem).fontFamily);
                DNA.render(DNA.h('div', undefined), wrapper);
                expect(['rgb(0, 0, 0)', '']).toContain(window.getComputedStyle(elem).color);
            });

            it('should render svgs', () => {
                DNA.render(
                    DNA.h(
                        'div',
                        {},
                        DNA.h(
                            'svg',
                            null,
                            DNA.h(
                                'g',
                                {},
                                DNA.h('rect', { width: '100', height: '100' }),
                                DNA.h(
                                    'foreignObject',
                                    {},
                                    DNA.h('body', { xmlns: 'http://www.w3.org/1999/xhtml' }, DNA.h('p'))
                                )
                            )
                        )
                    ),
                    wrapper
                );
                const div = wrapper.querySelector('div');
                const svg = wrapper.querySelector('svg');
                const g = wrapper.querySelector('g');
                const rect = wrapper.querySelector('rect');
                const foreign = wrapper.querySelector('foreignObject');
                const body = wrapper.querySelector('body');
                const p = wrapper.querySelector('p');
                expect(div.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
                expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(g.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(rect.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(foreign.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(body.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
                expect(p.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
            });

            it('should render plain objects', () => {
                const obj = {
                    toString() {
                        return 'Test';
                    },
                };
                DNA.render(DNA.h('div', {}, obj), wrapper);
                const elem = wrapper.children[0];
                expect(elem.childNodes).toHaveLength(1);
                expect(elem.textContent).toBe('Test');
            });

            it('should not set svgs properties', () => {
                DNA.render(DNA.h('svg', null, DNA.h('line', { x1: '0', y1: '100', x2: '100', y2: '200' })), wrapper);
                const svg = wrapper.querySelector('svg');
                const line = svg.querySelector('line');
                expect(line.getAttribute('x1')).toBe('0');
                expect(line.getAttribute('y1')).toBe('100');
                expect(line.getAttribute('x2')).toBe('100');
                expect(line.getAttribute('y2')).toBe('200');
            });

            it('should not empty nodes when no slotted children has been passed', () => {
                DNA.render(DNA.h('div'), wrapper);
                const elem = wrapper.children[0];
                expect(elem.childNodes).toHaveLength(0);
                elem.appendChild(document.createElement('span'));
                expect(elem.childNodes).toHaveLength(1);
                DNA.render(DNA.h('div'), wrapper);
                expect(elem.childNodes).toHaveLength(1);
            });

            it('should not reuse slotted children', () => {
                const name = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                oneMore: {
                                    type: Boolean,
                                },
                            };
                        }

                        render() {
                            return [
                                DNA.h('div', { class: 'child1' }),
                                DNA.h('div', { class: 'child2' }),
                                this.oneMore && DNA.h('div', { class: 'child3' }),
                                DNA.h('slot'),
                            ];
                        }
                    }
                );

                const elem = DNA.render(DNA.h(name, {}, DNA.h('div', {})), wrapper);
                const realm = elem.realm;

                realm.dangerouslyOpen();
                expect(elem.childNodes).toHaveLength(3);
                const [slotted] = realm.childNodes;
                const [div1, div2, div3] = elem.childNodes;
                realm.dangerouslyClose();

                DNA.render(DNA.h(name, { oneMore: true }, DNA.h('div', {})), wrapper);

                realm.dangerouslyOpen();
                expect(elem.childNodes).toHaveLength(4);
                const [slotted2] = realm.childNodes;
                const [div4, div5, div6, div7] = elem.childNodes;
                expect(slotted).toBe(slotted2);
                expect(div1).toBe(div4);
                expect(div2).toBe(div5);
                expect(div3).toBe(div7);
                expect(div4.className).toBe('child1');
                expect(div5.className).toBe('child2');
                expect(div6.className).toBe('child3');
                expect(div7.className).toBe('');
                realm.dangerouslyClose();
            });

            it('should not reuse slotted text', () => {
                const name = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                showPrefix: {
                                    type: Boolean,
                                },
                            };
                        }

                        render() {
                            return [this.showPrefix && 'Prefix:', DNA.h('slot')];
                        }
                    }
                );

                const elem = DNA.render(DNA.h(name, {}, 'Text'), wrapper);
                const realm = elem.realm;

                realm.dangerouslyOpen();
                expect(elem.childNodes).toHaveLength(1);
                const [slotted] = realm.childNodes;
                const [textNode] = elem.childNodes;
                realm.dangerouslyClose();

                DNA.render(DNA.h(name, { showPrefix: true }, 'Text'), wrapper);

                realm.dangerouslyOpen();
                expect(elem.childNodes).toHaveLength(2);
                const [prefixNode, newTextNode] = elem.childNodes;
                expect(slotted).toBe(realm.childNodes[0]);
                expect(textNode).toBe(newTextNode);
                expect(prefixNode.textContent).toBe('Prefix:');
                expect(newTextNode.textContent).toBe('Text');
                realm.dangerouslyClose();

                DNA.render(DNA.h(name, { showPrefix: false }, 'Text'), wrapper);

                realm.dangerouslyOpen();
                expect(elem.childNodes).toHaveLength(1);
                realm.dangerouslyClose();
            });

            it('should handle emptied slot nodes', () => {
                const name = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                showSlotted: {
                                    type: Boolean,
                                    defaultValue: true,
                                },
                            };
                        }

                        render() {
                            if (this.showSlotted) {
                                return DNA.h('div', {}, DNA.h('slot'));
                            }
                            return DNA.h('div');
                        }
                    }
                );

                const elem = DNA.render(DNA.h(name, {}, 'Text'), wrapper);
                const realm = elem.realm;

                realm.dangerouslyOpen();
                const div = elem.childNodes[0];
                expect(realm.childNodes).toHaveLength(1);
                expect(div.childNodes).toHaveLength(1);
                realm.dangerouslyClose();

                DNA.render(DNA.h(name, { showSlotted: false }, 'Text'), wrapper);

                realm.dangerouslyOpen();
                expect(realm.childNodes).toHaveLength(1);
                expect(div.childNodes).toHaveLength(0);
                realm.dangerouslyClose();
            });

            it('should return a shallow clone of child list', () => {
                const list = DNA.render([DNA.h('div'), DNA.h('div'), DNA.h('div')], wrapper);
                expect(list).toHaveLength(3);
                const newList = DNA.render([DNA.h('div')], wrapper);
                expect(newList).toHaveLength(1);
                expect(list).toHaveLength(3);
            });

            it('should not replace contents when initializing parent and child components', () => {
                const name1 = getComponentName();
                const name2 = getComponentName();
                DNA.define(
                    name1,
                    class Parent extends DNA.Component {
                        render() {
                            return this.realm.childNodes
                                .filter((elem) => !!elem.tagName)
                                .map((elem) => DNA.html`<div test="test" ref=${elem} />`);
                        }
                    }
                );
                DNA.define(
                    name2,
                    class Child extends DNA.Component {
                        render() {
                            return DNA.html`<slot />`;
                        }
                    }
                );

                const parent = document.createElement(name1);
                const child = document.createElement(name2);
                child.appendChild(document.createTextNode('Hello'));
                parent.insertBefore(child, null);
                wrapper.appendChild(parent);

                expect(child.textContent).toBe('Hello');
            });

            it('should resuse refs context', () => {
                const name = getComponentName();
                DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                showList: {
                                    type: Boolean,
                                    defaultValue: true,
                                },
                                items: {
                                    type: Array,
                                },
                            };
                        }

                        list = this.ownerDocument.createElement('ul');

                        render() {
                            if (this.showList) {
                                return DNA.h('ul', { ref: this.list }, [
                                    ...this.items.map((item) => DNA.h('li', null, item)),
                                ]);
                            }
                        }
                    }
                );

                const element = document.createElement(name);
                element.items = ['one', 'two', 'three'];
                wrapper.appendChild(element);

                expect(element.list.childNodes).toHaveLength(3);
                expect(element.list.childNodes[0].textContent).toBe('one');
                expect(element.list.childNodes[1].textContent).toBe('two');
                expect(element.list.childNodes[2].textContent).toBe('three');

                element.showList = false;
                element.items = ['four', 'five'];

                expect(element.list.isConnected).toBe(false);

                element.showList = true;

                expect(element.list.childNodes).toHaveLength(2);
                expect(element.list.childNodes[0].textContent).toBe('four');
                expect(element.list.childNodes[1].textContent).toBe('five');
            });
        });

        describe('hooks', () => {
            it('should re-render on state change', () => {
                const render = vi.fn();
                const Test = function Test(props, { useState }) {
                    const [count, setCount] = useState(0);
                    render();
                    return DNA.h(
                        'button',
                        {
                            onclick() {
                                setCount(count + 1);
                            },
                        },
                        count
                    );
                };

                DNA.render(DNA.h(Test), wrapper);
                const button = wrapper.children[0];
                expect(button.textContent).toBe('0');
                expect(render).toHaveBeenCalled();
                expect(render).toHaveBeenCalledOnce();

                button.click();
                expect(wrapper.textContent).toBe('1');
                expect(render).toHaveBeenCalled();
                expect(render).toHaveBeenCalledTimes(2);

                DNA.render(DNA.h(Test), wrapper);
                expect(button.textContent).toBe('1');
            });

            it('should memo calculated value', () => {
                const factory = vi.fn(() => 1);
                const Test = function Test(props, { useMemo }) {
                    const value = useMemo(factory);
                    return DNA.h('button', {}, value);
                };

                DNA.render(DNA.h(Test), wrapper);
                const button = wrapper.children[0];
                expect(button.textContent).toBe('1');
                expect(factory).toHaveBeenCalled();
                expect(factory).toHaveBeenCalledOnce();

                DNA.render(DNA.h(Test), wrapper);
                expect(wrapper.textContent).toBe('1');
                expect(factory).toHaveBeenCalledOnce();
            });

            it('should memo calculated value with deps', () => {
                let dep = 1;
                const factory = vi.fn(() => dep);
                const Test = function Test(props, { useMemo }) {
                    const value = useMemo(factory, [dep]);
                    return DNA.h('button', {}, value);
                };

                DNA.render(DNA.h(Test), wrapper);
                const button = wrapper.children[0];
                expect(button.textContent).toBe('1');
                expect(factory).toHaveBeenCalled();
                expect(factory).toHaveBeenCalledOnce();

                dep = 2;
                DNA.render(DNA.h(Test), wrapper);
                expect(wrapper.textContent).toBe('2');
                expect(factory).toHaveBeenCalledTimes(2);
            });
        });

        describe('not keyed', () => {
            const items = ['Alan', 'Brian', 'Carl'];
            const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

            it('should reuse elements', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                    <option value="other">Other</option>
                </select>
            `,
                    wrapper
                );
                expect(wrapper.childNodes[0].tagName).toBe('SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(4);

                const first = wrapper.childNodes[0].childNodes[0];
                expect(first.tagName).toBe('OPTION');
                expect(first.textContent).toBe('Alan');

                const second = wrapper.childNodes[0].childNodes[1];
                expect(second.tagName).toBe('OPTION');
                expect(second.textContent).toBe('Brian');

                const third = wrapper.childNodes[0].childNodes[2];
                expect(third.tagName).toBe('OPTION');
                expect(third.textContent).toBe('Carl');

                const otherOption = wrapper.childNodes[0].childNodes[3];
                expect(otherOption.tagName).toBe('OPTION');
                expect(otherOption.textContent).toBe('Other');

                DNA.render(
                    DNA.html`
                <select>
                    ${items2.map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                    <option value="other">Other</option>
                </select>
            `,
                    wrapper
                );

                expect(wrapper.childNodes[0].tagName).toBe('SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(5);

                expect(wrapper.childNodes[0].childNodes[0].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[0].textContent).toBe('Daniel');
                expect(wrapper.childNodes[0].childNodes[0]).toBe(first);

                expect(wrapper.childNodes[0].childNodes[1].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[1].textContent).toBe('Eduardo');
                expect(wrapper.childNodes[0].childNodes[1]).toBe(second);

                expect(wrapper.childNodes[0].childNodes[2].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[2].textContent).toBe('Francesca');
                expect(wrapper.childNodes[0].childNodes[2]).toBe(third);

                expect(wrapper.childNodes[0].childNodes[3].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[3].textContent).toBe('Gabriella');
                expect(wrapper.childNodes[0].childNodes[3]).toBe(otherOption);

                expect(wrapper.childNodes[0].childNodes[4].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[4].textContent).toBe('Other');
                expect(wrapper.childNodes[0].childNodes[4]).not.toBe(otherOption);
            });

            it('should swap rows', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                expect(option1.textContent).toBe(items[0]);
                expect(option2.textContent).toBe(items[1]);
                expect(option3.textContent).toBe(items[2]);

                DNA.render(
                    DNA.html`
                <select>
                    ${items
                        .slice(0)
                        .reverse()
                        .map(
                            (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                        )}
                </select>
            `,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];
                const option6 = wrapper.childNodes[0].childNodes[2];

                expect(option4.textContent).toBe(items[2]);
                expect(option5.textContent).toBe(items[1]);
                expect(option6.textContent).toBe(items[0]);

                expect(option1).toBe(option4);
                expect(option2).toBe(option5);
                expect(option3).toBe(option6);
            });

            it('should delete a row', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                expect(option1.textContent).toBe(items[0]);
                expect(option2.textContent).toBe(items[1]);
                expect(option3.textContent).toBe(items[2]);

                DNA.render(
                    DNA.html`
                <select>
                    ${items.slice(1).map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];

                expect(option1.textContent).toBe(items[1]);
                expect(option2.textContent).toBe(items[2]);
                expect(option4.textContent).toBe(items[1]);
                expect(option5.textContent).toBe(items[2]);

                expect(option1).toBe(option4);
                expect(option2).toBe(option5);
            });
        });

        describe('keyed', () => {
            const items = ['Alan', 'Brian', 'Carl'];
            const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

            it('should reuse non keyed elements', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                    <option key="last" value="other">Other</option>
                </select>
            `,
                    wrapper
                );

                expect(wrapper.childNodes[0].tagName).toBe('SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(4);

                const first = wrapper.childNodes[0].childNodes[0];
                expect(first.tagName).toBe('OPTION');
                expect(first.textContent).toBe('Alan');

                const second = wrapper.childNodes[0].childNodes[1];
                expect(second.tagName).toBe('OPTION');
                expect(second.textContent).toBe('Brian');

                const third = wrapper.childNodes[0].childNodes[2];
                expect(third.tagName).toBe('OPTION');
                expect(third.textContent).toBe('Carl');

                const otherOption = wrapper.childNodes[0].childNodes[3];
                expect(otherOption.tagName).toBe('OPTION');
                expect(otherOption.textContent).toBe('Other');

                DNA.render(
                    DNA.html`
                <select>
                    ${items2.map(
                        (item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `
                    )}
                    <option key="last" value="other">Other</option>
                </select>
            `,
                    wrapper
                );

                expect(wrapper.childNodes[0].tagName).toBe('SELECT');
                expect(wrapper.childNodes[0].childNodes).toHaveLength(5);

                expect(wrapper.childNodes[0].childNodes[0].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[0].textContent).toBe('Daniel');
                expect(wrapper.childNodes[0].childNodes[0]).toBe(first);

                expect(wrapper.childNodes[0].childNodes[1].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[1].textContent).toBe('Eduardo');
                expect(wrapper.childNodes[0].childNodes[1]).toBe(second);

                expect(wrapper.childNodes[0].childNodes[2].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[2].textContent).toBe('Francesca');
                expect(wrapper.childNodes[0].childNodes[2]).toBe(third);

                expect(wrapper.childNodes[0].childNodes[3].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[3].textContent).toBe('Gabriella');
                expect(wrapper.childNodes[0].childNodes[3]).not.toBe(otherOption);

                expect(wrapper.childNodes[0].childNodes[4].tagName).toBe('OPTION');
                expect(wrapper.childNodes[0].childNodes[4].textContent).toBe('Other');
                expect(wrapper.childNodes[0].childNodes[4]).toBe(otherOption);
            });

            it('should swap rows', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                DNA.render(
                    DNA.html`
                <select>
                    ${items
                        .slice(0)
                        .reverse()
                        .map(
                            (item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `
                        )}
                </select>
            `,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];
                const option6 = wrapper.childNodes[0].childNodes[2];

                expect(option1.textContent).toBe(items[0]);
                expect(option2.textContent).toBe(items[1]);
                expect(option3.textContent).toBe(items[2]);
                expect(option4.textContent).toBe(items[2]);
                expect(option5.textContent).toBe(items[1]);
                expect(option6.textContent).toBe(items[0]);

                expect(option1).not.toBe(option4);
                expect(option1).toBe(option6);
                expect(option2).toBe(option5);
                expect(option3).not.toBe(option6);
                expect(option3).toBe(option4);
            });

            it('should add a row', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                items.splice(1, 0, 'Dylan');

                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[2];
                const option6 = wrapper.childNodes[0].childNodes[3];
                expect(wrapper.childNodes[0].childNodes[1].textContent).toBe('Dylan');
                expect(option1).toBe(option4);
                expect(option2).toBe(option5);
                expect(option3).toBe(option6);
            });

            it('should delete a row', () => {
                DNA.render(
                    DNA.html`
                <select>
                    ${items.map(
                        (item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option1 = wrapper.childNodes[0].childNodes[0];
                const option2 = wrapper.childNodes[0].childNodes[1];
                const option3 = wrapper.childNodes[0].childNodes[2];

                DNA.render(
                    DNA.html`
                <select>
                    ${items.slice(1).map(
                        (item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `
                    )}
                </select>
            `,
                    wrapper
                );

                const option4 = wrapper.childNodes[0].childNodes[0];
                const option5 = wrapper.childNodes[0].childNodes[1];

                expect(option1.textContent).toBe(items[0]);
                expect(option2.textContent).toBe(items[1]);
                expect(option3.textContent).toBe(items[2]);
                expect(option4.textContent).toBe(items[1]);
                expect(option5.textContent).toBe(items[2]);

                expect(option1).not.toBe(option4);
                expect(option2).toBe(option4);
                expect(option3).toBe(option5);
            });

            it('should delete nodes until the attached one', () => {
                const connectedCallback = vi.fn();
                const name = getComponentName();
                const TestElement = DNA.define(
                    name,
                    class TestElement extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                    }
                );
                const ref = new TestElement();

                DNA.render(
                    DNA.html`
                <h1>Title</h1>
                <h2>Subtitle</h2>
                <div ref=${ref} />
            `,
                    wrapper
                );

                expect(connectedCallback).toHaveBeenCalled();
                expect(connectedCallback).toHaveBeenCalledOnce();

                DNA.render(
                    DNA.html`
                <h1>Title</h1>
                <div ref=${ref} />
            `,
                    wrapper
                );

                expect(connectedCallback).toHaveBeenCalledOnce();
            });

            it('should correctly update nodes after Function render', () => {
                const Fn = function () {
                    return DNA.html`<div class="test" data-ref=${true}></div>`;
                };

                const [, div1, div2] = DNA.render(
                    DNA.html`
                <${Fn} />
                <div class="test" attr=${true} data-ref=${true}></div>
            `,
                    wrapper
                );

                expect(wrapper.childNodes).toHaveLength(3);
                expect(div1.tagName).toBe('DIV');
                expect(div2.tagName).toBe('DIV');
                expect(div1.dataset.ref).toBe('');
                expect(div2.getAttribute('attr')).toBe('');
                expect(div2.dataset.ref).toBe('');

                const [, div3, div4] = DNA.render(
                    DNA.html`
                <${Fn} />
                <div class="test" attr=${undefined} data-ref=${undefined}></div>
            `,
                    wrapper
                );

                expect(wrapper.childNodes).toHaveLength(3);
                expect(div3.tagName).toBe('DIV');
                expect(div4.tagName).toBe('DIV');
                expect(div3.dataset.ref).toBe('');
                expect(div4.getAttribute('attr')).toBeNull();
                expect(div4.dataset.ref).toBeUndefined();

                expect(div1).toBe(div3);
                expect(div2).toBe(div4);
            });

            it('should correctly update nodes after nested Function renders', () => {
                const Parent = function () {
                    return DNA.html`<${Child} key="2" />`;
                };

                const Child = function () {
                    return DNA.html`<div class="test" data-ref=${true}></div>`;
                };

                const [comment1, comment2, div1, div2] = DNA.render(
                    DNA.html`
                <${Parent} />
                <div class="test" attr=${true} data-ref=${true}></div>
            `,
                    wrapper
                );

                expect(wrapper.childNodes).toHaveLength(4);
                expect(div1.tagName).toBe('DIV');
                expect(div2.tagName).toBe('DIV');
                expect(div1.dataset.ref).toBe('');
                expect(div2.getAttribute('attr')).toBe('');
                expect(div2.dataset.ref).toBe('');

                const [comment3, comment4, div3, div4] = DNA.render(
                    DNA.html`
                <${Parent} />
                <div class="test" attr=${undefined} data-ref=${undefined}></div>
            `,
                    wrapper
                );

                expect(wrapper.childNodes).toHaveLength(4);
                expect(div3.tagName).toBe('DIV');
                expect(div4.tagName).toBe('DIV');
                expect(div3.dataset.ref).toBe('');
                expect(div4.getAttribute('attr')).toBeNull();
                expect(div4.dataset.ref).toBeUndefined();

                expect(comment1).toBe(comment3);
                expect(comment2).toBe(comment4);
                expect(div1).toBe(div3);
                expect(div2).toBe(div4);

                const [comment5, comment6] = DNA.render(
                    DNA.html`
                <${Parent} />
                <div class="test" attr=${undefined} data-ref=${undefined}></div>
            `,
                    wrapper
                );

                expect(comment1).toBe(comment5);
                expect(comment2).toBe(comment6);
            });
        });
    },
    10 * 1000
);
