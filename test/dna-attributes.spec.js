import { register } from '../src/plugins/dna.elements.js';
import { TestComponent } from './components/dna-attributes.js';

const Test = register('test-attributes-component', TestComponent);

function debounce(callback, done, time = 200) {
    setTimeout(() => {
        callback();
        done();
    }, time);
}

/* globals describe, before, beforeEach, it, assert */
describe('DNAAttributesComponent', () => {
    let elem = new Test();

    describe('Unit: DNAAttributesComponent > on creation', () => {
        let clone;
        before((done) => {
            debounce(() => {
                elem.setAttribute('id', 'dna-test');
                elem.setAttribute('alt', 'DNA Test 2');
                elem.setAttribute('var', '1234');
                elem.setAttribute('my-var3', '');
                clone = elem.cloneNode(true);
            }, done);
        });
        it('check sync between attribute and property on creation', () => {
            assert.equal(clone.id, 'dna-test');
            assert.equal(clone.alt, 'DNA Test 2');
            assert.equal(clone.var, 1234);
            assert.equal(clone.myVar3, 'DNA Test');
        });
    });

    describe('Unit: DNAAttributesComponent > props 2 attrs', () => {
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
    });

    describe('Unit: DNAAttributesComponent > attrs 2 props', () => {
        before((done) => {
            debounce(() => {
                elem.setAttribute('alt', 'DNA Test 2');
                elem.setAttribute('mine', '1234');
                elem.setAttribute('my-var2', 'true');
            }, done);
        });
        it('check sync between attribute and property', () => {
            assert.equal(elem.alt, 'DNA Test 2');
        });
        it('check sync between custom attribute and property', () => {
            assert.equal(elem.mine, '1234');
        });
        it('check sync between custom computed attribute and property', () => {
            assert.equal(elem.myVar2, 'true');
        });
    });
});
