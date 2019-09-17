/* eslint-env mocha */

import { define, DOM } from '../../index.js';
import { TestBaseComponent } from '../components/base.js';
import chai from 'chai/chai.js';

DOM.lifeCycle(true);

const WRAPPER = document.body;

class TestBaseComponent1 extends TestBaseComponent { }
class TestBaseComponent2 extends TestBaseComponent { }
class TestBaseComponent3 extends TestBaseComponent { }

define('test-base-component', TestBaseComponent1);
define('test-base-component-2', TestBaseComponent2, {
    extends: 'button',
});

describe('Unit: BaseComponent without definition', () => {
    describe('> constructor', () => {
        it('should throw', () => {
            chai.assert.throws(() => new TestBaseComponent3(), 'Component has not been defined');
        });
    });
});

describe('Unit: BaseComponent', () => {
    let elem;
    before(() => {
        elem = new TestBaseComponent1();
        elem.lastName = 'Turing';
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            chai.assert.equal(elem.node.tagName.toLowerCase(), 'test-base-component');
        });

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
            DOM.setAttribute(elem, 'name', 'Alan');
            chai.assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            chai.assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            chai.assert.equal(elem.attached, false);
        });
    });
});

describe('Unit: BaseComponent with native element', () => {
    let elem;
    before(() => {
        elem = new TestBaseComponent2();
        elem.lastName = 'Turing';
    });

    describe('> created', () => {
        it('check if element has the correct tag', () => {
            chai.assert.equal(elem.node.tagName.toLowerCase(), 'button');
            chai.assert.equal(elem.node.getAttribute('is').toLowerCase(), 'test-base-component-2');
        });

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
            DOM.setAttribute(elem, 'name', 'Alan');
            chai.assert.equal(elem.name, 'Alan');
        });
    });

    describe('> render', () => {
        it('check if element has been correctly rendered', () => {
            chai.assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe('> detached', () => {
        it('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            chai.assert.equal(elem.attached, false);
        });
    });
});