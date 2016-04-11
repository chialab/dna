import { DNAAttributesComponent } from '../src/dna-attributes-component.next.js';

export class TestComponent extends DNAAttributesComponent {
    static get attributes() {
        return ['title', 'id', 'alt', 'var', 'mine', 'myVar', 'myVar2', 'myVar3'];
    }

    get myVar3() {
        return this.__var3 || false;
    }

    set myVar3(val) {
        if (val) {
            this.__var3 = 'DNA Test';
        } else {
            this.__var3 = false;
        }
        return this.__var3;
    }
}
