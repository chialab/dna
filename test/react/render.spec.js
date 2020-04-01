import { Component, html as _html, define, DOM } from '@chialab/dna/react.js';
import ReactDOM from 'react-dom';

describe('[React] render', () => {
    let wrapper, TestComponent, tag = 'test-react-element';

    before(() => {
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);

        TestComponent = class TestComponent extends Component {
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

        define(tag, TestComponent);
    });

    it('should render simple element', () => {
        ReactDOM.render(<TestComponent.React />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal('<test-react-element is="test-react-element"><h1>Hello World</h1><div class="tags"></div></test-react-element>');
    });

    it('should render element with attribute', () => {
        ReactDOM.render(<TestComponent.React attr="2" />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal('<test-react-element is="test-react-element" attr="2"><h1>Hello World</h1><div class="tags"></div></test-react-element>');
    });

    it('should render element with observed attribute', () => {
        ReactDOM.render(<TestComponent.React name="Alan" attr="2" />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal('<test-react-element is="test-react-element" attr="2" name="Alan"><h1>Hello Alan</h1><div class="tags"></div></test-react-element>');
    });

    it('should render element with property', () => {
        ReactDOM.render(<TestComponent.React name="Alan" tags={['test']} />, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal('<test-react-element is="test-react-element" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div></test-react-element>');
    });

    it('should render element with slotted text', () => {
        ReactDOM.render(<TestComponent.React name="Alan" tags={['test']}>Test</TestComponent.React>, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal('<test-react-element is="test-react-element" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div>Test</test-react-element>');
    });

    it('should render element with slotted element', () => {
        ReactDOM.render(<TestComponent.React name="Alan" tags={['test']}>Test <strong>Test</strong></TestComponent.React>, wrapper);
        let elem = wrapper.children[0];
        expect(elem.outerHTML).to.be.equal('<test-react-element is="test-react-element" name="Alan"><h1>Hello Alan</h1><div class="tags">test</div>Test <strong>Test</strong></test-react-element>');
    });
});
