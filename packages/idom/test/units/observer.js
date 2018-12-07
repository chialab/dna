/* eslint-env mocha */

import { define, DOM, IDOM } from '../../index.js';
import { TestComponent } from '../components/observer.js';
import chai from 'chai/chai.js';

// eslint-disable-next-line
const h = IDOM.h;

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
        const node = WRAPPER.querySelector('test-idom-component');
        const elem = DOM.getNodeComponent(node);
        it('should create a component instance', () => {
            chai.assert.equal(elem.name, 'Alan');
            chai.assert.equal(elem.lastName, 'Turing');
        });
        it('should update a component', () => {
            IDOM.patch(WRAPPER, render, { show: true, age: 21, married: true });
            chai.assert.equal(elem.node.getAttribute('age'), '21');
            chai.assert.equal(elem.age, 21);
            chai.assert.equal(elem.attributeChanges, 1);
            chai.assert.equal(elem.married, true);
        });
        it('should remove a component', () => {
            IDOM.patch(WRAPPER, render, { show: false });
            chai.assert.equal(elem.node.parentNode, undefined);
            chai.assert.equal(elem.disconnectedTimes, 1);
        });
    });
});
