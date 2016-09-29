import { register } from '../src/dna.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
} from './components/dna-template.js';

const Test1 = register('test1-template-component', TestComponent1);
const Test2 = register('test2-template-component', TestComponent2);
const Test3 = register('test3-template-component', TestComponent3);
const Test4 = register('test4-template-component', TestComponent4);

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNATemplateComponent', () => {
    let elem1;
    let elem2;
    let elem4;
    before((done) => {
        elem1 = new Test1();
        elem2 = new Test2();
        elem4 = new Test4();
        document.body.appendChild(elem1);
        document.body.appendChild(elem2);
        document.body.appendChild(elem4);
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
        assert.throws(() => new Test3());
    });

    it('should handle templates with <svg>', () => {
        elem4.radius = 40;
        let svg = elem4.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });
});
