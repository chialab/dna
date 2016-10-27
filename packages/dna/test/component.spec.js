/* eslint-env mocha */

import { define, createElement, appendChild, setAttribute, removeChild } from '../index.js';
import { TestComponent } from './components/component.js';

const WRAPPER = document.body;
define('test-component', TestComponent);

describe('Unit: Component', () => {
    let elem = createElement(TestComponent);

    describe('> created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            appendChild(WRAPPER, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            setAttribute(elem, 'test-callback', 'Alan');
            assert.equal(elem['test-callback'], 'Alan');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});
