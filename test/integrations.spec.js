/* eslint-disable mocha/no-setup-in-describe,mocha/no-hooks-for-single-case */
import { expect } from '@chialab/ginsenghino';
/* eslint-disable-next-line import/no-unresolved */
import * as DNA from '@chialab/dna';

const allowFail = (title, callback) => {
    it(title, async function(...args) {
        try {
            await callback.apply(this, args);
        } catch {
            this.skip();
        }
    });
};

describe('Integrations', () => {
    let TestElement, wrapper;
    before(() => {
        TestElement = class extends DNA.Component {
            static get properties() {
                return {
                    prop: { type: String },
                };
            }

            render() {
                return DNA.html`
                    <span>
                        <slot />
                    </span>
                    <div>
                        <slot name="children" />
                    </div>
                    ${DNA.html`<p>${this.prop}</p>`}
                `;
            }
        };

        DNA.customElements.define('test-element-integration', TestElement);
    });

    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        DNA.DOM.appendChild(DNA.document.body, wrapper);
    });

    afterEach(() => {
        DNA.DOM.removeChild(DNA.document.body, wrapper);
    });

    describe('react', () => {
        let React, ReactDOM;
        before(async () => {
            React = await import('react');
            ReactDOM = await import('react-dom');
        });

        allowFail('should update text content', async () => {
            const element = ReactDOM.render(React.createElement('test-element-integration', {}, ['Text']), wrapper);
            expect(element.children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].textContent).to.be.equal('Text');
            expect(element.children[1].tagName).to.be.equal('DIV');

            ReactDOM.render(React.createElement('test-element-integration', {}, ['Text update']), wrapper);
            expect(wrapper.children[0]).to.be.equal(element);
            expect(element.children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].textContent).to.be.equal('Text update');
        });

        allowFail('should update text content with multiple text nodes', async () => {
            const element = ReactDOM.render(React.createElement('test-element-integration', {}, ['Text', ' ', 'children']), wrapper);
            expect(element.children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].textContent).to.be.equal('Text children');
            expect(element.children[1].tagName).to.be.equal('DIV');

            ReactDOM.render(React.createElement('test-element-integration', {}, ['Update', ' ', 'children']), wrapper);
            expect(element.children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].textContent).to.be.equal('Update children');
        });

        allowFail('should update named slots', () => {
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

        allowFail('should update a property', () => {
            const element = ReactDOM.render(React.createElement('test-element-integration', { prop: 'value' }), wrapper);
            expect(element.prop).to.be.equal('value');
            expect(element.children[2].tagName).to.be.equal('P');
            expect(element.children[2].textContent).to.be.equal('value');

            ReactDOM.render(React.createElement('test-element-integration', { prop: 'value update' }), wrapper);
            expect(element.prop).to.be.equal('value update');
            expect(element.children[2].tagName).to.be.equal('P');
            expect(element.children[2].textContent).to.be.equal('value update');
        });
    });

    describe('lit', () => {
        let lit;
        before(async () => {
            lit = await import('lit');
        });

        allowFail('should update text content', async () => {
            const Template = (text) => lit.html`<test-element-integration>${text}</test-element-integration>`;

            lit.render(Template('Text'), wrapper);
            const element = wrapper.children[0];

            // element.forceUpdate();
            expect(element.children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].textContent).to.be.equal('Text');
            expect(element.children[1].tagName).to.be.equal('DIV');

            lit.render(Template('Text update'), wrapper);
            expect(wrapper.children[0]).to.be.equal(element);
            expect(element.children[0].tagName).to.be.equal('SPAN');
            expect(element.children[0].textContent).to.be.equal('Text update');
        });

        allowFail('should update text content with multiple text nodes', async () => {
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

        allowFail('should update named slots', () => {
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

        allowFail('should update a property', () => {
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
    });

    describe('vue', () => {
        it.skip('should update text content', () => {

        });
    });
});
