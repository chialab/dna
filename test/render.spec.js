import { getComponentName, wait, spyFunction } from './helpers.spec.js';
import * as DNA from '@chialab/dna';
import { expect } from '@esm-bundle/chai/esm/chai.js';

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
            function Test() {
                return [
                    'hello',
                    'world',
                    true,
                    DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                    DNA.DOM.createTextNode('Hello'),
                    DNA.DOM.createElement('div'),
                ];
            }

            DNA.render(DNA.h(Test), wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(7);
        });

        it('should re-render component function only', async () => {
            const render1 = spyFunction();
            const render2 = spyFunction();

            function Test() {
                render1();
                return 'hello';
            }

            function Clock(props, context) {
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
            }

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
            expect(render1.count).to.be.equal(1);
            expect(render2.count).to.be.equal(2);
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
            DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'), DNA.h('li', null, 'Three'), DNA.h('li', null, 'Four')), wrapper);
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children[0].textContent).to.be.equal('One');
            expect(children[1].textContent).to.be.equal('Two');
            expect(children[2].textContent).to.be.equal('Three');
            expect(children[3].textContent).to.be.equal('Four');
            DNA.render(DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'Five'), DNA.h('li', null, 'Six'), DNA.h('li', null, 'Seven'), DNA.h('li', null, 'Height')), wrapper);
            const newChildren = list.childNodes;
            expect(children[0]).to.be.equal(newChildren[0]);
            expect(children[1]).to.be.equal(newChildren[1]);
            expect(children[2]).to.be.equal(newChildren[2]);
            expect(children[3]).to.be.equal(newChildren[3]);
            expect(children[0].textContent).to.be.equal('Five');
            expect(children[1].textContent).to.be.equal('Six');
            expect(children[2].textContent).to.be.equal('Seven');
            expect(children[3].textContent).to.be.equal('Height');
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
            const listener = spyFunction();
            DNA.render(DNA.h('div', { onclick: listener }), wrapper);
            const elem = wrapper.children[0];
            expect(listener.invoked).to.be.false;
            elem.click();
            expect(listener.invoked).to.be.true;
            expect(listener.count).to.be.equal(1);
            DNA.render(DNA.h('div', { onclick: null }), wrapper);
            elem.click();
            expect(listener.count).to.be.equal(1);
        });

        it('should add and remove custom listeners', () => {
            const listener = spyFunction();
            DNA.render(DNA.h('div', { onCustom: listener }), wrapper);
            const elem = wrapper.children[0];
            expect(listener.invoked).to.be.false;
            DNA.dispatchEvent(elem, 'Custom');
            expect(listener.invoked).to.be.true;
            expect(listener.count).to.be.equal(1);
            DNA.render(DNA.h('div', { onCustom: null }), wrapper);
            elem.click();
            expect(listener.count).to.be.equal(1);
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

        it('should resuse non keyed elements', () => {
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
            expect(option2).to.be.equal(option5);
            expect(option3).to.be.not.equal(option6);
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
    });
});
