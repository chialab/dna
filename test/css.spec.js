// eslint-disable-next-line import/no-unresolved
import * as DNA from '@chialab/dna';
import { expect } from '@chialab/ginsenghino';

describe('css', function () {
    this.timeout(10 * 1000);

    it('should convert :host selector', () => {
        const style = DNA.css('test-style', ':host { color: red; }');
        expect(style).to.be.equal('[:scope="test-style"] { color: red; }');
    });

    it('should convert :host selector with modifiers', () => {
        const style = DNA.css('test-style', ':host(.test) { color: red; }');
        expect(style).to.be.equal('[:scope="test-style"].test { color: red; }');
    });

    it('should scope a selector', () => {
        const style = DNA.css('test-style', '.test { color: red; }');
        expect(style).to.be.equal('[:scope="test-style"] .test { color: red; }');
    });

    it('should scope a selector inside a media query', () => {
        const style = DNA.css('test-style', '@media (min-width: 640px) { .test { color: red; } }');
        expect(style).to.be.equal('@media (min-width: 640px) { [:scope="test-style"] .test { color: red; } }');
    });

    it('should convert a more complex CSS #1', () => {
        const style = DNA.css(
            'test-style',
            `@charset "UTF-8";

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
}`
        );
        expect(style).to.be.equal(`@charset "UTF-8";
[:scope="test-style"] {
    color: #5F9EA0;
}
[:scope="test-style"] > * {
    background-color: #5F9EA0;
}
[:scope="test-style"].test {
    color: #5F9EA0;
}
[:scope="test-style"].test > * {
    background-color: #5F9EA0;
}
[:scope="test-style"] h3 {
    color: blue;
}
[:scope="test-style"] #before1:before {
    content: "Hello";
}
[:scope="test-style"] #before2:before {
    content: attr(id);
}
[:scope="test-style"] #before3:before {
    content: "Hello world";
}
[:scope="test-style"] #before4:before {
    content: "attr(id)";
}
[:scope="test-style"] #before5:before {
    content: "♜";
}
[:scope="test-style"] #before6:before {
    content: "hello-world";
}
@media (min-width: 0) {
    [:scope="test-style"] h1,[:scope="test-style"] h2 {
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

    // describe.skip('adoptedStyleSheets', () => {
    //     it('should handle style in adoptedStyleSheets', () => {
    //         //
    //     });

    //     it('should handle multiple styles in adoptedStyleSheets', () => {
    //         //
    //     });
    // });
});
