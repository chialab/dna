// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { expect, wait, spy } from '@chialab/ginsenghino';
import { getComponentName } from './helpers.spec.js';

describe('render', function() {
    let wrapper;
    this.timeout(10 * 1000);

    before(async () => {
        wrapper = DNA.DOM.createElement('div');
    });

    beforeEach(() => {
        DNA.DOM.appendChild(DNA.window.document.body, wrapper);
    });

    afterEach(() => {
        DNA.DOM.removeChild(DNA.window.document.body, wrapper);
    });

    describe('render', () => {
        it('should render string', () => {
            expect(DNA.render('hello').textContent).to.be.equal('hello');
        });

        it('should render HTML string as simple string', () => {
            expect(DNA.render('<h1>hello</h1>').textContent).to.be.equal('<h1>hello</h1>');
        });

        it('should render number', () => {
            expect(DNA.render(42).textContent).to.be.equal('42');
        });

        it('should render boolean', () => {
            expect(DNA.render(true).textContent).to.be.equal('true');
            expect(DNA.render(false)).to.be.undefined;
        });

        it('should render undefined', () => {
            expect(DNA.render(undefined)).to.be.undefined;
        });

        it('should render null', () => {
            expect(DNA.render(null)).to.be.undefined;
        });

        it('should render hyper function', () => {
            const ul = DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')));
            expect(ul.childNodes).to.have.lengthOf(2);
            expect(ul.querySelector('li:nth-child(1)').textContent).to.be.equal('One');
            expect(ul.querySelector('li:nth-child(2)').textContent).to.be.equal('Two');
        });

        it('should render component constructor', () => {
            const name = getComponentName();
            class TestElement extends DNA.Component {}
            DNA.customElements.define(name, TestElement);

            expect(DNA.render(DNA.h(TestElement))).to.be.instanceof(TestElement);
        });

        it('should render a text node', () => {
            expect(DNA.render(DNA.DOM.createTextNode('Hello')).textContent).to.be.equal('Hello');
        });

        it('should render an element node', () => {
            expect(DNA.render(DNA.DOM.createElement('div')).tagName).to.be.equal('DIV');
        });

        it('should render an element node using the `ref` property', () => {
            const div = DNA.DOM.createElement('div');
            div.setAttribute('class', 'test');
            div.innerHTML = '<span>test</span>';
            DNA.render(DNA.html`<div><div ref=${div} id="test" /></div>`);
            expect(div.id).to.be.equal('test');
            expect(div.className).to.be.equal('test');
            expect(div.textContent).to.be.equal('test');
            expect(div.childNodes).to.have.lengthOf(1);
            expect(div.parentNode.tagName).to.be.equal('DIV');
        });

        it('should render an element node using the `h` helper', () => {
            const div = DNA.DOM.createElement('div');
            div.setAttribute('class', 'test');
            div.innerHTML = '<span>test</span>';
            DNA.render(DNA.html`<div><${div} id="test" /></div>`);
            expect(div.id).to.be.equal('test');
            expect(div.className).to.be.equal('test');
            expect(div.textContent).to.be.equal('test');
            expect(div.childNodes).to.have.lengthOf(1);
            expect(div.parentNode.tagName).to.be.equal('DIV');
        });

        it('should render an element node using the `h` helper inside a component', () => {
            const name = getComponentName();
            const name2 = getComponentName();
            class TestElement extends DNA.Component {
                render() {
                    return this.slotChildNodes.map((node) => DNA.html`<${node} id="test" />`);
                }
            }

            DNA.customElements.define(name, TestElement);

            class TestElement2 extends DNA.Component {
                render() {
                    return DNA.h(TestElement, {},
                        DNA.h('div', { class: 'test', key: 0 }, 'test'),
                        DNA.h('div', { class: 'test', key: 1 }, 'test')
                    );
                }
            }

            DNA.customElements.define(name2, TestElement2);

            const root = DNA.render(DNA.h(TestElement2), wrapper);
            const elem = wrapper.querySelector(name);
            const divs = [elem.children[0], elem.children[1]];
            // force renders in order to check if keyed elements are respected
            root.forceUpdate();
            elem.forceUpdate();
            expect(elem).to.be.equal(wrapper.querySelector(name));
            expect(elem.children[0]).to.be.equal(divs[0]);
            expect(elem.children[1]).to.be.equal(divs[1]);

            divs.forEach((div) => {
                expect(div.className).to.be.equal('test');
                expect(div.id).to.be.equal('test');
                expect(div.textContent).to.be.equal('test');
                expect(div.childNodes).to.have.lengthOf(1);
            });
        });

        it('should render mixed content', () => {
            DNA.render([
                'hello',
                'world',
                true,
                DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                DNA.DOM.createTextNode('Hello'),
                DNA.DOM.createElement('div'),
            ], wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(6);
        });

        it('should render component function', () => {
            const Test = function Test() {
                return [
                    'hello',
                    'world',
                    true,
                    DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                    DNA.DOM.createTextNode('Hello'),
                    DNA.DOM.createElement('div'),
                ];
            };

            DNA.render(DNA.h(Test), wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(7);
        });

        it('should render component function with keys', () => {
            const Test = function Test() {
                return ['hello', 'world'];
            };

            DNA.render([DNA.h(Test, { key: 1 }), DNA.h(Test, { key: 2 })], wrapper);
            const [,,, comment, text1, text2] = wrapper.childNodes;
            expect(wrapper.childNodes).to.have.lengthOf(6);
            DNA.render([DNA.h(Test, { key: 2 })], wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(3);
            expect(wrapper.childNodes[0]).to.be.equal(comment);
            expect(wrapper.childNodes[1]).to.be.equal(text1);
            expect(wrapper.childNodes[2]).to.be.equal(text2);
        });

        it('should re-render component function only', async () => {
            const render1 = spy();
            const render2 = spy();

            const Test = function Test() {
                render1();
                return 'hello';
            };

            const Clock = function Clock(props, context) {
                render2();
                let count = context.store.get('count') || 0;
                count++;
                context.store.set('count', count);
                if (count === 1) {
                    setTimeout(() => {
                        context.requestUpdate();
                    }, 200);
                }
                return count;
            };

            DNA.render([
                DNA.h(Test),
                DNA.h(Clock),
            ], wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(4);
            expect(wrapper.childNodes[1].textContent).to.be.equal('hello');
            expect(wrapper.childNodes[3].textContent).to.be.equal('1');
            await wait(500);
            expect(wrapper.childNodes[1].textContent).to.be.equal('hello');
            expect(wrapper.childNodes[3].textContent).to.be.equal('2');
            expect(render1).to.have.been.called.once;
            expect(render2).to.have.been.called.twice;
        });

        it('should add nodes', () => {
            DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')), wrapper);
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children).to.have.lengthOf(2);
            DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'), DNA.h('li', null, 'Three'), DNA.h('li', null, 'Four')), wrapper);
            const newChildren = list.childNodes;
            expect(newChildren).to.have.lengthOf(4);
            expect(children[0]).to.be.equal(newChildren[0]);
            expect(children[1]).to.be.equal(newChildren[1]);
        });

        it('should remove nodes', () => {
            DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'), DNA.h('li', null, 'Three'), DNA.h('li', null, 'Four')), wrapper);
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children).to.have.lengthOf(4);
            DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')), wrapper);
            const newChildren = list.childNodes;
            expect(newChildren).to.have.lengthOf(2);
            expect(children[0]).to.be.equal(newChildren[0]);
            expect(children[1]).to.be.equal(newChildren[1]);
        });

        it('should update nodes', () => {
            DNA.render(DNA.h('ul', { class: 'list' },
                DNA.h('li', null, 'One'),
                DNA.h('li', null, 'Two'),
                DNA.h('li', null, 'Three'),
                DNA.h('li', null, 'Four'),
                DNA.h('li', null, 5),
                DNA.h('li', null, '6')
            ), wrapper);
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children[0].textContent).to.be.equal('One');
            expect(children[1].textContent).to.be.equal('Two');
            expect(children[2].textContent).to.be.equal('Three');
            expect(children[3].textContent).to.be.equal('Four');
            expect(children[4].textContent).to.be.equal('5');
            expect(children[5].textContent).to.be.equal('6');
            DNA.render(DNA.h('ul', { class: 'list' },
                DNA.h('li', null, 'Seven'),
                DNA.h('li', null, 'Eight'),
                DNA.h('li', null, 'Nine'),
                DNA.h('li', null, 'Ten'),
                DNA.h('li', null, 11),
                DNA.h('li', null, 12)
            ), wrapper);
            const newChildren = list.childNodes;
            expect(children[0]).to.be.equal(newChildren[0]);
            expect(children[1]).to.be.equal(newChildren[1]);
            expect(children[2]).to.be.equal(newChildren[2]);
            expect(children[3]).to.be.equal(newChildren[3]);
            expect(children[4]).to.be.equal(newChildren[4]);
            expect(children[5]).to.be.equal(newChildren[5]);
            expect(children[0].textContent).to.be.equal('Seven');
            expect(children[1].textContent).to.be.equal('Eight');
            expect(children[2].textContent).to.be.equal('Nine');
            expect(children[3].textContent).to.be.equal('Ten');
            expect(children[4].textContent).to.be.equal('11');
            expect(children[5].textContent).to.be.equal('12');
        });

        it('should update add and remove attributes', () => {
            DNA.render(DNA.h('div', { prop1: 'test1', prop2: 2 }), wrapper);
            const elem = wrapper.children[0];
            expect(elem.getAttribute('prop1')).to.be.equal('test1');
            expect(elem.getAttribute('prop2')).to.be.equal('2');
            DNA.render(DNA.h('div', { prop1: 'test1', prop3: true }), wrapper);
            expect(elem.getAttribute('prop1')).to.be.equal('test1');
            expect(elem.getAttribute('prop2')).to.be.null;
            expect(elem.getAttribute('prop3')).to.be.equal('');
        });

        it('should add and remove native listeners', () => {
            const listener = spy();
            DNA.render(DNA.h('div', { onclick: listener }), wrapper);
            const elem = wrapper.children[0];
            expect(listener).to.not.have.been.called();
            elem.click();
            expect(listener).to.have.been.called();
            expect(listener).to.have.been.called.once;
            DNA.render(DNA.h('div', { onclick: null }), wrapper);
            elem.click();
            expect(listener).to.have.been.called.once;
        });

        it('should add and remove custom listeners', () => {
            const listener = spy();
            DNA.render(DNA.h('div', { onCustom: listener }), wrapper);
            const elem = wrapper.children[0];
            expect(listener).to.not.have.been.called();
            DNA.dispatchEvent(elem, 'Custom');
            expect(listener).to.have.been.called();
            expect(listener).to.have.been.called.once;
            DNA.render(DNA.h('div', { onCustom: null }), wrapper);
            elem.click();
            expect(listener).to.have.been.called.once;
        });

        it('should update native properties', () => {
            DNA.render(DNA.html`<form>
                <input type="radio" name="test" value="1" checked=${false} />
                <input type="radio" name="test" value="2" checked=${false} />
            </form>`, wrapper);
            const elem = wrapper.querySelector('input[value="2"]');
            expect(elem.getAttribute('checked')).to.be.null;
            expect(elem.checked).to.be.false;
            elem.checked = true;
            expect(elem.checked).to.be.true;
            DNA.render(DNA.html`<form>
                <input type="radio" name="test" value="1" checked=${false} />
                <input type="radio" name="test" value="2" checked=${false} />
            </form>`, wrapper);
            expect(elem.getAttribute('checked')).to.be.null;
            expect(elem.checked).to.be.false;

            DNA.render(DNA.html`<img src="" alt="" />`, wrapper);
            const img = wrapper.querySelector('img');
            expect(img.draggable).to.be.true;
            DNA.render(DNA.html`<img src="" alt="" draggable=${false} />`, wrapper);
            expect(img.draggable).to.be.false;
        });

        it('should convert observed attributes', () => {
            const name = getComponentName();
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        number: {
                            type: Number,
                        },
                    };
                }
            }

            DNA.customElements.define(name, TestElement);

            DNA.render(DNA.h(TestElement, { number: '2' }), wrapper);
            expect(wrapper.querySelector(name).number).to.be.equal(2);
        });

        it('should assign not observed attributes', () => {
            const name = getComponentName();
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        number: {
                            type: Number,
                        },
                    };
                }
            }

            DNA.customElements.define(name, TestElement);

            DNA.render(DNA.h(TestElement, { string: '2' }), wrapper);
            expect(wrapper.querySelector(name).string).to.be.equal('2');
        });

        it('should assign not string attribute', () => {
            const name = getComponentName();
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        number: {
                            type: Number,
                        },
                    };
                }
            }

            DNA.customElements.define(name, TestElement);

            DNA.render(DNA.h(TestElement, { number: 2 }), wrapper);
            expect(wrapper.querySelector(name).number).to.be.equal(2);
        });

        it('should update add and remove classes', () => {
            DNA.render(DNA.h('div', { class: 'test1' }), wrapper);
            const elem = wrapper.children[0];
            expect(elem.getAttribute('class')).to.be.equal('test1');
            elem.classList.add('test2');
            expect(elem.getAttribute('class')).to.be.equal('test1 test2');
            DNA.render(DNA.h('div', { class: { test3: true } }), wrapper);
            expect(elem.getAttribute('class')).to.be.equal('test2 test3');
        });

        it('should update add and remove styles', () => {
            DNA.render(DNA.h('div', { style: 'color: red;' }), wrapper);
            const elem = wrapper.children[0];
            elem.style.fontFamily = 'sans-serif';
            expect(DNA.window.getComputedStyle(elem).color).to.be.oneOf(['rgb(255, 0, 0)', 'red']);
            expect(DNA.window.getComputedStyle(elem).fontFamily).to.be.oneOf(['sans-serif']);
            DNA.render(DNA.h('div', { style: { backgroundColor: 'blue' } }), wrapper);
            expect(DNA.window.getComputedStyle(elem).color).to.be.oneOf(['rgb(0, 0, 0)', '']);
            expect(DNA.window.getComputedStyle(elem).backgroundColor).to.be.oneOf(['rgb(0, 0, 255)', 'blue']);
            expect(DNA.window.getComputedStyle(elem).fontFamily).to.be.oneOf(['sans-serif']);
            DNA.render(DNA.h('div', { style: 'font-weight: bold;' }), wrapper);
            expect(DNA.window.getComputedStyle(elem).color).to.be.oneOf(['rgb(0, 0, 0)', '']);
            expect(DNA.window.getComputedStyle(elem).backgroundColor).to.be.oneOf(['rgba(0, 0, 0, 0)', '', 'transparent']);
            expect(DNA.window.getComputedStyle(elem).fontWeight).to.be.oneOf(['700', 'bold']);
            expect(DNA.window.getComputedStyle(elem).fontFamily).to.be.oneOf(['sans-serif']);
        });

        it('should render svgs', () => {
            DNA.render(DNA.h('div', {}, DNA.h('svg', null, DNA.h('g', {}, DNA.h('rect', { width: '100', height: '100' }), DNA.h('foreignObject', {}, DNA.h('body', { xmlns: 'http://www.w3.org/1999/xhtml' }, DNA.h('p')))))), wrapper);
            const div = wrapper.querySelector('div');
            const svg = wrapper.querySelector('svg');
            const g = wrapper.querySelector('g');
            const rect = wrapper.querySelector('rect');
            const foreign = wrapper.querySelector('foreignObject');
            const body = wrapper.querySelector('body');
            const p = wrapper.querySelector('p');
            expect(div.namespaceURI).to.be.equal('http://www.w3.org/1999/xhtml');
            expect(svg.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');
            expect(g.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');
            expect(rect.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');
            expect(foreign.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');
            expect(body.namespaceURI).to.be.equal('http://www.w3.org/1999/xhtml');
            expect(p.namespaceURI).to.be.equal('http://www.w3.org/1999/xhtml');
        });

        it('should render plain objects', () => {
            const obj = {
                toString() {
                    return 'Test';
                },
            };
            DNA.render(DNA.h('div', {}, obj), wrapper);
            const elem = wrapper.children[0];
            expect(elem.childNodes).to.have.lengthOf(1);
            expect(elem.textContent).to.be.equal('Test');
        });

        it('should not set svgs properties', () => {
            DNA.render(DNA.h('svg', null, DNA.h('line', { x1: '0', y1: '100', x2: '100', y2: '200' })), wrapper);
            const svg = wrapper.querySelector('svg');
            const line = svg.querySelector('line');
            expect(line.getAttribute('x1')).to.be.equal('0');
            expect(line.getAttribute('y1')).to.be.equal('100');
            expect(line.getAttribute('x2')).to.be.equal('100');
            expect(line.getAttribute('y2')).to.be.equal('200');
        });

        it('should not empty nodes when no slotted children has been passed', () => {
            DNA.render(DNA.h('div'), wrapper);
            const elem = wrapper.children[0];
            expect(elem.childNodes).to.have.lengthOf(0);
            elem.appendChild(DNA.DOM.createElement('span'));
            expect(elem.childNodes).to.have.lengthOf(1);
            DNA.render(DNA.h('div'), wrapper);
            expect(elem.childNodes).to.have.lengthOf(1);
        });

        it('should not reuse slotted children', () => {
            const name = getComponentName();
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

            DNA.customElements.define(name, TestElement);

            const elem = DNA.render(DNA.h(TestElement, {}, DNA.h('div', {})), wrapper);
            expect(elem.childNodes).to.be.have.lengthOf(3);
            const [slotted] = elem.slotChildNodes;
            const [div1, div2, div3] = elem.childNodes;
            DNA.render(DNA.h(TestElement, { oneMore: true }, DNA.h('div', {})), wrapper);
            expect(elem.childNodes).to.be.have.lengthOf(4);
            const [slotted2] = elem.slotChildNodes;
            const [div4, div5, div6, div7] = elem.childNodes;
            expect(slotted).to.be.equal(slotted2);
            expect(div1).to.be.equal(div4);
            expect(div2).to.be.equal(div5);
            expect(div3).to.be.equal(div7);
            expect(div4.className).to.be.equal('child1');
            expect(div5.className).to.be.equal('child2');
            expect(div6.className).to.be.equal('child3');
            expect(div7.className).to.be.equal('');
        });

        it('should not reuse slotted text', () => {
            const name = getComponentName();
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        showPrefix: {
                            type: Boolean,
                        },
                    };
                }

                render() {
                    return [
                        this.showPrefix && 'Prefix:',
                        DNA.h('slot'),
                    ];
                }
            }

            DNA.customElements.define(name, TestElement);

            const elem = DNA.render(DNA.h(TestElement, {}, 'Text'), wrapper);
            expect(elem.childNodes).to.be.have.lengthOf(1);
            const [slotted] = elem.slotChildNodes;
            const [textNode] = elem.childNodes;
            DNA.render(DNA.h(TestElement, { showPrefix: true }, 'Text'), wrapper);
            expect(elem.childNodes).to.be.have.lengthOf(2);
            const [prefixNode, newTextNode] = elem.childNodes;
            expect(slotted).to.be.equal(elem.slotChildNodes[0]);
            expect(textNode).to.be.equal(newTextNode);
            expect(prefixNode.textContent).to.be.equal('Prefix:');
            expect(newTextNode.textContent).to.be.equal('Text');
            DNA.render(DNA.h(TestElement, { showPrefix: false }, 'Text'), wrapper);
            expect(elem.childNodes).to.be.have.lengthOf(1);
        });

        it('should handle emptied slot nodes', () => {
            const name = getComponentName();
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

            DNA.customElements.define(name, TestElement);

            const elem = DNA.render(DNA.h(TestElement, {}, 'Text'), wrapper);
            const div = elem.childNodes[0];
            expect(elem.slotChildNodes).to.be.have.lengthOf(1);
            expect(div.childNodes).to.be.have.lengthOf(1);
            DNA.render(DNA.h(TestElement, { showSlotted: false }, 'Text'), wrapper);
            expect(elem.slotChildNodes).to.be.have.lengthOf(1);
            expect(div.childNodes).to.be.have.lengthOf(0);
        });

        it('should return a shallow clone of child list', () => {
            const list = DNA.render([DNA.h('div'), DNA.h('div'), DNA.h('div')], wrapper);
            expect(list).to.have.lengthOf(3);
            const newList = DNA.render([DNA.h('div')], wrapper);
            expect(newList).to.have.lengthOf(1);
            expect(list).to.have.lengthOf(3);
        });

        it('should not replace contents when initializing parent and child components', () => {
            const name1 = getComponentName();
            const name2 = getComponentName();

            class Parent extends DNA.Component {
                render() {
                    return this.slotChildNodes.filter((elem) => !!elem.tagName).map((elem) => DNA.html`<div test="test" ref=${elem} />`);
                }
            }

            class Child extends DNA.Component {
                render() {
                    return DNA.html`<slot />`;
                }
            }

            DNA.customElements.define(name1, Parent);
            DNA.customElements.define(name2, Child);

            const parent = DNA.DOM.createElement(name1);

            const child = DNA.DOM.createElement(name2);
            child.appendChild(DNA.DOM.createTextNode('Hello'));
            parent.insertBefore(child, null);
            DNA.DOM.appendChild(wrapper, parent);

            expect(child.textContent).to.be.equal('Hello');
        });
    });

    describe('not keyed', () => {
        const items = ['Alan', 'Brian', 'Carl'];
        const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

        it('should reuse elements', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option value="other">Other</option>
                </select>
            `, wrapper);
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

            DNA.render(DNA.html`
                <select>
                    ${items2.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option value="other">Other</option>
                </select>
            `, wrapper);

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
            expect(wrapper.childNodes[0].childNodes[4]).to.not.be.equal(otherOption);
        });

        it('should swap rows', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            expect(option1.textContent).to.be.equal(items[0]);
            expect(option2.textContent).to.be.equal(items[1]);
            expect(option3.textContent).to.be.equal(items[2]);

            DNA.render(DNA.html`
                <select>
                    ${items.slice(0).reverse().map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option4 = wrapper.childNodes[0].childNodes[0];
            const option5 = wrapper.childNodes[0].childNodes[1];
            const option6 = wrapper.childNodes[0].childNodes[2];

            expect(option4.textContent).to.be.equal(items[2]);
            expect(option5.textContent).to.be.equal(items[1]);
            expect(option6.textContent).to.be.equal(items[0]);

            expect(option1).to.be.equal(option4);
            expect(option2).to.be.equal(option5);
            expect(option3).to.be.equal(option6);
        });

        it('should delete a row', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            expect(option1.textContent).to.be.equal(items[0]);
            expect(option2.textContent).to.be.equal(items[1]);
            expect(option3.textContent).to.be.equal(items[2]);

            DNA.render(DNA.html`
                <select>
                    ${items.slice(1).map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option4 = wrapper.childNodes[0].childNodes[0];
            const option5 = wrapper.childNodes[0].childNodes[1];

            expect(option1.textContent).to.be.equal(items[1]);
            expect(option2.textContent).to.be.equal(items[2]);
            expect(option4.textContent).to.be.equal(items[1]);
            expect(option5.textContent).to.be.equal(items[2]);

            expect(option1).to.be.equal(option4);
            expect(option2).to.be.equal(option5);
        });
    });

    describe('keyed', () => {
        const items = ['Alan', 'Brian', 'Carl'];
        const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

        it('should reuse non keyed elements', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option key="last" value="other">Other</option>
                </select>
            `, wrapper);

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

            DNA.render(DNA.html`
                <select>
                    ${items2.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option key="last" value="other">Other</option>
                </select>
            `, wrapper);

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
            expect(wrapper.childNodes[0].childNodes[4]).to.be.equal(otherOption);
        });

        it('should swap rows', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            DNA.render(DNA.html`
                <select>
                    ${items.slice(0).reverse().map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option4 = wrapper.childNodes[0].childNodes[0];
            const option5 = wrapper.childNodes[0].childNodes[1];
            const option6 = wrapper.childNodes[0].childNodes[2];

            expect(option1.textContent).to.be.equal(items[0]);
            expect(option2.textContent).to.be.equal(items[1]);
            expect(option3.textContent).to.be.equal(items[2]);
            expect(option4.textContent).to.be.equal(items[2]);
            expect(option5.textContent).to.be.equal(items[1]);
            expect(option6.textContent).to.be.equal(items[0]);

            expect(option1).to.be.not.equal(option4);
            expect(option1).to.be.equal(option6);
            expect(option2).to.be.equal(option5);
            expect(option3).to.be.not.equal(option6);
            expect(option3).to.be.equal(option4);
        });

        it('should add a row', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            items.splice(1, 0, 'Dylan');

            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option4 = wrapper.childNodes[0].childNodes[0];
            const option5 = wrapper.childNodes[0].childNodes[2];
            const option6 = wrapper.childNodes[0].childNodes[3];
            expect(wrapper.childNodes[0].childNodes[1].textContent).to.be.equal('Dylan');
            expect(option1).to.be.equal(option4);
            expect(option2).to.be.equal(option5);
            expect(option3).to.be.equal(option6);
        });

        it('should delete a row', () => {
            DNA.render(DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            DNA.render(DNA.html`
                <select>
                    ${items.slice(1).map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `, wrapper);

            const option4 = wrapper.childNodes[0].childNodes[0];
            const option5 = wrapper.childNodes[0].childNodes[1];

            expect(option1.textContent).to.be.equal(items[0]);
            expect(option2.textContent).to.be.equal(items[1]);
            expect(option3.textContent).to.be.equal(items[2]);
            expect(option4.textContent).to.be.equal(items[1]);
            expect(option5.textContent).to.be.equal(items[2]);

            expect(option1).to.be.not.equal(option4);
            expect(option2).to.be.equal(option4);
            expect(option3).to.be.equal(option5);
        });

        it('should delete nodes until the attached one', () => {
            const connectedCallback = spy();

            const name = getComponentName();
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.customElements.define(name, TestElement);

            const ref = new TestElement();

            DNA.render(DNA.html`
                <h1>Title</h1>
                <h2>Subtitle</h2>
                <div ref=${ref} />
            `, wrapper);

            expect(connectedCallback).to.have.been.called();
            expect(connectedCallback).to.have.been.called.once;

            DNA.render(DNA.html`
                <h1>Title</h1>
                <div ref=${ref} />
            `, wrapper);

            expect(connectedCallback).to.have.been.called.once;
        });

        it('should correctly update nodes after Function render', () => {
            const Fn = function() {
                return DNA.html`<div class="test" data-ref=${true}></div>`;
            };

            const [, div1, div2] = DNA.render(DNA.html`
                <${Fn} />
                <div class="test" attr=${true} data-ref=${true}></div>
            `, wrapper);

            expect(wrapper.childNodes).to.have.lengthOf(3);
            expect(div1.tagName).to.be.equal('DIV');
            expect(div2.tagName).to.be.equal('DIV');
            expect(div1.dataset.ref).to.be.equal('');
            expect(div2.getAttribute('attr')).to.be.equal('');
            expect(div2.dataset.ref).to.be.equal('');

            const [, div3, div4] = DNA.render(DNA.html`
                <${Fn} />
                <div class="test" attr=${undefined} data-ref=${undefined}></div>
            `, wrapper);

            expect(wrapper.childNodes).to.have.lengthOf(3);
            expect(div3.tagName).to.be.equal('DIV');
            expect(div4.tagName).to.be.equal('DIV');
            expect(div3.dataset.ref).to.be.equal('');
            expect(div4.getAttribute('attr')).to.be.null;
            expect(div4.dataset.ref).to.be.undefined;

            expect(div1).to.be.equal(div3);
            expect(div2).to.be.equal(div4);
        });

        it('should correctly update nodes after nested Function renders', () => {
            const Parent = function() {
                return DNA.html`<${Child} key="2" />`;
            };

            const Child = function() {
                return DNA.html`<div class="test" data-ref=${true}></div>`;
            };

            const [comment1, comment2, div1, div2] = DNA.render(DNA.html`
                <${Parent} />
                <div class="test" attr=${true} data-ref=${true}></div>
            `, wrapper);

            expect(wrapper.childNodes).to.have.lengthOf(4);
            expect(div1.tagName).to.be.equal('DIV');
            expect(div2.tagName).to.be.equal('DIV');
            expect(div1.dataset.ref).to.be.equal('');
            expect(div2.getAttribute('attr')).to.be.equal('');
            expect(div2.dataset.ref).to.be.equal('');

            const [comment3, comment4, div3, div4] = DNA.render(DNA.html`
                <${Parent} />
                <div class="test" attr=${undefined} data-ref=${undefined}></div>
            `, wrapper);

            expect(wrapper.childNodes).to.have.lengthOf(4);
            expect(div3.tagName).to.be.equal('DIV');
            expect(div4.tagName).to.be.equal('DIV');
            expect(div3.dataset.ref).to.be.equal('');
            expect(div4.getAttribute('attr')).to.be.null;
            expect(div4.dataset.ref).to.be.undefined;

            expect(comment1).to.be.equal(comment3);
            expect(comment2).to.be.equal(comment4);
            expect(div1).to.be.equal(div3);
            expect(div2).to.be.equal(div4);

            const [comment5, comment6] = DNA.render(DNA.html`
                <${Parent} />
                <div class="test" attr=${undefined} data-ref=${undefined}></div>
            `, wrapper);

            expect(comment1).to.be.equal(comment5);
            expect(comment2).to.be.equal(comment6);
        });
    });
});
