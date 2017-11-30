/* eslint-env mocha */

import { render, define, DOM } from '../../index.js';
import { TestBaseIDOMComponent } from '../components/base.js';
import Chai from 'chai';

const assert = Chai.assert;

const WRAPPER = document.body;
define('test-base-idom-component', TestBaseIDOMComponent);

describe('Unit: BaseComponent', () => {
    const elem = render(WRAPPER, TestBaseIDOMComponent, { lastName: 'Turing' });

    describe('> created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        DOM.setAttribute(elem, 'name', 'Alan');
        it('check if element is correctly trigger attributeChangedCallback', () => {
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});
