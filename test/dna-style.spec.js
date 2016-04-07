import { DNAHelper } from '../src/dna-helper.next.js';
import { TestComponent1, TestComponent2, TestComponent3 } from './dna-style.next.js';

const Test1 = DNAHelper.register('test1-style-component', {
    prototype: TestComponent1,
});

const Test2 = DNAHelper.register('test2-style-component', {
    prototype: TestComponent2,
});

const Test3 = DNAHelper.register('test3-style-component', {
    prototype: TestComponent3,
});

/* globals describe, before, it, assert */
describe('Unit: DNAStyleComponent', () => {
    let elem1;
    let elem2;
    let elem3;

    before((done) => {
        elem1 = new Test1();
        elem2 = new Test2();
        elem3 = new Test3();
        document.body.appendChild(elem1);
        document.body.appendChild(elem2);
        document.body.appendChild(elem3);
        setTimeout(() => {
            done();
        }, 250);
    });

    it('should handle `css` getter property as function', () => {
        let style = window.getComputedStyle(elem1.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property as string', () => {
        let style = window.getComputedStyle(elem2.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` property as string', () => {
        let style = window.getComputedStyle(elem3.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });
});
