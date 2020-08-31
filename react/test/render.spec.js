import { Component, html as _html, customElements, DOM, Root } from '@chialab/dna/react';
import ReactDOM from 'react-dom';

describe('[React]', () => {
    describe('Root', () => {
        let wrapper, TestBaseComponent, TestNativeComponent, tagBase = 'react-component', tagNative = 'react-native-component';

        before(() => {
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);

            TestBaseComponent = class TestBaseComponent extends Component {
                static get observedAttributes() {
                    return ['name'];
                }

                static get properties() {
                    return {
                        name: String,
                        tags: Array,
                    };
                }

                render() {
                    return _html`
                        <h1>Hello ${this.name || 'World'}</h1>
                        <div class="tags">${this.tags && this.tags.join(',')}</div>
                        <slot />
                    `;
                }
            };

            customElements.define(tagBase, TestBaseComponent);

            TestNativeComponent = class TagNativeComponent extends Component {
                static get observedAttributes() {
                    return ['name'];
                }

                static get properties() {
                    return {
                        name: String,
                        tags: Array,
                    };
                }

                render() {
                    return _html`
                        <h1>Hello ${this.name || 'World'}</h1>
                        <div class="tags">${this.tags && this.tags.join(',')}</div>
                        <slot />
                    `;
                }
            };

            customElements.define(tagNative, TestNativeComponent, {
                extends: 'article',
            });
        });

        it('should render simple element', () => {
            ReactDOM.render(<Root><react-component></react-component></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem).to.be.instanceof(TestBaseComponent);
            expect(elem.outerHTML).to.be.equal(`<${tagBase} :defined=""><h1>Hello World</h1><div class="tags"></div></${tagBase}>`);
        });

        it('should render native element', () => {
            ReactDOM.render(<Root><article is="react-native-component"></article></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem).to.be.instanceof(TestNativeComponent);
            expect(elem.outerHTML).to.be.equal(`<article is="${tagNative}" :defined=""><h1>Hello World</h1><div class="tags"></div></article>`);
        });

        it('should render element with attribute', () => {
            ReactDOM.render(<Root><react-component attr="2"></react-component></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem.outerHTML).to.be.equal(`<${tagBase} attr="2" :defined=""><h1>Hello World</h1><div class="tags"></div></${tagBase}>`);
        });

        it('should render element with observed attribute', () => {
            ReactDOM.render(<Root><react-component name="Alan" attr="2"></react-component></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem.outerHTML).to.be.equal(`<${tagBase} attr="2" :defined="" name="Alan"><h1>Hello Alan</h1><div class="tags"></div></${tagBase}>`);
        });

        it('should render element with property', () => {
            ReactDOM.render(<Root><react-component name="Alan" tags={['test']}></react-component></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem.outerHTML).to.be.equal(`<${tagBase} :defined="" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div></${tagBase}>`);
        });

        it('should render element with slotted text', () => {
            ReactDOM.render(<Root><react-component name="Alan" tags={['test']}>Test</react-component></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem.outerHTML).to.be.equal(`<${tagBase} :defined="" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div>Test</${tagBase}>`);
        });

        it('should render element with slotted element', () => {
            ReactDOM.render(<Root><react-component name="Alan" tags={['test']}>Test <strong>Test</strong></react-component></Root>, wrapper);
            let elem = wrapper.children[0];
            expect(elem.outerHTML).to.be.equal(`<${tagBase} :defined="" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div>Test <strong>Test</strong></${tagBase}>`);
        });
    });
});
