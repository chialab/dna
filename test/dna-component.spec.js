import { register } from '../src/plugins/dna.elements.js';
import { TestComponent } from './components/dna-component.js';

const Test = register('test-component', TestComponent);

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNAComponent', () => {
    let elem = new Test();

    describe('Unit: DNAComponent > created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('Unit: DNAComponent > attached', () => {
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

    describe('Unit: DNAComponent > attributeChanged', () => {
        it('check if element is correctly trigger attributeChangedCallback', () => {
            elem.setAttribute('name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('Unit: DNAComponent > detached', () => {
        before((done) => {
            document.body.removeChild(elem);
            setTimeout(() => {
                done();
            }, 250);
        });
        it('check if element is correctly detached from the tree', () => {
            assert.equal(elem.attached, false);
        });
    });
});
