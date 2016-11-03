/* eslint-env mocha */

import { define, DOM } from '../index.js';
import { TestComponent } from './components/component.js';

const WRAPPER = document.body;
define('test-component', TestComponent);

describe('Unit: Component', () => {
    let elem = DOM.createElement(TestComponent);

    describe('> created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('> attached', () => {
        it('check if element is correctly attached to the tree', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe('> attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'test-callback', 'Alan');
            assert.equal(elem['test-callback'], 'Alan');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});
