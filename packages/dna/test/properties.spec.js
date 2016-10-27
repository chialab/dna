/* eslint-env mocha */

import { define, render, setAttribute } from '../index.js';
import {
    TestComponent1,
    TestComponent2,
} from './components/properties.js';

const WRAPPER = document.body;
define('test1-properties-component', TestComponent1);
define('test2-properties-component', TestComponent2);

describe('PropertiesComponent', () => {
    describe('Unit: PropertiesComponent > creation', () => {
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
        });

        it('observe property changes', () => {
            let changedSingle = false;
            elem.observeProperty('age', () => {
                changedSingle = true;
            });
            elem.age = 41;
            assert(changedSingle);
        });
    });

    describe('Unit: PropertiesComponent > props 2 attrs', () => {
        const elem = render(WRAPPER, TestComponent2);

        it('check sync between property and attribute', () => {
            elem.title = 'DNA Test';
            assert.equal(elem.getAttribute('title'), 'DNA Test');
        });
        it('check sync between custom property and attribute', () => {
            elem.var = 1234;
            elem.id = 'dna-test';
            assert.equal(elem.getAttribute('var'), '1234');
            assert.equal(elem.getAttribute('id'), 'dna-test');
        });
        it('check sync between custom computed property and attribute', () => {
            elem.myVar = true;
            assert.equal(elem.getAttribute('my-var'), '');
            elem.myVar = false;
            assert.equal(elem.getAttribute('my-var'), null);
        });
        it('check sync between custom computed property with setter and attribute', () => {
            elem.myVar3 = true;
            assert.equal(elem.getAttribute('my-var3'), 'DNA Test');
        });
        it('dispatch event', () => {
            let triggered = 0;
            elem.addEventListener('changed', () => {
                triggered++;
            });
            elem.myVar3 = true;
            elem.myVar3 = false;
            assert.equal(triggered, 1);
        });
    });

    describe('Unit: PropertiesComponent > attrs 2 props', () => {
        const elem = render(WRAPPER, TestComponent2);

        setAttribute(elem, 'alt', 'DNA Test 2');
        setAttribute(elem, 'mine', '1234');
        setAttribute(elem, 'my-var2', 'true');

        it('check sync between attribute and property', () => {
            assert.equal(elem.getAttribute('alt'), 'DNA Test 2');
            assert.equal(elem.alt, 'DNA Test 2');
        });
        it('check sync between custom attribute and property', () => {
            assert.equal(elem.getAttribute('mine'), 1234);
            assert.equal(elem.mine, 1234);
        });
        it('check sync between custom computed attribute and property', () => {
            assert.equal(elem.getAttribute('my-var2'), '');
            assert.equal(elem.myVar2, true);
        });
    });
});
