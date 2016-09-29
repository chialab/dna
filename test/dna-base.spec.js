import { define } from '../src/dna.js';
import { TestComponent } from './components/dna-base.js';
import { Template } from 'skin-template/src/template.js';

const WRAPPER = document.body;
define('test-base-component', TestComponent);

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNABaseComponent', () => {
    let template = new Template((t, show) => t`
        ${show ? '<test-base-component></test-base-component>' : ''}
    `);
    template.render(WRAPPER, true);
    let elem = WRAPPER.querySelector('test-base-component');

    describe('Unit: DNABaseComponent > created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('Unit: DNABaseComponent > attached', () => {
        before((done) => {
            document.body.appendChild(elem);
            setTimeout(() => {
                done();
            }, 250);
        });
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('Unit: DNABaseComponent > detached', () => {
        before((done) => {
            template.render(WRAPPER, false);
            done();
        });
        it('check if element is correctly detached from the tree', () => {
            assert.equal(elem.attached, false);
        });
    });

    describe('Unit: DNABaseComponent > attributeChanged', () => {
        before((done) => {
            elem.setAttribute('name', 'Alan');
            setTimeout(() => {
                done();
            }, 250);
        });
        it('check if element is correctly trigger attributeChangedCallback', () => {
            assert.equal(elem.name, 'Alan');
        });
    });
});
