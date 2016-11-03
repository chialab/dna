/* eslint-env mocha */

import { mix, shim, render, define, MIXINS } from '../index.js';

const WRAPPER = document.body;

describe('Unit: lib', () => {
    describe('define', () => {
        class TestComponent extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin) {
            constructor() {
                super();
                this.name = 'Alan';
                this.lastName = 'Turing';
            }
        }

        class TestComponent2 extends TestComponent {}

        describe('a simple element', () => {
            define('test1-helper-component', TestComponent);

            it('should define a custom element', () => {
                let elem = new TestComponent();
                assert.equal(elem.tagName.toLowerCase(), 'test1-helper-component');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });

        describe('an element with extends field', () => {
            define('helper-define-component', TestComponent2, { extends: 'div' });
            const elem = render(WRAPPER, TestComponent2);

            it('a custom element with extends field', () => {
                assert.equal(elem.localName.toLowerCase(), 'div');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });
    });
});
