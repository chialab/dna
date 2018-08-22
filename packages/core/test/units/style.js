/* eslint-env mocha */

import { define, render } from '../../index.js';
import { TestComponent1, TestComponent2, TestComponent3 } from '../components/style.js';
import chai from 'chai';

const WRAPPER = document.body;

define('test1-style-component', TestComponent1);
define('test2-style-component', TestComponent2, {
    extends: 'div',
});
define('test3-style-component', TestComponent3);

function normalizeContent(content) {
    return content.replace(/^("|')/, '').replace(/("|')$/, '');
}

describe('Unit: StyleComponent', () => {
    const elem1 = render(WRAPPER, TestComponent1);
    const elem2 = render(WRAPPER, TestComponent2);
    const elem3 = render(WRAPPER, TestComponent3);

    it('should handle `css` getter property', () => {
        let style = window.getComputedStyle((elem1.node.shadowRoot || elem1.node).querySelector('h1'));
        chai.assert.equal(style.color, 'rgb(95, 158, 160)');
        chai.assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property with state', () => {
        let style = window.getComputedStyle((elem2.node.shadowRoot || elem2.node).querySelector('h1'));
        chai.assert.equal(style.color, 'rgb(95, 158, 160)');
        chai.assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
    });

    it('should handle `css` with content getter property', () => {
        let root = elem3.node.shadowRoot || elem3.node;
        let before1 = window.getComputedStyle(root.querySelector('#before1'), ':before');
        let before2 = window.getComputedStyle(root.querySelector('#before2'), ':before');
        let before3 = window.getComputedStyle(root.querySelector('#before3'), ':before');
        let before4 = window.getComputedStyle(root.querySelector('#before4'), ':before');
        let before5 = window.getComputedStyle(root.querySelector('#before5'), ':before');
        let before6 = window.getComputedStyle(root.querySelector('#before6'), ':before');
        chai.assert.equal(normalizeContent(before1.content), 'Hello');
        chai.assert.oneOf(normalizeContent(before2.content), ['before2', 'attr(id)']);
        chai.assert.equal(normalizeContent(before3.content), 'Hello world');
        chai.assert.equal(normalizeContent(before4.content), 'attr(id)');
        chai.assert.equal(normalizeContent(before5.content), '♜');
        chai.assert.equal(normalizeContent(before6.content), 'hello-world');
    });
});
