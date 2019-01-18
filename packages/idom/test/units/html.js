/* eslint-env mocha */

import { render, define, DOM } from '../../index.js';
import { TestBaseHTMLComponent } from '../components/html.js';
import chai from 'chai/chai.js';

DOM.lifeCycle(true);

const WRAPPER = document.body;

define('test-base-html-component', TestBaseHTMLComponent);

describe('Unit: Base HTML Component', () => {
    describe('> inject simple content', () => {
        let elem;
        before(() => {
            elem = render(WRAPPER, TestBaseHTMLComponent, { content: 'Hello' });
        });

        it('check if element has the correct content', () => {
            chai.assert.equal(elem.node.innerHTML, '<p>Hello</p>');
        });
    });

    describe('> inject complex content', () => {
        let elem;
        before(() => {
            elem = render(WRAPPER, TestBaseHTMLComponent, { content: 'Hello <strong>world!</strong>' });
        });

        it('check if element has the correct content', () => {
            chai.assert.equal(elem.node.innerHTML, '<p>Hello <strong>world!</strong></p>');
        });

        it('check if element has all children', () => {
            chai.expect(elem.node.querySelector('strong')).to.exist;
        });
    });
});
