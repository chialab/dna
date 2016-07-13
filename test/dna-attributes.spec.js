import { register } from '../src/plugins/dna.elements.js';
import { TestComponent } from './components/dna-attributes.js';

const Test = register('test-attributes-component', TestComponent);

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNAAttributesComponent', () => {
    let elem;
    beforeEach((done) => {
        elem = new Test();
        setTimeout(() => {
            done();
        }, 250);
    });

    it('check sync between attribute and property on creation', () => {
        elem.setAttribute('id', 'dna-test');
        elem.setAttribute('alt', 'DNA Test 2');
        elem.setAttribute('var', '1234');
        elem.setAttribute('my-var3', '');
        let clone = elem.cloneNode(true);
        assert.equal(clone.id, 'dna-test');
        assert.equal(clone.alt, 'DNA Test 2');
        assert.equal(clone.var, 1234);
        assert.equal(clone.myVar3, 'DNA Test');
    });

    it('check sync between property and attribute', () => {
        elem.title = 'DNA Test';
        assert.equal(elem.getAttribute('title'), 'DNA Test');
    });

    it('check sync between attribute and property', () => {
        elem.setAttribute('alt', 'DNA Test 2');
        assert.equal(elem.alt, 'DNA Test 2');
    });

    it('check sync between invented property and attribute', () => {
        elem.var = 1234;
        elem.id = 'dna-test';
        assert.equal(elem.getAttribute('var'), '1234');
        assert.equal(elem.getAttribute('id'), 'dna-test');
    });

    it('check sync between invented attribute and property', () => {
        elem.setAttribute('mine', '1234');
        assert.equal(elem.mine, '1234');
    });

    it('check sync between invented composed property and attribute', () => {
        elem.myVar = true;
        assert.equal(elem.getAttribute('my-var'), '');
        elem.myVar = false;
        assert.equal(elem.getAttribute('my-var'), null);
    });

    it('check sync between invented composed attribute and property', () => {
        elem.setAttribute('my-var2', 'true');
        assert.equal(elem.myVar2, 'true');
    });

    it('check sync between invented composed property with setter and attribute', () => {
        elem.myVar3 = true;
        assert.equal(elem.getAttribute('my-var3'), 'DNA Test');
    });
});
