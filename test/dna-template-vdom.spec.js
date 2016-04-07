import { DNAConfig as Config } from '../src/dna-config.next.js';
import { DNAHelper } from '../src/dna-helper.next.js';
import {
    TestComponent1,
    TestComponent2,
    TestComponent3,
    TestComponent4,
    TestComponent5,
    TestComponent6,
} from './dna-template.next.js';

Config.useVirtualDOM = true;

const Test1 = DNAHelper.register('test1-vdom-template-component', {
    prototype: TestComponent1,
});

const Test2 = DNAHelper.register('test2-vdom-template-component', {
    prototype: TestComponent2,
});

const Test3 = DNAHelper.register('test3-vdom-template-component', {
    prototype: TestComponent3,
});

const Test4 = DNAHelper.register('test4-vdom-template-component', {
    prototype: TestComponent4,
});

const Test5 = DNAHelper.register('test5-vdom-template-component', {
    prototype: TestComponent5,
});

const Test6 = DNAHelper.register('test6-vdom-template-component', {
    prototype: TestComponent6,
});

const hasTemplate = (typeof document.importNode === 'function' &&
    typeof HTMLTemplateElement !== 'undefined');

/* globals describe, before, beforeEach, it, assert */
describe('Unit: DNATemplateComponent with virtualDom', () => {
    beforeEach((done) => {
        Config.useVirtualDOM = true;
        done();
    });

    it('should handle `template` getter property as function with interpolation', () => {
        let elem = new Test1();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, 'Hello, ');
        elem.name = 'Alan';
        elem.lastName = 'Turing';
        assert.equal(elem.innerHTML, 'Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        let elem = new Test2();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle `template` property as string', () => {
        let elem = new Test3();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    if (hasTemplate) {
        it('should handle `template` property as HTMLTemplateElement', () => {
            let elem = new Test4();
            document.body.appendChild(elem);
            assert.equal(elem.innerHTML, '<span class="dna-test">Hello DNA!</span>');
        });

        it('should handle `template` property as HTMLTemplateElement with multiple nodes', () => {
            let elem = new Test5();
            document.body.appendChild(elem);
            assert.equal(
                elem.innerHTML,
                '<span class="dna-test">Hello DNA!</span><span>Hello World!</span>'
            );
        });
    }

    it('should handle invalid `template`', () => {
        let elem = new Test6();
        document.body.appendChild(elem);
        assert.equal(elem.innerHTML, '');
    });
});
