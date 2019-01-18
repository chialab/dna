/* eslint-env mocha */

import { define, DOM } from '../../index.js';
import { TestComponent } from '../components/component.js';
import chai from 'chai/chai.js';

DOM.lifeCycle(true);

const WRAPPER = document.body;
define('test-component', TestComponent);

describe('Unit: Component', () => {
    let elem;
    before(() => {
        elem = new TestComponent();
    });

    describe('> created', () => {
        it('check if element is correctly instantiated', () => {
            chai.assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            DOM.appendChild(WRAPPER, elem);
            chai.assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'test-callback', 'Alan');
            chai.assert.equal(elem['test-callback'], 'Alan');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            chai.assert.equal(elem.attached, false);
        });
    });
});
