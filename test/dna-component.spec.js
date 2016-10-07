/* eslint-env mocha */

import { Template, define } from '../src/dna.js';
import { TestComponent } from './components/dna-component.js';
import { Wrapper } from './utils/wrapper.js';

const WRAPPER = new Wrapper();
define('test-component', TestComponent);

describe('Unit: DNAComponent', () => {
    let template = new Template((t, show) => t`
        ${show ? '<test-component testCallback="Alan"></test-component>' : ''}
    `);
    template.render(WRAPPER, true);
    let elem = WRAPPER.querySelector('test-component');

    describe('Unit: DNAComponent > created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('Unit: DNAComponent > attached', () => {
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('Unit: DNAComponent > attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            assert.equal(elem.testCallback, 'Alan');
        });
    });

    describe('Unit: DNAComponent > detached', () => {
        before((done) => {
            template.render(WRAPPER, false);
            done();
        });
        it('check if element is correctly detached from the tree', () => {
            assert.equal(elem.attached, false);
        });
    });
});
