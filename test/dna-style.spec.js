import { register } from '../src/plugins/dna.elements.js';
import { TestComponent1, TestComponent2, TestComponent3 } from './components/dna-style.js';

document.body.innerHTML += `
    <test1-style-component></test1-style-component>
    <test2-style-component></test2-style-component>
    <div is="test3-style-component"></div>
`;

const Test1 = register('test1-style-component', {
    prototype: TestComponent1,
});

const Test2 = register('test2-style-component', {
    prototype: TestComponent2,
});

const Test3 = register('test3-style-component', {
    prototype: TestComponent3,
    extends: 'div',
});

/* globals describe, before, it, assert */
describe('Unit: DNAStyleComponent', () => {
    let elem1;
    let elem2;
    let elem3;
    let elem4;
    let elem5;
    let elem6;

    before((done) => {
        elem1 = document.querySelector('.test1-style-component');
        elem2 = document.querySelector('.test2-style-component');
        elem3 = document.querySelector('.test3-style-component');
        elem4 = new Test1();
        elem5 = new Test2();
        elem6 = new Test3();
        document.body.appendChild(elem4);
        document.body.appendChild(elem5);
        document.body.appendChild(elem6);
        setTimeout(() => {
            done();
        }, 250);
    });

    it('should handle `css` getter property as function for element already in the dom', () => {
        let style = window.getComputedStyle(elem1.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property as string for element already in the dom', () => {
        let style = window.getComputedStyle(elem2.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` property as string for element already in the dom', () => {
        let style = window.getComputedStyle(elem3.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property as function', () => {
        let style = window.getComputedStyle(elem4.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property as string', () => {
        let style = window.getComputedStyle(elem5.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` property as string', () => {
        let style = window.getComputedStyle(elem6.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });
});
