/* eslint-env mocha */

import { Template, define } from '../src/dna.js';
import { TestComponent } from './components/dna-base.js';
import { Wrapper } from './utils/wrapper.js';

const WRAPPER = new Wrapper();
define('test-base-component', TestComponent);

describe('Unit: BaseComponent', () => {
    let template = new Template('show', 'attr',
        '${show ? `<test-base-component${attr ? ` name=${attr}` : \'\'}></test-base-component>` : \'\'}'
    );
    template.render(WRAPPER, true, false);
    let elem = WRAPPER.querySelector('test-base-component');
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
        before((done) => {
            template.render(WRAPPER, true, 'Alan');
            done();
        });
        it('check if element is correctly trigger attributeChangedCallback', () => {
            assert.equal(elem.name, 'Alan');
        });
    });

    describe('Unit: BaseComponent > detached', () => {
        before((done) => {
            template.render(WRAPPER, false);
            done();
        });
        it('check if element is correctly detached from the tree', () => {
            assert.equal(elem.attached, false);
        });
    });
});
