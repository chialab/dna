/* eslint-env mocha */
import { getModule } from './helpers.js';

let DNA;

describe('css', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    it('should convert :host selector', () => {
        const style = DNA.css('test-style', ':host { color: red; }');
        expect(style).to.be.equal('[is="test-style"] { color: red; }');
    });

    it('should convert :host selector with modifiers', () => {
        const style = DNA.css('test-style', ':host(.test) { color: red; }');
        expect(style).to.be.equal('[is="test-style"].test { color: red; }');
    });

    it('should scope a selector', () => {
        const style = DNA.css('test-style', '.test { color: red; }');
        expect(style).to.be.equal('[is="test-style"] .test { color: red; }');
    });

    it('should scope a selector inside a media query', () => {
        const style = DNA.css('test-style', '@media (min-width: 640px) { .test { color: red; } }');
        expect(style).to.be.equal('@media (min-width: 640px) { [is="test-style"] .test { color: red; } }');
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
[is="test-style"] {
    color: #5F9EA0;
}
[is="test-style"] > * {
    background-color: #5F9EA0;
}
[is="test-style"].test {
    color: #5F9EA0;
}
[is="test-style"].test > * {
    background-color: #5F9EA0;
}
[is="test-style"] h3 {
    color: blue;
}
[is="test-style"] #before1:before {
    content: "Hello";
}
[is="test-style"] #before2:before {
    content: attr(id);
}
[is="test-style"] #before3:before {
    content: "Hello world";
}
[is="test-style"] #before4:before {
    content: "attr(id)";
}
[is="test-style"] #before5:before {
    content: "♜";
}
[is="test-style"] #before6:before {
    content: "hello-world";
}
@media (min-width: 0) {
    [is="test-style"] h1,[is="test-style"] h2 {
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
        }).to.throw(TypeError, 'The provided name is not a string');

        expect(() => {
            DNA.css('test-style', null);
        }).to.throw(TypeError, 'The provided CSS text is not a string');
    });
});
