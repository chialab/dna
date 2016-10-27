/* eslint-env mocha */

import { define, render } from './library.js';
import { TestComponent1, TestComponent2 } from './components/style.js';
import { Wrapper } from './utils/wrapper.js';

const WRAPPER = new Wrapper();

define('test1-style-component', TestComponent1);
define('test2-style-component', TestComponent2, {
    extends: 'div',
});

render(WRAPPER, TestComponent1);
render(WRAPPER, TestComponent2);

describe('Unit: DNAStyleComponent', () => {
    let elem1 = WRAPPER.querySelector('.test1-style-component');
    let elem2 = WRAPPER.querySelector('.test2-style-component');

    it('should handle `css` getter property', () => {
        let style = window.getComputedStyle(elem1.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });

    it('should handle `css` getter property with state', () => {
        let style = window.getComputedStyle(elem2.querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
    });
});
