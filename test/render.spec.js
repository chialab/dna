import { getModule } from './helpers.js';

let DNA, wrapper;

describe('render', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
        wrapper = DNA.DOM.createElement('div');
    });

    describe('#render', () => {
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
    });
});
