/* eslint-env mocha */
import { define, render, DOM, IDOM } from '../../index.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestPlaceholder,
    Test2Placeholder,
} from '../components/template.js';
import chai from 'chai/chai.js';

// eslint-disable-next-line
const h = IDOM.h;

const WRAPPER = document.body;
self.IDOM = IDOM;

define('test1-idom-template-component', TestComponent1);
define('test2-idom-template-component', TestComponent2);
define('test3-idom-template-component', TestComponent3);
define('test4-idom-template-component', TestComponent4);
define('test5-idom-template-component', TestComponent5);
define('test-idom-placeholder', TestPlaceholder);
define('test2-idom-placeholder', Test2Placeholder, {
    extends: 'figure',
});

describe('Unit: IDOMTemplateComponent', () => {
    it('should handle `template` with IDOM calls', () => {
        const elem = render(WRAPPER, TestComponent1);

        chai.assert.equal(elem.node.innerHTML, '<span>Hello, </span>');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        elem.title = 'Title';
        chai.assert.equal(elem.node.innerHTML, '<h1>Title</h1><br><span>Hello, Alan Turing</span>');
    });

    it('should handle `template` with JSX IDOM calls', () => {
        const elem = render(WRAPPER, TestComponent2);

        chai.assert.equal(elem.node.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle templates with <svg>', () => {
        const elem = render(WRAPPER, TestComponent4);

        elem.radius = 40;

        let svg = elem.node.firstElementChild;
        let circle = svg.querySelector('circle');
        chai.assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        chai.assert.equal(circle.getAttribute('r'), '40');
    });

    describe('should handle sub components', () => {
        const elem = render(WRAPPER, TestComponent5);

        it('and their callbacks', () => {
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            const testElement2 = elem.node.querySelector('figure');
            chai.assert.equal(DOM.getNodeComponent(testElement1).value, 6);
            chai.assert.equal(DOM.getNodeComponent(testElement2).value, 11);
        });

        it('and their life cycle (connected)', () => {
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            chai.assert.equal(DOM.getNodeComponent(testElement1).attached, true);
        });

        it('and their life cycle (disconnected)', () => {
            DOM.removeChild(WRAPPER, elem);
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            chai.assert.equal(DOM.getNodeComponent(testElement1).attached, false);
        });

        it('and their life cycle (riconnected)', () => {
            DOM.appendChild(WRAPPER, elem);
            const testElement1 = elem.node.querySelector('test-idom-placeholder');
            chai.assert.equal(DOM.getNodeComponent(testElement1).attached, true);
        });
    });
});
