/* eslint-env mocha */

import { BaseComponent, render, define, DOM } from '../index.js';

const WRAPPER = document.body;

class TestComponent extends BaseComponent {
    constructor() {
        super();
        this.name = 'Alan';
        this.lastName = 'Turing';
        this.connectedTimes = 0;
        this.disconnectedTimes = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.connectedTimes++;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectedTimes++;
    }
}

class TestComponent2 extends TestComponent {}

define('test1-helper-component', TestComponent);
define('helper-define-component', TestComponent2, { extends: 'div' });

describe('Unit: lib', () => {
    describe('define', () => {
        describe('a simple element', () => {
            it('should define a custom element', () => {
                const elem = new TestComponent();
                assert.equal(elem.tagName.toLowerCase(), 'test1-helper-component');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });

        describe('an element with extends field', () => {
            it('a custom element with extends field', () => {
                const elem = render(WRAPPER, TestComponent2);
                assert.equal(elem.localName.toLowerCase(), 'div');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });
    });

    describe('DOM helpers', () => {
        const elem = document.createElement('test1-helper-component');
        const elem2 = render(WRAPPER, TestComponent2);
        it('should create a component instance', () => {
            DOM.bind(elem);
            assert.equal(elem.tagName.toLowerCase(), 'test1-helper-component');
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
        });
        it('should append a component', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.parentNode, WRAPPER);
            assert.equal(elem.disconnectedTimes, 0);
            assert.equal(elem.connectedTimes, 1);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });
        it('should append a component before another', () => {
            DOM.insertBefore(WRAPPER, elem, elem2);
            assert.equal(elem.parentNode, WRAPPER);
            assert.equal(elem2.parentNode, WRAPPER);
            assert.equal(elem.nextSibling, elem2);
            assert.equal(elem.disconnectedTimes, 1);
            assert.equal(elem.connectedTimes, 2);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });
        it('should do nothing if already before another', () => {
            DOM.insertBefore(WRAPPER, elem, elem2);
            assert.equal(elem.parentNode, WRAPPER);
            assert.equal(elem2.parentNode, WRAPPER);
            assert.equal(elem.nextSibling, elem2);
            assert.equal(elem.disconnectedTimes, 1);
            assert.equal(elem.connectedTimes, 2);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });
        it('should append again a component', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.parentNode, WRAPPER);
            assert.equal(elem.disconnectedTimes, 2);
            assert.equal(elem.connectedTimes, 3);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });
        it('should do nothing if already last child of parent', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.parentNode, WRAPPER);
            assert.equal(elem.disconnectedTimes, 2);
            assert.equal(elem.connectedTimes, 3);
            assert.equal(elem2.disconnectedTimes, 0);
            assert.equal(elem2.connectedTimes, 1);
        });
        it('should replace a child', () => {
            DOM.replaceChild(WRAPPER, elem, elem2);
            assert.equal(elem.parentNode, WRAPPER);
            assert.equal(elem.disconnectedTimes, 3);
            assert.equal(elem.connectedTimes, 4);
            assert.equal(elem2.disconnectedTimes, 1);
            assert.equal(elem2.connectedTimes, 1);
        });
    });
});
