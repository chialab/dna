import { register } from '../src/plugins/dna.vdom-elements.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestComponent6,
    TestComponent7,
} from './components/dna-template.js';

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
    let elem1;
    let elem2;
    let elem3;
    let elem4;
    let elem5;
    let elem6;
    let elem7;
    before((done) => {
        elem1 = new Test1();
        elem2 = new Test2();
        elem3 = new Test3();
        if (hasTemplate) {
            elem4 = new Test4();
            elem5 = new Test5();
        }
        elem6 = new Test6();
        elem7 = new Test7();
        document.body.appendChild(elem1);
        document.body.appendChild(elem2);
        document.body.appendChild(elem3);
        if (hasTemplate) {
            document.body.appendChild(elem4);
            document.body.appendChild(elem5);
        }
        document.body.appendChild(elem6);
        document.body.appendChild(elem7);
        setTimeout(() => {
            done();
        }, 250);
    });

    it('should handle `template` getter property as function with interpolation', () => {
        assert.equal(elem1.innerHTML, 'Hello, ');
        elem1.name = 'Alan';
        elem1.lastName = 'Turing';
        elem1.title = 'Title';
        assert.equal(elem1.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        assert.equal(elem2.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle `template` property as string', () => {
        assert.equal(elem3.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    if (hasTemplate) {
        it('should handle `template` property as HTMLTemplateElement', () => {
            assert.equal(elem4.innerHTML, '<span class="dna-test">Hello DNA!</span>');
        });

        it('should handle `template` property as HTMLTemplateElement with multiple nodes', () => {
            assert.equal(
                elem5.innerHTML,
                '<span class="dna-test">Hello DNA!</span><span>Hello World!</span>'
            );
        });
    }

    it('should handle invalid `template`', () => {
        assert.equal(elem6.innerHTML, '');
    });

    it('should handle templates with <svg>', () => {
        elem7.radius = 40;
        let svg = elem7.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });
});
