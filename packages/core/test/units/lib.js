/* eslint-env mocha */

import DOM from '../../src/lib/dom.js';
import { render } from '../../src/lib/render.js';
import { define } from '../../src/lib/define.js';
import { bootstrap } from '../../src/lib/bootstrap.js';
import { BaseComponent } from '../../index.js';
import chai from 'chai/chai.js';

const WRAPPER = document.body;

class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['age'];
    }

    constructor(node) {
        super(node);
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
    describe('define', () => {
        describe('a simple element', () => {
            it('should define a custom element', () => {
                const elem = new TestComponent();
                chai.assert.equal(elem.node.tagName.toLowerCase(), 'test1-helper-component');
                chai.assert.equal(elem.name, 'Alan');
                chai.assert.equal(elem.lastName, 'Turing');
            });
        });

        describe('an element with extends field', () => {
            it('a custom element with extends field', () => {
                const elem = render(WRAPPER, TestComponent2);
                chai.assert.equal(elem.node.localName.toLowerCase(), 'div');
                chai.assert.equal(elem.name, 'Alan');
                chai.assert.equal(elem.lastName, 'Turing');
            });
        });
    });

    describe('DOM helpers', () => {
        const elem = new TestComponent();
        const elem2 = render(WRAPPER, TestComponent2);
        it('should do nothing', () => {
            const tmp = document.createElement('div');
            chai.assert(!DOM.connect(tmp));
            chai.assert(!DOM.disconnect(tmp));
        });
        it('should create a component instance', () => {
            chai.assert.equal(elem.node.tagName.toLowerCase(), 'test1-helper-component');
            chai.assert.equal(elem.name, 'Alan');
            chai.assert.equal(elem.lastName, 'Turing');
        });
        it('should append a component', () => {
            DOM.appendChild(WRAPPER, elem);
            chai.assert.equal(elem.node.parentNode, WRAPPER);
            chai.assert.equal(elem.disconnectedTimes, 0);
            chai.assert.equal(elem.connectedTimes, 1);
            chai.assert.equal(elem2.disconnectedTimes, 0);
            chai.assert.equal(elem2.connectedTimes, 1);
        });
        it('should append a component before another', () => {
            DOM.insertBefore(WRAPPER, elem, elem2);
            chai.assert.equal(elem.node.parentNode, WRAPPER);
            chai.assert.equal(elem2.node.parentNode, WRAPPER);
            chai.assert.equal(elem.node.nextSibling, elem2.node);
            chai.assert.equal(elem.disconnectedTimes, 1);
            chai.assert.equal(elem.connectedTimes, 2);
            chai.assert.equal(elem2.disconnectedTimes, 0);
            chai.assert.equal(elem2.connectedTimes, 1);
        });
        it('should do nothing if already before another', () => {
            DOM.insertBefore(WRAPPER, elem, elem2);
            chai.assert.equal(elem.node.parentNode, WRAPPER);
            chai.assert.equal(elem2.node.parentNode, WRAPPER);
            chai.assert.equal(elem.node.nextSibling, elem2.node);
            chai.assert.equal(elem.disconnectedTimes, 1);
            chai.assert.equal(elem.connectedTimes, 2);
            chai.assert.equal(elem2.disconnectedTimes, 0);
            chai.assert.equal(elem2.connectedTimes, 1);
        });
        it('should append again a component', () => {
            DOM.appendChild(WRAPPER, elem);
            chai.assert.equal(elem.node.parentNode, WRAPPER);
            chai.assert.equal(elem.disconnectedTimes, 2);
            chai.assert.equal(elem.connectedTimes, 3);
            chai.assert.equal(elem2.disconnectedTimes, 0);
            chai.assert.equal(elem2.connectedTimes, 1);
        });
        it('should do nothing if already last child of parent', () => {
            DOM.appendChild(WRAPPER, elem);
            chai.assert.equal(elem.node.parentNode, WRAPPER);
            chai.assert.equal(elem.disconnectedTimes, 2);
            chai.assert.equal(elem.connectedTimes, 3);
            chai.assert.equal(elem2.disconnectedTimes, 0);
            chai.assert.equal(elem2.connectedTimes, 1);
        });
        it('should replace a child', () => {
            DOM.replaceChild(WRAPPER, elem, elem2);
            chai.assert.equal(elem.node.parentNode, WRAPPER);
            chai.assert.equal(elem.disconnectedTimes, 3);
            chai.assert.equal(elem.connectedTimes, 4);
            chai.assert.equal(elem2.disconnectedTimes, 1);
            chai.assert.equal(elem2.connectedTimes, 1);
        });
        it('should set attributes', () => {
            DOM.setAttribute(elem, 'age', 20);
            DOM.setAttribute(elem, 'married', '');
            chai.assert.equal(elem.attributeChanges, 1);
            chai.assert.equal(elem.node.getAttribute('age'), '20');
            chai.assert.equal(elem.node.getAttribute('married'), '');
        });
        it('should remove attributes', () => {
            DOM.removeAttribute(elem, 'age');
            DOM.removeAttribute(elem, 'married');
            chai.assert.equal(elem.attributeChanges, 2);
            chai.assert.equal(elem.node.getAttribute('age'), null);
            chai.assert.equal(elem.node.getAttribute('married'), null);
        });
    });

    describe('bootstrap', () => {
        let WRAPPER = document.createElement('div');
        WRAPPER.innerHTML = '<p>Hello <test1-helper-component age="21"></test1-helper-component></p>';
        it('should instantiate all components', () => {
            bootstrap(WRAPPER);
            const elem = DOM.getNodeComponent(
                WRAPPER.querySelector('.test1-helper-component')
            );
            chai.assert.equal(elem.node.localName.toLowerCase(), 'test1-helper-component');
            chai.assert.equal(elem.node.getAttribute('age'), '21');
            chai.assert.equal(elem.node.getAttribute('class'), 'test1-helper-component');
            chai.assert.equal(elem.name, 'Alan');
            chai.assert.equal(elem.lastName, 'Turing');
        });

        let WRAPPER2 = document.createElement('div');
        WRAPPER2.innerHTML = '<p>Hello again <test1-helper-component age="21"/><test1-helper-component age="22"/></p>';
        it('should call callback for every component', () => {
            let count = 0;
            bootstrap(WRAPPER2, () => {
                count++;
            });
            chai.assert.equal(count, 2);
        });
    });
});
