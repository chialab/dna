/* eslint-env mocha */

import { define, render } from '../src/dna-idom.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestPlaceholder,
    Test2Placeholder,
} from './components/template.js';
import { Wrapper } from './utils/wrapper.js';
import { debounce } from './utils/debounce.js';

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

describe('Unit: DNATemplateComponent', () => {
    it('should handle `template` getter property as function with interpolation', () => {
        render(WRAPPER, TestComponent1);
        const elem = WRAPPER.querySelector('test1-template-component');

        assert.equal(elem.innerHTML, 'Hello, ');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        assert.equal(elem.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        render(WRAPPER, TestComponent2);
        const elem = WRAPPER.querySelector('test2-template-component');

        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle templates with <svg>', () => {
        render(WRAPPER, TestComponent4);
        const elem = WRAPPER.querySelector('test4-template-component');

        elem.radius = 40;
        let svg = elem.firstElementChild;
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });

    describe('should handle sub components', () => {
        let elem;
        debounce(() => {
            render(WRAPPER, TestComponent5);
            elem = WRAPPER.querySelector('test5-template-component');
        });

        it('and their callbacks', () => {
            assert.equal(elem.querySelector('test-vdom-placeholder').value, 6);
            assert.equal(elem.querySelector('figure').value, 11);
        });
    });
});
