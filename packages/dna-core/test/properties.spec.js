/* eslint-env mocha */

import { define, render, DOM } from '../index.js';
import {
    TestComponent1,
    TestComponent2,
} from './components/properties.js';

const WRAPPER = document.body;
define('test1-properties-component', TestComponent1);
define('test2-properties-component', TestComponent2);

describe('PropertiesComponent', () => {
    describe('handle property validation', () => {
        const elem = render(WRAPPER, TestComponent1);

        it('should throw if invalid type', () => {
            let fn = () => elem.age = 'Hello';
            assert.throws(fn, 'Invalid `Hello` value for `age` property for `test1-properties-component`.');
        });

        it('should throw if invalid value', () => {
            let fn = () => elem.age = -1;
            assert.throws(fn, 'Invalid `-1` value for `age` property for `test1-properties-component`.');
        });

        it('should accept null/undefined values', () => {
            elem.age = 51;
            assert.equal(elem.age, 51);
            elem.age = null;
            assert.equal(elem.age, null);
            elem.age = undefined;
            assert.equal(elem.age, undefined);
        });
    });
    describe('handle properties on initialization', () => {
        const elem = render(WRAPPER, TestComponent1, {
            name: 'Alan',
            lastName: 'Turing',
            var: '1234',
            married: true,
        });

        it('init element\'s properties', () => {
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
            assert.equal(elem.married, true);
            assert.equal(elem.var, '1234');
            assert.equal(elem.type, 2);
        });

        it('observe property changes', () => {
            let changedSingle = 0;
            let callback = () => {
                changedSingle++;
                elem.unobserveProperty('age', callback);
            };
            elem.observeProperty('age', callback);
            elem.age = 41;
            elem.age = 51;
            assert.equal(elem.age, 51);
            assert.equal(elem.ageChanged, 2);
            assert.equal(changedSingle, 1);
        });
    });

    describe('handle props 2 attrs', () => {
        const elem = render(WRAPPER, TestComponent2);

        it('check sync between property and attribute', () => {
            elem.title = 'DNA Test';
            assert.equal(elem.node.getAttribute('title'), 'DNA Test');
        });
        it('check sync between custom property and attribute', () => {
            elem.var = 1234;
            elem.id = 'dna-test';
            assert.equal(elem.node.getAttribute('var'), '1234');
            assert.equal(elem.node.getAttribute('id'), 'dna-test');
        });
        it('check sync between custom computed property and attribute', () => {
            elem.myVar = true;
            assert.equal(elem.node.getAttribute('my-var'), '');
            elem.myVar = false;
            assert.equal(elem.node.getAttribute('my-var'), null);
        });
        it('check sync between custom computed property with setter and attribute', () => {
            elem.myVar3 = true;
            assert.equal(elem.node.getAttribute('my-var3'), 'DNA Test');
        });
        it('dispatch event', () => {
            let triggered = 0;
            elem.node.addEventListener('changed', () => {
                triggered++;
            });
            elem.myVar3 = true;
            elem.myVar3 = false;
            assert.equal(triggered, 1);
        });
    });

    describe('handle attrs 2 props', () => {
        const elem = render(WRAPPER, TestComponent2);

        DOM.setAttribute(elem, 'alt', 'DNA Test 2');
        DOM.setAttribute(elem, 'mine', '1234');
        DOM.setAttribute(elem, 'my-var2', '');

        it('check sync between attribute and property', () => {
            assert.equal(elem.node.getAttribute('alt'), 'DNA Test 2');
            assert.equal(elem.alt, 'DNA Test 2');
        });
        it('check sync between custom attribute and property', () => {
            assert.equal(elem.node.getAttribute('mine'), 1234);
            assert.equal(elem.mine, 1234);
        });
        it('check sync between custom computed attribute and property', () => {
            assert.equal(elem.node.getAttribute('my-var2'), '');
            assert.equal(elem.myVar2, true);
        });
    });

    describe('handle attrs 2 props on initialization', () => {
        const elem = new TestComponent2();
        DOM.setAttribute(elem, 'alt', 'DNA Test 2');
        DOM.setAttribute(elem, 'mine', '1234');
        DOM.setAttribute(elem, 'my-var2', '');

        DOM.appendChild(WRAPPER, elem);

        it('check sync between attribute and property', () => {
            assert.equal(elem.node.getAttribute('alt'), 'DNA Test 2');
            assert.equal(elem.alt, 'DNA Test 2');
        });
        it('check sync between custom attribute and property', () => {
            assert.equal(elem.node.getAttribute('mine'), 1234);
            assert.equal(elem.mine, 1234);
        });
        it('check sync between custom computed attribute and property', () => {
            assert.equal(elem.node.getAttribute('my-var2'), '');
            assert.equal(elem.myVar2, true);
        });
    });
});
