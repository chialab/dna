/* eslint-env mocha */

import { camelToDash, dashToCamel } from '../src/lib/strings.js';
import { define } from '../src/lib/define.js';
import { Component } from '../src/dna-component.js';

describe('Unit: lib', () => {
    describe('camelToDash', () => {
        it('should transform transform a camel case string to dashed case', () => {
            assert.equal(camelToDash('simple'), 'simple');
            assert.equal(camelToDash('Simple'), 'simple');
            assert.equal(camelToDash('SimpleString'), 'simple-string');
            assert.equal(camelToDash('Simple String'), 'simple-string');
        });
    });

    describe('dashToCamel', () => {
        it('should transform transform a dashed case string to camel case', () => {
            assert.equal(dashToCamel('simple'), 'simple');
            assert.equal(dashToCamel('simple-string'), 'simpleString');
            assert.equal(dashToCamel('simple-long-string'), 'simpleLongString');
        });
    });

    describe('define', () => {
        class TestComponent extends Component {
            constructor() {
                super();
                this.name = 'Alan';
                this.lastName = 'Turing';
            }
        }

        describe('a simple element', () => {
            define('test1-helper-component', TestComponent);

            it('should define a custom element', () => {
                let elem = new TestComponent();
                assert.equal(elem.tagName.toLowerCase(), 'test1-helper-component');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });

        describe('a with extends field', () => {
            const TestComponent2 = class extends TestComponent {};
            define('test1-helper-define-component', TestComponent2, {
                extends: 'div',
            });

            it('should define a custom element with extends field', () => {
                let elem = new TestComponent2();
                assert.equal(elem.tagName.toLowerCase(), 'div');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });
    });
});
