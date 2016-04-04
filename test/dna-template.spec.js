import { DNAHelper } from '../src/dna-helper.next.js';
import { TestComponent1, TestComponent2, TestComponent3 } from './dna-template.next.js';

const Test1 = DNAHelper.register('test1-template-component', {
    prototype: TestComponent1,
});

const Test2 = DNAHelper.register('test2-template-component', {
    prototype: TestComponent2,
});

const Test3 = DNAHelper.register('test3-template-component', {
    prototype: TestComponent3,
});

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
