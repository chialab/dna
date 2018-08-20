/* eslint-env mocha */

import { define, render } from '../../index.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
} from '../components/template.js';
import chai from 'chai';

const WRAPPER = document.body;

define('test1-template-component', TestComponent1);
define('test2-template-component', TestComponent2);
define('test3-template-component', TestComponent3);
define('test4-template-component', TestComponent4);

describe('Unit: TemplateComponent', () => {
    it('should handle `template` getter property as function with interpolation', () => {
        const elem = render(WRAPPER, TestComponent1);

        chai.assert.equal(elem.node.innerHTML, 'Hello, ');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        chai.assert.equal(elem.node.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        const elem = render(WRAPPER, TestComponent2);

        chai.assert.equal(elem.node.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle `template` getter property as number', () => {
        const elem = render(WRAPPER, TestComponent3);

        chai.assert.equal(elem.node.innerHTML, '4');
    });

    it('should handle templates with <svg>', () => {
        const elem = render(WRAPPER, TestComponent4);

        elem.radius = 40;
        let svg = elem.node.querySelector('svg');
        let circle = svg.querySelector('circle');
        chai.assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        chai.assert.equal(circle.getAttribute('r'), '40');
    });
});
