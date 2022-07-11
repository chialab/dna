/* eslint-disable mocha/no-setup-in-describe,mocha/no-hooks-for-single-case */
import { expect } from '@chialab/ginsenghino';
/* eslint-disable-next-line import/no-unresolved */
import * as DNA from '@chialab/dna';
import './app.js';

describe('React', () => {
    let React, ReactDOM, wrapper;
    before(async () => {
        React = await import('react');
        ReactDOM = await import('react-dom');
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        DNA.DOM.appendChild(DNA.document.body, wrapper);
    });

    afterEach(() => {
        DNA.DOM.removeChild(DNA.document.body, wrapper);
    });

    it('should update text content', async () => {
        const element = ReactDOM.render(React.createElement('test-element-integration', {}, ['Text']), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');

        ReactDOM.render(React.createElement('test-element-integration', {}, ['Text update']), wrapper);
        expect(wrapper.children[0]).to.be.equal(element);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text update');
    });

    it('should update text content with multiple text nodes', async () => {
        const element = ReactDOM.render(React.createElement('test-element-integration', {}, ['Text', ' ', 'children']), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text children');
        expect(element.children[1].tagName).to.be.equal('DIV');

        ReactDOM.render(React.createElement('test-element-integration', {}, ['Update', ' ', 'children']), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Update children');
    });

    it('should update named slots', () => {
        const element = ReactDOM.render(React.createElement('test-element-integration', {}, ['Text', React.createElement('h1', { slot: 'children' }, 'Title')]), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');
        expect(element.children[1].children).to.have.lengthOf(1);
        expect(element.children[1].children[0].tagName).to.be.equal('H1');
        expect(element.children[1].children[0].textContent).to.be.equal('Title');

        ReactDOM.render(React.createElement('test-element-integration', {}, ['Text', React.createElement('h2', { slot: 'children' }, 'Subtitle')]), wrapper);
        expect(element.children[0].tagName).to.be.equal('SPAN');
        expect(element.children[0].textContent).to.be.equal('Text');
        expect(element.children[1].tagName).to.be.equal('DIV');
        expect(element.children[1].children).to.have.lengthOf(1);
        expect(element.children[1].children[0].tagName).to.be.equal('H2');
        expect(element.children[1].children[0].textContent).to.be.equal('Subtitle');
    });

    it('should update a textual property', () => {
        const element = ReactDOM.render(React.createElement('test-element-integration', { prop: 'value' }), wrapper);
        expect(element.prop).to.be.equal('value');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('value');

        ReactDOM.render(React.createElement('test-element-integration', { prop: 'value update' }), wrapper);
        expect(element.prop).to.be.equal('value update');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('value update');
    });

    it('should update a ref property', () => {
        const element = ReactDOM.render(React.createElement('test-element-integration', { ref: { title: 'Title' } }), wrapper);
        expect(element.ref).to.be.a('object');
        expect(element.children[2].tagName).to.be.equal('P');
        expect(element.children[2].textContent).to.be.equal('Title');
    });
});
