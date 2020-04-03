import { Component, html as _html, define, DOM } from '@chialab/dna/react.js';
import { getComponentName } from '../helpers.js';
import ReactDOM from 'react-dom';

describe('[React] render', () => {
    let wrapper, TestBaseComponent, TagNativeComponent, tagBase = getComponentName(), tagNative = getComponentName();

    before(() => {
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);

        TestBaseComponent = class TestBaseComponent extends Component {
            static get observedAttributes() {
                return ['name'];
            }

            get properties() {
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

        define(tagBase, TestBaseComponent);

        TagNativeComponent = class TagNativeComponent extends Component {
            static get observedAttributes() {
                return ['name'];
            }

            get properties() {
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

        define(tagNative, TagNativeComponent, {
            extends: 'article',
        });
    });

    it('should render simple element', () => {
        ReactDOM.render(<TestBaseComponent.React />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<${tagBase} is="${tagBase}"><h1>Hello World</h1><div class="tags"></div></${tagBase}>`);
    });

    it('should render native element', () => {
        ReactDOM.render(<TagNativeComponent.React />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<article is="${tagNative}"><h1>Hello World</h1><div class="tags"></div></article>`);
    });

    it('should render element with attribute', () => {
        ReactDOM.render(<TestBaseComponent.React attr="2" />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<${tagBase} is="${tagBase}" attr="2"><h1>Hello World</h1><div class="tags"></div></${tagBase}>`);
    });

    it('should render element with observed attribute', () => {
        ReactDOM.render(<TestBaseComponent.React name="Alan" attr="2" />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<${tagBase} is="${tagBase}" attr="2" name="Alan"><h1>Hello Alan</h1><div class="tags"></div></${tagBase}>`);
    });

    it('should render element with property', () => {
        ReactDOM.render(<TestBaseComponent.React name="Alan" tags={['test']} />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<${tagBase} is="${tagBase}" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div></${tagBase}>`);
    });

    it('should render element with slotted text', () => {
        ReactDOM.render(<TestBaseComponent.React name="Alan" tags={['test']}>Test</TestBaseComponent.React>, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<${tagBase} is="${tagBase}" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div>Test</${tagBase}>`);
    });

    it('should render element with slotted element', () => {
        ReactDOM.render(<TestBaseComponent.React name="Alan" tags={['test']}>Test <strong>Test</strong></TestBaseComponent.React>, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal(`<${tagBase} is="${tagBase}" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div>Test <strong>Test</strong></${tagBase}>`);
    });
});
