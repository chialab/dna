import { register } from '../src/libs/dna.vdom.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestPlaceholder,
    Test2Placeholder,
} from './components/dna-vdom.js';

const Test1 = register('test1-vdom-template-component', TestComponent1);
const Test2 = register('test2-vdom-template-component', TestComponent2);
const Test3 = register('test3-vdom-template-component', TestComponent3);
const Test4 = register('test4-vdom-template-component', TestComponent4);
const Test5 = register('test5-vdom-template-component', TestComponent5);

register('test-vdom-placeholder', TestPlaceholder);
register('test2-vdom-placeholder', Test2Placeholder, {
    extends: 'figure',
});

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNATemplateComponent with virtualDom', () => {
    let elem1;
    let elem2;
    let elem3;
    let elem4;
    let elem5;
    before((done) => {
        elem1 = new Test1();
        elem2 = new Test2();
        elem3 = new Test3();
        elem4 = new Test4();
        elem5 = new Test5();
        document.body.appendChild(elem1);
        document.body.appendChild(elem2);
        document.body.appendChild(elem3);
        document.body.appendChild(elem4);
        document.body.appendChild(elem5);
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

    it('should handle invalid `template`', () => {
        assert.equal(elem3.innerHTML, '');
    });

    it('should handle templates with <svg>', () => {
        elem4.radius = 40;
        let svg = elem4.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });

    it('should handle sub components', () => {
        assert.equal(elem5.querySelector('test-vdom-placeholder').value, 6);
        assert.equal(elem5.querySelector('figure').value, 11);
    });
});
