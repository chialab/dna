import { Test } from './dna-attributes.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNAAttributesComponent', () => {
    let elem = new Test();

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
        assert.equal(elem.getAttribute('var'), '1234');
    });

    it('check sync between invented attribute and property', () => {
        elem.setAttribute('mine', '1234');
        assert.equal(elem.mine, '1234');
    });

    it('check sync between invented composed property and attribute', () => {
        elem.myVar = true;
        assert.equal(elem.getAttribute('my-var'), '');
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
