import { DNAAttributesComponent } from '../src/dna-attributes-component.next.js';
import { Register } from '../src/dna-library.next.js';

export class TestComponent extends DNAAttributesComponent {
    static get attributes() {
        return ['title', 'alt', 'var', 'mine', 'myVar', 'myVar2', 'myVar3'];
    }

    get myVar3() {
        return this.__var3 || 0;
    }

    set myVar3(val) {
        if (val === true) {
            this.__var3 = 'DNA Test';
        }
    }
}

export var Test = Register('test-attributes-component', {
    prototype: TestComponent
});
