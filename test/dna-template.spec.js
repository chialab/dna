import { Test1, Test2, Test3 } from './dna-template.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNATemplateComponent', () => {
    let elem1 = new Test1();
    let elem2 = new Test2();
    let elem3 = new Test3();

    it('should handle `template` getter property as function with interpolation', () => {
        document.body.appendChild(elem1);
        assert.equal(elem1.innerHTML, 'Hello, ');
        elem1.name = 'Alan';
        elem1.lastName = 'Turing';
        assert.equal(elem1.innerHTML, 'Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        document.body.appendChild(elem2);
        assert.equal(elem2.innerHTML, '<span>Hello DNA!</span>');
    });

    it('should handle `template` property as string', () => {
        document.body.appendChild(elem3);
        assert.equal(elem3.innerHTML, '<span>Hello DNA!</span>');
    });
});
