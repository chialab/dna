/* eslint-env mocha */

import '../src/observers/idom.js';
import { Template } from '../index.js';
import { define } from '../src/lib/define.js';
import {
    TestComponent1,
    TestComponent2,
} from './components/dna-properties.js';
import { Wrapper } from './utils/wrapper.js';
import { debounce } from './utils/debounce.js';

const WRAPPER = new Wrapper();
define('test1-properties-component', TestComponent1);
define('test2-properties-component', TestComponent2);

describe('DNAPropertiesComponent', () => {
    describe('Unit: DNAPropertiesComponent > creation', () => {
        let template = new Template(' \
            <test1-properties-component \
                name="Alan" \
                last-name="Turing" \
                var="1234" \
                married> \
            </test1-properties-component> \
        ');

        template.render(WRAPPER);
        const elem = WRAPPER.querySelector('test1-properties-component');

        it('init element\'s properties', () => {
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
            assert.equal(elem.married, true);
            assert.equal(elem.var, 1234);
        });

        it('observe properties changes', () => {
            let changedSingle = false;
            let changedAll = false;
            elem.observeProperty('age', () => {
                changedSingle = true;
            });
            elem.observeProperties(() => {
                changedAll = true;
            });
            elem.age = 41;
            assert(changedSingle);
            assert(changedAll);
        });
    });

    describe('Unit: DNAPropertiesComponent > props 2 attrs', () => {
        let template = new Template(
            '<test2-properties-component></test2-properties-component>'
        );
        template.render(WRAPPER);
        const elem = WRAPPER.querySelector('test2-properties-component');

        it('check sync between property and attribute', () => {
            elem.title = 'DNA Test';
            assert.equal(elem.getAttribute('title'), 'DNA Test');
        });
        it('check sync between custom property and attribute', () => {
            elem.var = 1234;
            elem.id = 'dna-test';
            assert.equal(elem.getAttribute('var'), '1234');
            assert.equal(elem.getAttribute('id'), 'dna-test');
        });
        it('check sync between custom computed property and attribute', () => {
            elem.myVar = true;
            assert.equal(elem.getAttribute('my-var'), '');
            elem.myVar = false;
            assert.equal(elem.getAttribute('my-var'), null);
        });
        it('check sync between custom computed property with setter and attribute', () => {
            elem.myVar3 = true;
            assert.equal(elem.getAttribute('my-var3'), 'DNA Test');
        });
        it('dispatch event', () => {
            let triggered = 0;
            elem.addEventListener('changed', () => {
                triggered++;
            });
            elem.myVar3 = true;
            elem.myVar3 = false;
            assert.equal(triggered, 1);
        });
    });

    describe('Unit: DNAAttributesComponent > attrs 2 props', () => {
        let template = new Template('attrs', ' \
            <test2-properties-component \
            ${attrs ? ` \
                alt="DNA Test 2" \
                mine="1234" \
                my-var2="true" \
            ` : \'\'} \
            ></test2-properties-component> \
        ');
        template.render(WRAPPER);
        const elem = WRAPPER.querySelector('test2-properties-component');

        debounce(() => {
            template.render(WRAPPER, true);
        });

        it('check sync between attribute and property', () => {
            assert.equal(elem.alt, 'DNA Test 2');
        });
        it('check sync between custom attribute and property', () => {
            assert.equal(elem.mine, 1234);
        });
        it('check sync between custom computed attribute and property', () => {
            assert.equal(elem.myVar2, true);
        });
    });
});
