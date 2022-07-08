/* eslint-disable mocha/no-setup-in-describe,mocha/no-hooks-for-single-case */
import { expect } from '@chialab/ginsenghino';
/* eslint-disable-next-line import/no-unresolved */
import * as DNA from '@chialab/dna';
import './app.js';

describe('Lit', () => {
    let lit, wrapper;
    before(async () => {
        lit = await import('lit');
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        DNA.DOM.appendChild(DNA.document.body, wrapper);
    });

    afterEach(() => {
        DNA.DOM.removeChild(DNA.document.body, wrapper);
    });

    it('should update text content', async () => {
        const Template = (text) => lit.html`<test-element-integration>${text}</test-element-integration>`;
        lit.render(Template('Text'), wrapper);
        const element = wrapper.children[0];

        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');

        lit.render(Template('Text update'), wrapper);
        expect(wrapper.children[0]).to.be.equal(element);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text update');
    });

    it('should update text content with multiple text nodes', async () => {
        const Template = (text) => lit.html`<test-element-integration>${text} children</test-element-integration>`;
        lit.render(Template('Text'), wrapper);
        const element = wrapper.children[0];

        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text children');
        expect(element.children[1].tagName).to.be.equal('DIV');

        lit.render(Template('Update'), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Update children');
    });

    it('should update named slots', () => {
        const Template = (title) => lit.html`<test-element-integration>
            Text
            ${title ? lit.html`<h1 slot="children">Title</h1>` : lit.html`<h2 slot="children">Subtitle</h2>`}
        </test-element-integration>`;
        lit.render(Template(true), wrapper);
        const element = wrapper.children[0];

        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent.trim()).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');
        expect(element.children[1].children).to.have.lengthOf(1);
        expect(element.children[1].children[0].tagName).to.be.equal('H1');
        expect(element.children[1].children[0].textContent.trim()).to.be.equal('Title');

        lit.render(Template(false), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent.trim()).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');
        expect(element.children[1].children).to.have.lengthOf(1);
        expect(element.children[1].children[0].tagName).to.be.equal('H2');
        expect(element.children[1].children[0].textContent.trim()).to.be.equal('Subtitle');
    });

    it('should update a textual property', () => {
        const Template = (value) => lit.html`<test-element-integration prop=${value}></test-element-integration>`;
        lit.render(Template('value'), wrapper);
        const element = wrapper.children[0];

        expect(element.prop).to.be.equal('value');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('value');

        lit.render(Template('value update'), wrapper);
        expect(element.prop).to.be.equal('value update');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('value update');
    });

    it('should update a ref property', () => {
        const Template = () => lit.html`<test-element-integration .ref=${{ title: 'Title' }}></test-element-integration>`;
        lit.render(Template(), wrapper);
        const element = wrapper.children[0];

        expect(element.ref).to.be.a('object');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('Title');
    });
});
