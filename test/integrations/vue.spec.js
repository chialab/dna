/* eslint-disable mocha/no-setup-in-describe,mocha/no-hooks-for-single-case */
import { expect } from '@chialab/ginsenghino';
/* eslint-disable-next-line import/no-unresolved */
import * as DNA from '@chialab/dna';

describe('Vue', () => {
    let Vue, TestElement, wrapper;
    before(async () => {
        Vue = await import('vue');

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

    it('should update text content', () => {
        const app = Vue.createApp({
            render() {
                return Vue.h('test-element-integration', {}, ['Text']);
            },
        });
        app.mount(wrapper);
        console.log(wrapper);

        // const element = ReactDOM.render(React.createElement('test-element-integration', {}, ['Text']), wrapper);
        // expect(element.children[0].tagName).to.be.equal('SPAN');
        // expect(element.children[0].textContent).to.be.equal('Text');
        // expect(element.children[1].tagName).to.be.equal('DIV');

        // ReactDOM.render(React.createElement('test-element-integration', {}, ['Text update']), wrapper);
        // expect(wrapper.children[0]).to.be.equal(element);
        // expect(element.children[0].tagName).to.be.equal('SPAN');
        // expect(element.children[0].textContent).to.be.equal('Text update');
    });
});
