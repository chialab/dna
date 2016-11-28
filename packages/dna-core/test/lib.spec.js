/* eslint-env mocha */

import {
    isFunction,
    isString,
    isObject,
    isUndefined,
    isArray,
    isFalsy,
} from '../src/core.js';

import {
    BaseComponent,
    render,
    define,
    DOM,
} from '../index.js';

const WRAPPER = document.body;

class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['age'];
    }

    constructor() {
        super();
        this.name = 'Alan';
        this.lastName = 'Turing';
        this.connectedTimes = 0;
        this.disconnectedTimes = 0;
        this.attributeChanges = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.connectedTimes++;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectedTimes++;
    }

    attributeChangedCallback(...args) {
        super.attributeChangedCallback(...args);
        this.attributeChanges++;
    }
}

class TestComponent2 extends TestComponent {}

define('test1-helper-component', TestComponent);
define('helper-define-component', TestComponent2, { extends: 'div' });

describe('Unit: lib', () => {
    describe('typeof', () => {
        it('should correctly check type of objects', () => {
            assert(isFunction(() => {}));
            assert(!isFunction({}));
            assert(isString(''));
            assert(!isString(4));
            assert(isObject({}));
            assert(!isObject([]));
            assert(isUndefined(undefined));
            assert(!isUndefined(null));
            assert(!isUndefined(false));
            assert(!isUndefined(''));
            assert(isArray([]));
            assert(!isArray({}));
            assert(!isArray(''));
            assert(isFalsy(undefined));
            assert(isFalsy(null));
            assert(isFalsy(false));
            assert(!isFalsy(''));
        });
    });

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
        it('should do nothing', () => {
            const tmp = document.createElement('div');
            assert(!DOM.bind(tmp));
            assert(!DOM.connect(tmp));
            assert(!DOM.disconnect(tmp));
        });
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
        it('should set attributes', () => {
            DOM.setAttribute(elem, 'age', 20);
            DOM.setAttribute(elem, 'married', '');
            assert.equal(elem.attributeChanges, 1);
            assert.equal(elem.getAttribute('age'), '20');
            assert.equal(elem.getAttribute('married'), '');
        });
        it('should remove attributes', () => {
            DOM.removeAttribute(elem, 'age');
            DOM.removeAttribute(elem, 'married');
            assert.equal(elem.attributeChanges, 2);
            assert.equal(elem.getAttribute('age'), null);
            assert.equal(elem.getAttribute('married'), null);
        });
    });
});
