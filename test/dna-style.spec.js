import { Test1, Test2, Test3 } from './dna-style.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNAStyleComponent', () => {
    let elem1 = new Test1();
    let elem2 = new Test2();
    let elem3 = new Test3();

    it('should handle `css` getter property as function', () => {
        document.body.appendChild(elem1);
        let style = window.getComputedStyle(elem1.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property as string', () => {
        document.body.appendChild(elem2);
        let style = window.getComputedStyle(elem2.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` property as string', () => {
        document.body.appendChild(elem3);
        let style = window.getComputedStyle(elem3.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });
});
