import { Config, register } from '../src/plugins/dna.vdom.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestComponent6,
    TestComponent7,
    TestComponent8,
    TestPlaceholder,
} from './components/dna-vdom.js';

const Test1 = register('test1-vdom-template-component', {
    prototype: TestComponent1,
});

const Test2 = register('test2-vdom-template-component', {
    prototype: TestComponent2,
});

const Test3 = register('test3-vdom-template-component', {
    prototype: TestComponent3,
});

const Test4 = register('test4-vdom-template-component', {
    prototype: TestComponent4,
});

const Test5 = register('test5-vdom-template-component', {
    prototype: TestComponent5,
});

const Test6 = register('test6-vdom-template-component', {
    prototype: TestComponent6,
});

const Test7 = register('test7-vdom-template-component', {
    prototype: TestComponent7,
});

const Test8 = register('test8-vdom-template-component', {
    prototype: TestComponent8,
});

register('test-vdom-placeholder', {
    prototype: TestPlaceholder,
});

const hasTemplate = (typeof document.importNode === 'function' &&
    typeof HTMLTemplateElement !== 'undefined');

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNATemplateComponent with virtualDom', () => {
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

    it('should handle sub components', () => {
        let elem = new Test8();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span><test-vdom-placeholder value="6"></test-vdom-placeholder>');
    });
});
