/* eslint-env mocha */

import ReactDOM from 'react-dom';
import { render, define, DOM } from '../../index.js';
import { ReactTestComponent } from '../components/base.js';

const WRAPPER = document.createElement('div');
document.body.appendChild(WRAPPER);
define('test-base-component', ReactTestComponent);

describe('Unit: BaseComponent', () => {
    const elem = render(WRAPPER, ReactTestComponent, { lastName: 'Turing' });

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
            ReactDOM.unmountComponentAtNode(WRAPPER);
            assert.equal(elem.attached, false);
        });
    });
});
