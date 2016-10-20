/* eslint-env mocha */

import '../src/observers/idom.js';
import { Template } from '../index.js';
import { define } from '../src/lib/define.js';
import { TestComponent } from './components/dna-base.js';
import { Wrapper } from './utils/wrapper.js';
import { debounce } from './utils/debounce.js';

const WRAPPER = new Wrapper();
define('test-base-component', TestComponent);

describe('Unit: BaseComponent', () => {
    let template = new Template('show', 'attr',
        '${show ? `<test-base-component${attr ? ` name=${attr}` : \'\'}></test-base-component>` : \'\'}'
    );
    template.render(WRAPPER, true, false);
    const elem = WRAPPER.querySelector('test-base-component');

    describe('Unit: BaseComponent > created', () => {
        it('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe('Unit: BaseComponent > attached', () => {
        it('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe('Unit: BaseComponent > attributeChanged', () => {
        debounce(() => template.render(WRAPPER, true, 'Alan'));
        it('check if element is correctly trigger attributeChangedCallback', () => {
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('Unit: BaseComponent > detached', () => {
        debounce(() => template.render(WRAPPER, false));
        it('check if element is correctly detached from the tree', () => {
            assert.equal(elem.attached, false);
        });
    });
});
