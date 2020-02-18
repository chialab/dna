import { render, define, DOM, IDOM, trust, BaseComponent } from  '../../dist/adapters/compat/dna.js';

// eslint-disable-next-line
const h = IDOM.h;
const WRAPPER = document.body;

class TestBaseHTMLComponent extends BaseComponent {
    get properties() {
        return {
            content: String,
        };
    }

    get template() {
        return () => <p>{trust(this.content)}</p>;
    }
}

define('test-base-html-component', TestBaseHTMLComponent);

DOM.lifeCycle(true);

describe.skip('[Compat] Base HTML Component', () => {
    describe('> inject simple content', () => {
        let elem;
        before(() => {
            elem = render(WRAPPER, TestBaseHTMLComponent, { content: 'Hello' });
        });

        it('check if element has the correct content', () => {
            assert.equal(elem.node.innerHTML, '<p>Hello</p>');
        });
    });

    describe('> inject complex content', () => {
        let elem;
        before(() => {
            elem = render(WRAPPER, TestBaseHTMLComponent, { content: 'Hello <strong>world!</strong>' });
        });

        it('check if element has the correct content', () => {
            assert.equal(elem.node.innerHTML, '<p>Hello <strong>world!</strong></p>');
        });

        it('check if element has all children', () => {
            expect(elem.node.querySelector('strong')).to.exist;
        });
    });
});
