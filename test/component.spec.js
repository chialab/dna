/* eslint-env mocha */

import { Template, define } from './library.js';
import { TestComponent } from './components/component.js';
import { Wrapper } from './utils/wrapper.js';
import { debounce } from './utils/debounce.js';

const WRAPPER = new Wrapper();
define('test-component', TestComponent);

describe('Unit: DNAComponent', () => {
    let template = new Template('show', 'attr',
        '${show ? `<test-component${attr ? ` test-callback="Alan"` : \'\'}></test-component>` : \'\'}'
    );
    template.render(WRAPPER, true);
    let elem = WRAPPER.querySelector('test-component');

    describe('Unit: DNAComponent > created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('Unit: DNAComponent > attached', () => {
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('Unit: DNAComponent > attributeChanged', () => {
        debounce(() => template.render(WRAPPER, true, true));
        it('check if element is correctly trigger attributeChangedCallback', () => {
            assert.equal(elem['test-callback'], 'Alan');
        });
    });

    describe('Unit: DNAComponent > detached', () => {
        debounce(() => template.render(WRAPPER, false));
        it('check if element is correctly detached from the tree', () => {
            assert.equal(elem.attached, false);
        });
    });
});
