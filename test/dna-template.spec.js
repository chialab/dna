import * as Config from '../src/dna-config.next.js';
import { register } from '../src/plugins/dna.webcomponents.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestComponent6,
    TestComponent7,
} from './dna-template.next.js';

Config.useVirtualDOM = false;

const Test1 = register('test1-template-component', {
    prototype: TestComponent1,
});

const Test2 = register('test2-template-component', {
    prototype: TestComponent2,
});

const Test3 = register('test3-template-component', {
    prototype: TestComponent3,
});

const Test4 = register('test4-template-component', {
    prototype: TestComponent4,
});

const Test5 = register('test5-template-component', {
    prototype: TestComponent5,
});

const Test6 = register('test6-template-component', {
    prototype: TestComponent6,
});

const Test7 = register('test7-template-component', {
    prototype: TestComponent7,
});

const hasTemplate = (typeof document.importNode === 'function' &&
    typeof HTMLTemplateElement !== 'undefined');

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNATemplateComponent', () => {
    beforeEach((done) => {
        Config.useVirtualDOM = false;
        done();
    });

    it('should handle `template` getter property as function with interpolation', () => {
        let elem = new Test1();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, 'Hello, ');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        assert.equal(elem.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        let elem = new Test2();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle `template` property as string', () => {
        let elem = new Test3();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    if (hasTemplate) {
        it('should handle `template` property as HTMLTemplateElement', () => {
            let elem = new Test4();
            document.body.appendChild(elem);
            assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
        });

        it('should handle `template` property as HTMLTemplateElement with multiple nodes', () => {
            let elem = new Test5();
            document.body.appendChild(elem);
            assert.equal(
                elem.innerHTML,
                '<span class="dna-test">Hello DNA!</span><span>Hello World!</span>'
            );
        });
    }

    it('should handle invalid `template`', () => {
        let elem = new Test6();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '');
    });

    it('should handle templates with <svg>', () => {
        let elem = new Test7();
        document.body.appendChild(elem);
        elem.radius = 40;
        let svg = elem.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });
});
