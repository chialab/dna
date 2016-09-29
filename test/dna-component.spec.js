import { define } from '../src/dna.js';
import { TestComponent } from './components/dna-component.js';
import { Template } from 'skin-template/src/template.js';

const WRAPPER = document.body;
define('test-component', TestComponent);

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNAComponent', () => {
    let template = new Template((t, show) => t`
        ${show ? '<test-component></test-component>' : ''}
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
