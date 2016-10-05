import { define } from '../src/dna.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestPlaceholder,
    Test2Placeholder,
} from './components/dna-template.js';
import { Template } from 'skin-template/src/template.js';
import { Wrapper } from './utils/wrapper.js';

const WRAPPER = new Wrapper();

define('test1-template-component', TestComponent1);
define('test2-template-component', TestComponent2);
define('test3-template-component', TestComponent3);
define('test4-template-component', TestComponent4);
define('test5-template-component', TestComponent5);
define('test-vdom-placeholder', TestPlaceholder);
define('test2-vdom-placeholder', Test2Placeholder, {
    extends: 'figure',
});

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNATemplateComponent', () => {
    it('should handle `template` getter property as function with interpolation', () => {
        let template = new Template((t) => t`
            <test1-template-component></<test1-template-component>
        `);
        template.render(WRAPPER);
        let elem = WRAPPER.querySelector('.test1-template-component');
        assert.equal(elem.innerHTML, 'Hello, ');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        assert.equal(elem.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        let template = new Template((t) => t`
            <test2-template-component></<test2-template-component>
        `);
        template.render(WRAPPER);
        let elem = WRAPPER.querySelector('.test2-template-component');
        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle invalid `template`', () => {
        let template = new Template((t) => t`
            <test3-template-component></<test3-template-component>
        `);
        assert.throws(() => template.render(WRAPPER));
    });

    it('should handle templates with <svg>', () => {
        let template = new Template((t) => t`
            <test4-template-component></<test4-template-component>
        `);
        template.render(WRAPPER);
        let elem = WRAPPER.querySelector('.test4-template-component');
        elem.radius = 40;
        let svg = elem.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });

    it('should handle sub components', () => {
        let template = new Template((t) => t`
            <test5-template-component></<test5-template-component>
        `);
        template.render(WRAPPER);
        let elem = WRAPPER.querySelector('.test5-template-component');
        assert.equal(elem.querySelector('test-vdom-placeholder').value, 6);
        assert.equal(elem.querySelector('figure').value, 11);
    });
});
