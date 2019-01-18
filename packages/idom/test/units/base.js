/* eslint-env mocha */

import { render, define, DOM } from '../../index.js';
import { TestBaseIDOMComponent } from '../components/base.js';
import chai from 'chai/chai.js';

DOM.lifeCycle(true);

const WRAPPER = document.body;

class TestBaseIDOMComponent2 extends TestBaseIDOMComponent { }

define('test-base-idom-component', TestBaseIDOMComponent);
define('test-base-idom-component-2', TestBaseIDOMComponent2, {
    extends: 'button',
});

describe('Unit: Base IDOM Component', () => {
    let elem;
    before(() => {
        elem = render(WRAPPER, TestBaseIDOMComponent, { lastName: 'Turing', age: 42 });
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            chai.assert.equal(elem.node.tagName.toLowerCase(), 'test-base-idom-component');
        });

        it('check if element is correctly instantiated', () => {
            chai.assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            chai.assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            chai.assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            chai.assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing 42');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            chai.assert.equal(elem.attached, false);
        });
    });
});

describe('Unit: Base IDOM Component with native element', () => {
    let elem;
    before(() => {
        elem = render(WRAPPER, TestBaseIDOMComponent2, { lastName: 'Turing', age: 42 });
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            chai.assert.equal(elem.node.tagName.toLowerCase(), 'button');
            chai.assert.equal(elem.node.getAttribute('is'), 'test-base-idom-component-2');
        });

        it('check if element is correctly instantiated', () => {
            chai.assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            chai.assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            chai.assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            chai.assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing 42');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            chai.assert.equal(elem.attached, false);
        });
    });
});
