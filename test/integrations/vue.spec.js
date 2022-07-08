/* eslint-disable mocha/no-setup-in-describe,mocha/no-hooks-for-single-case */
import { expect } from '@chialab/ginsenghino';
/* eslint-disable-next-line import/no-unresolved */
import * as DNA from '@chialab/dna';
import './app.js';

describe('Vue', () => {
    let Vue, wrapper;

    before(async () => {
        Vue = await import('vue');
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        DNA.DOM.appendChild(DNA.document.body, wrapper);
    });

    afterEach(() => {
        DNA.DOM.removeChild(DNA.document.body, wrapper);
    });

    it('should update text content', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    text: 'Text',
                };
            },
            render() {
                return Vue.h('test-element-integration', {}, [this.text]);
            },
            methods: {
                updateText(value) {
                    this.text = value;
                },
            },
        });
        app.mount(wrapper);
        const element = wrapper.children[0];

        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');

        app._instance.proxy.updateText('Text update');
        await Vue.nextTick();
        expect(wrapper.children[0]).to.be.equal(element);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text update');
    });

    it('should update text content with multiple text nodes', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    text: 'Text',
                };
            },
            render() {
                return Vue.h('test-element-integration', {}, [this.text, ' ', 'children']);
            },
            methods: {
                updateText(value) {
                    this.text = value;
                },
            },
        });
        app.mount(wrapper);
        const element = wrapper.children[0];

        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text children');
        expect(element.children[1].tagName).to.be.equal('DIV');

        app._instance.proxy.updateText('Update');
        await Vue.nextTick();
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Update children');
    });

    it('should update named slots', async () => {
        const app = Vue.createApp({
            data() {
                return {
                    title: true,
                };
            },
            render() {
                return Vue.h('test-element-integration', {}, ['Text', this.title ? Vue.h('h1', { slot: 'children' }, 'Title') : Vue.h('h2', { slot: 'children' }, 'Subtitle')]);
            },
            methods: {
                updateTitle(value) {
                    this.title = value;
                },
            },
        });
        app.mount(wrapper);
        const element = wrapper.children[0];

        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');
        expect(element.children[1].children).to.have.lengthOf(1);
        expect(element.children[1].children[0].tagName).to.be.equal('H1');
        expect(element.children[1].children[0].textContent).to.be.equal('Title');

        app._instance.proxy.updateTitle(false);
        await Vue.nextTick();
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');
        expect(element.children[1].children).to.have.lengthOf(1);
        expect(element.children[1].children[0].tagName).to.be.equal('H2');
        expect(element.children[1].children[0].textContent).to.be.equal('Subtitle');
    });

    it('should update a ref property', () => {
        const app = Vue.createApp({
            render() {
                return Vue.h('test-element-integration', { '.ref': { title: 'Title' } });
            },
        });
        app.mount(wrapper);
        const element = wrapper.children[0];
        console.log(element);

        expect(element.ref).to.be.a('object');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('Title');
    });
});
