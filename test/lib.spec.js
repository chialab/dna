/* eslint-env mocha */

import { define } from '../src/lib/define.js';
import { Component } from '../src/dna-component.js';
import { Template } from '../index.js';
import { Wrapper } from './utils/wrapper.js';

describe('Unit: lib', () => {
    describe('define', () => {
        class TestComponent extends Component {
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
            const wrapper = new Wrapper();
            define('helper-define-component', TestComponent2);
            let template = new Template('<div is="helper-define-component"></div>');
            template.render(wrapper);
            const elem = wrapper.querySelector('[is="helper-define-component"]');

            it('a custom element with extends field', () => {
                assert.equal(elem.localName.toLowerCase(), 'div');
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
            });
        });
    });
});
