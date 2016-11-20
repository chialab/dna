/* eslint-env mocha */

import { BaseComponent, define, IDOM } from '../index.js';
import '../observer.js';

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

define('test-idom-component', TestComponent);

const WRAPPER = document.createElement('div');
document.body.appendChild(WRAPPER);

describe('Unit: IDOM observer', () => {
    describe('callbacks', () => {
        const render = (data) => {
            if (data.show) {
                return <test-idom-component age={data.age} married={data.married}></test-idom-component>;
            }
        };
        IDOM.patch(WRAPPER, render, { show: true, age: 20, married: false });
        const elem = WRAPPER.querySelector('test-idom-component');
        it('should create a component instance', () => {
            assert.equal(elem.tagName.toLowerCase(), 'test-idom-component');
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
        });
        it('should update a component', () => {
            IDOM.patch(WRAPPER, render, { show: true, age: 21, married: true });
            assert.equal(elem.getAttribute('age'), '21');
            assert.equal(elem.getAttribute('married'), 'true');
            assert.equal(elem.attributeChanges, 1);
        });
        it('should remove a component', () => {
            IDOM.patch(WRAPPER, render, { show: false });
            assert.equal(elem.parentNode, undefined);
            assert.equal(elem.disconnectedTimes, 1);
        });
    });
});
