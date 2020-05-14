import { getModule, getComponentName } from './helpers.js';

let DNA, wrapper;

describe('render', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
        wrapper = DNA.DOM.createElement('div');
    });

    describe('render', () => {
        it('should render string', () => {
            DNA.render(wrapper, 'hello');
            expect(wrapper.innerHTML).to.be.equal('hello');
        });

        it('should render HTML string as simple string', () => {
            DNA.render(wrapper, '<h1>hello</h1>');
            expect(wrapper.innerHTML).to.be.equal('&lt;h1&gt;hello&lt;/h1&gt;');
        });

        it('should render number', () => {
            DNA.render(wrapper, 42);
            expect(wrapper.innerHTML).to.be.equal('42');
        });

        it('should render boolean', () => {
            DNA.render(wrapper, true);
            expect(wrapper.innerHTML).to.be.equal('true');
            DNA.render(wrapper, false);
            expect(wrapper.innerHTML).to.be.equal('');
        });

        it('should render undefined', () => {
            DNA.render(wrapper, 'hello');
            expect(wrapper.innerHTML).to.be.equal('hello');
            DNA.render(wrapper, undefined);
            expect(wrapper.innerHTML).to.be.equal('');
        });

        it('should render null', () => {
            DNA.render(wrapper, 'hello');
            expect(wrapper.innerHTML).to.be.equal('hello');
            DNA.render(wrapper, null);
            expect(wrapper.innerHTML).to.be.equal('');
        });

        it('should render interpolated function', () => {
            DNA.render(wrapper, DNA.interpolate('hello {{name}}! do you like {{food}}?', {
                name: 'Snow White',
                food: 'apples',
            }));
            expect(wrapper.innerHTML).to.be.equal('hello Snow White! do you like apples?');
        });

        it('should render hyper function', () => {
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')));
            expect(wrapper.querySelector('ul.list')).to.exist;
            expect(wrapper.querySelector('ul.list').childNodes).to.have.lengthOf(2);
            expect(wrapper.querySelector('ul.list').querySelector('li:nth-child(1)').textContent).to.be.equal('One');
            expect(wrapper.querySelector('ul.list').querySelector('li:nth-child(2)').textContent).to.be.equal('Two');
        });

        it('should render component constructor', () => {
            const name = getComponentName();
            class TestElement extends DNA.Component {}

            DNA.customElements.define(name, TestElement);

            DNA.render(wrapper, DNA.h(TestElement));
            expect(wrapper.querySelector(name)).to.exist;
        });

        it('should render a text node', () => {
            DNA.render(wrapper, DNA.DOM.createTextNode('Hello'));
            expect(wrapper.childNodes).to.have.lengthOf(1);
            expect(wrapper.childNodes[0].textContent).to.be.equal('Hello');
        });

        it('should render an element node', () => {
            DNA.render(wrapper, DNA.DOM.createElement('div'));
            expect(wrapper.childNodes).to.have.lengthOf(1);
            expect(wrapper.childNodes[0].tagName).to.be.equal('DIV');
        });

        it('should render a style node with scope', () => {
            DNA.render(wrapper, DNA.h('style', {}, '.test {}'), {
                is: 'my-card',
            });
            expect(wrapper.childNodes).to.have.lengthOf(1);
            expect(wrapper.childNodes[0].tagName).to.be.equal('STYLE');
            expect(wrapper.childNodes[0].textContent).to.be.equal('[is="my-card"] .test {}');
        });

        it('should render mixed content', () => {
            DNA.render(wrapper, [
                'hello',
                true,
                DNA.interpolate('hello {{name}}! do you like {{food}}?', {
                    name: 'Snow White',
                    food: 'apples',
                }),
                DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                DNA.DOM.createTextNode('Hello'),
                DNA.DOM.createElement('div'),
            ]);
            expect(wrapper.childNodes).to.have.lengthOf(6);
        });

        it('should render component function', () => {
            function Test() {
                return [
                    'hello',
                    true,
                    DNA.interpolate('hello {{name}}! do you like {{food}}?', {
                        name: 'Snow White',
                        food: 'apples',
                    }),
                    DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                    DNA.DOM.createTextNode('Hello'),
                    DNA.DOM.createElement('div'),
                ];
            }

            DNA.render(wrapper, DNA.h(Test));
            expect(wrapper.childNodes).to.have.lengthOf(6);
        });

        it('should filter contents', () => {
            DNA.render(wrapper, [
                'hello',
                true,
                DNA.interpolate('hello {{name}}! do you like {{food}}?', {
                    name: 'Snow White',
                    food: 'apples',
                }),
                DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')),
                DNA.DOM.createTextNode('Hello'),
                DNA.DOM.createElement('div'),
            ],
            null,
            null,
            (node) => !!node.tagName);
            expect(wrapper.childNodes).to.have.lengthOf(2);
        });

        it('should add nodes', () => {
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')));
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children).to.have.lengthOf(2);
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'), DNA.h('li', null, 'Three'), DNA.h('li', null, 'Four')));
            const newChildren = list.childNodes;
            expect(newChildren).to.have.lengthOf(4);
            expect(children[0]).to.be.equal(newChildren[0]);
            expect(children[1]).to.be.equal(newChildren[1]);
        });

        it('should remove nodes', () => {
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'), DNA.h('li', null, 'Three'), DNA.h('li', null, 'Four')));
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children).to.have.lengthOf(4);
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two')));
            const newChildren = list.childNodes;
            expect(newChildren).to.have.lengthOf(2);
            expect(children[0]).to.be.equal(newChildren[0]);
            expect(children[1]).to.be.equal(newChildren[1]);
        });

        it('should update nodes', () => {
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'One'), DNA.h('li', null, 'Two'), DNA.h('li', null, 'Three'), DNA.h('li', null, 'Four')));
            const list = wrapper.querySelector('ul.list');
            const children = list.childNodes;
            expect(children[0].textContent).to.be.equal('One');
            expect(children[1].textContent).to.be.equal('Two');
            expect(children[2].textContent).to.be.equal('Three');
            expect(children[3].textContent).to.be.equal('Four');
            DNA.render(wrapper, DNA.h('ul', { class: 'list' }, DNA.h('li', null, 'Five'), DNA.h('li', null, 'Six'), DNA.h('li', null, 'Seven'), DNA.h('li', null, 'Height')));
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

        it('should render svgs', () => {
            DNA.render(wrapper, DNA.h('div', {}, DNA.h('svg', null, DNA.h('g', {}, DNA.h('rect', { width: '100', height: '100' }), DNA.h('foreignObject', {}, DNA.h('body', { xmlns: 'http://www.w3.org/1999/xhtml' }, DNA.h('p')))))));
            const div = wrapper.querySelector('div');
            const svg = wrapper.querySelector('svg');
            const g = wrapper.querySelector('g');
            const rect = wrapper.querySelector('rect');
            const foreign = wrapper.querySelector('foreignobject');
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

        it('should not set svgs properties', () => {
            DNA.render(wrapper, DNA.h('svg', null, DNA.h('line', { x1: '0', y1: '100', x2: '100', y2: '200' })));
            const svg = wrapper.querySelector('svg');
            const line = svg.querySelector('line');
            expect(line.getAttribute('x1')).to.be.equal('0');
            expect(line.getAttribute('y1')).to.be.equal('100');
            expect(line.getAttribute('x2')).to.be.equal('100');
            expect(line.getAttribute('y2')).to.be.equal('200');
        });
    });

    describe('not keyed', () => {
        const items = ['Alan', 'Brian', 'Carl'];
        const items2 = ['Daniel', 'Eduardo', 'Francesca', 'Gabriella'];

        it('should reuse elements', () => {
            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option value="other">Other</option>
                </select>
            `);
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

            DNA.render(wrapper, DNA.html`
                <select>
                    ${items2.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option value="other">Other</option>
                </select>
            `);

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
            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            expect(option1.textContent).to.be.equal(items[0]);
            expect(option2.textContent).to.be.equal(items[1]);
            expect(option3.textContent).to.be.equal(items[2]);

            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.slice(0).reverse().map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `);

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
            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            expect(option1.textContent).to.be.equal(items[0]);
            expect(option2.textContent).to.be.equal(items[1]);
            expect(option3.textContent).to.be.equal(items[2]);

            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.slice(1).map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                </select>
            `);

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
            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option key="last" value="other">Other</option>
                </select>
            `);
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

            DNA.render(wrapper, DNA.html`
                <select>
                    ${items2.map((item) => DNA.html`
                        <option value=${item}>${item}</option>
                    `)}
                    <option key="last" value="other">Other</option>
                </select>
            `);

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
            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.slice(0).reverse().map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `);

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
            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `);

            const option1 = wrapper.childNodes[0].childNodes[0];
            const option2 = wrapper.childNodes[0].childNodes[1];
            const option3 = wrapper.childNodes[0].childNodes[2];

            DNA.render(wrapper, DNA.html`
                <select>
                    ${items.slice(1).map((item) => DNA.html`
                        <option key=${item} value=${item}>${item}</option>
                    `)}
                </select>
            `);

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

        it('should access keyed element in context', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<input key="firstName" placeholder="Eg. Alan" />`;
                }
            }

            DNA.customElements.define(getComponentName(), TestElement);

            const element = new TestElement();
            element.forceUpdate();

            expect(element.childNodes).to.have.lengthOf(1);
            expect(element.childNodes[0].tagName).to.be.equal('INPUT');
            expect(element.childNodes[0]).to.be.equal(element.$.firstName);
        });
    });
});
