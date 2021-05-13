import './helpers.spec.js';
import * as DNA from '@chialab/dna';
import { expect } from '@esm-bundle/chai/esm/chai.js';

describe('css', function() {
    this.timeout(10 * 1000);

    it('should convert :host selector', () => {
        const style = DNA.css('test-style', ':host { color: red; }');
        expect(style).to.be.equal('test-style { color: red; }');
    });

    it('should convert :host selector with modifiers', () => {
        const style = DNA.css('test-style', ':host(.test) { color: red; }');
        expect(style).to.be.equal('test-style.test { color: red; }');
    });

    it('should scope a selector', () => {
        const style = DNA.css('test-style', '.test { color: red; }');
        expect(style).to.be.equal('test-style .test { color: red; }');
    });

    it('should scope a selector inside a media query', () => {
        const style = DNA.css('test-style', '@media (min-width: 640px) { .test { color: red; } }');
        expect(style).to.be.equal('@media (min-width: 640px) { test-style .test { color: red; } }');
    });

    it('should convert a more complex CSS #1', () => {
        const style = DNA.css('test-style', `@charset "UTF-8";

/**
 * This is a comment
 */
:host {
    color: #5F9EA0;
}
:host > * {
    background-color: #5F9EA0;
}
:host(.test) {
    color: #5F9EA0;
}
:host(.test) > * {
    background-color: #5F9EA0;
}
h3 {
    color: blue;
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
test-style {
    color: #5F9EA0;
}
test-style > * {
    background-color: #5F9EA0;
}
test-style.test {
    color: #5F9EA0;
}
test-style.test > * {
    background-color: #5F9EA0;
}
test-style h3 {
    color: blue;
}
test-style #before1:before {
    content: "Hello";
}
test-style #before2:before {
    content: attr(id);
}
test-style #before3:before {
    content: "Hello world";
}
test-style #before4:before {
    content: "attr(id)";
}
test-style #before5:before {
    content: "♜";
}
test-style #before6:before {
    content: "hello-world";
}
@media (min-width: 0) {
    test-style h1,test-style h2 {
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

    describe.skip('adoptedStyleSheets', () => {
        it('should handle style in adoptedStyleSheets', () => {
            //
        });

        it('should handle multiple styles in adoptedStyleSheets', () => {
            //
        });
    });
});

