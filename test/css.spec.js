import './helpers';
import * as DNA from '@chialab/dna';
import { getComponentName } from './helpers';

describe('css', function() {
    this.timeout(10 * 1000);

    it('should convert :host selector', () => {
        let style = DNA.css('test-style', ':host { color: red; }');
        expect(style).to.be.equal('[\\:host=\'test-style\'] { color: red; }');
    });

    it('should convert :host selector with modifiers', () => {
        let style = DNA.css('test-style', ':host(.test) { color: red; }');
        expect(style).to.be.equal('[\\:host=\'test-style\'].test { color: red; }');
    });

    it('should scope a selector', () => {
        let style = DNA.css('test-style', '.test { color: red; }');
        expect(style).to.be.equal('.test[\\:scope=\'test-style\'] { color: red; }');
    });

    it('should scope a selector inside a media query', () => {
        let style = DNA.css('test-style', '@media (min-width: 640px) { .test { color: red; } }');
        expect(style).to.be.equal('@media (min-width: 640px) { .test[\\:scope=\'test-style\'] { color: red; } }');
    });

    it('should convert a more complex CSS #1', () => {
        let style = DNA.css('test-style', `@charset "UTF-8";

/**
 * This is a comment
 */
:host {
    color: #5F9EA0;
}
* {
    background-color: #5F9EA0;
}
:host(.test) {
    color: #5F9EA0;
}
h3 {
    color: blue;
}
h3 + h4 {
    color: red;
}
#before1:before {
    content: "Hello";
}
#before2:before {
    content: attr(id);
}
#before3:before {
    content: "Hello world";
}
#before4:before {
    content: "attr(id)";
}
#before5:before {
    content: "♜";
}
#before6:before {
    content: "hello-world";
}
@media (min-width: 0) {
    h1, h2 {
        color: inherit;
    }
}

/*
        /* strip */
  /*
        */

@keyframes anim {
    0% { top: 0; }
    100% { top: 10px; }
}`);
        expect(style).to.be.equal(`@charset "UTF-8";
[\\:host='test-style'] {
    color: #5F9EA0;
}
*[\\:scope='test-style'] {
    background-color: #5F9EA0;
}
[\\:host='test-style'].test {
    color: #5F9EA0;
}
h3[\\:scope='test-style'] {
    color: blue;
}
h3[\\:scope='test-style'] + h4[\\:scope='test-style'] {
    color: red;
}
#before1[\\:scope='test-style']:before {
    content: "Hello";
}
#before2[\\:scope='test-style']:before {
    content: attr(id);
}
#before3[\\:scope='test-style']:before {
    content: "Hello world";
}
#before4[\\:scope='test-style']:before {
    content: "attr(id)";
}
#before5[\\:scope='test-style']:before {
    content: "♜";
}
#before6[\\:scope='test-style']:before {
    content: "hello-world";
}
@media (min-width: 0) {
    h1[\\:scope='test-style'],h2[\\:scope='test-style'] {
        color: inherit;
    }
}

@keyframes anim {
    0% { top: 0; }
    100% { top: 10px; }
}`);
    });

    it('should cache the result', () => {
        DNA.css('test-style', ':host { color: red; }');
        DNA.css('test-style', ':host { color: red; }');
        // checkout the code coverage
    });

    it('should validate css input', () => {
        expect(() => {
            DNA.css(null, null);
        }).to.throw(TypeError, 'The provided name must be a string');

        expect(() => {
            DNA.css('test-style', null);
        }).to.throw(TypeError, 'The provided CSS text must be a string');
    });

    describe('adoptedStyleSheets', () => {
        it('should handle styles in adoptedStyleSheets', async () => {
            if (typeof window === 'undefined') {
                return;
            }

            let wrapper = DNA.DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);
            await import('construct-style-sheets-polyfill');
            let CSSStyleSheet = window.CSSStyleSheet;

            let style = new CSSStyleSheet();
            style.replaceSync(':host { color: red; }');

            class TestElement extends DNA.Component {
                static adoptedStyleSheets = [style];
            }
            DNA.customElements.define(getComponentName(), TestElement);

            let element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(DNA.window.getComputedStyle(element).color).to.be.oneOf(['rgb(255, 0, 0)', 'red']);
        });
    });
});

