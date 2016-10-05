import { DNAPropertiesComponent } from '../../src/dna-properties-component.js';

export class TestComponent1 extends DNAPropertiesComponent {
    static get observedAttributes() {
        return ['name', 'last-name', 'married', 'age', 'var'];
    }
    static get observedProperties() {
        return this.observedAttributes;
    }
}

export class TestComponent2 extends DNAPropertiesComponent {
    static get observedAttributes() {
        return ['title', 'id', 'alt', 'var', 'mine', 'my-var', 'my-var2', 'my-var3'];
    }

    static get observedProperties() {
        return this.observedAttributes;
    }

    get myVar3() {
        return this.getProperty('var3') || false;
    }

    set myVar3(val) {
        if (val) {
            return this.setProperty('myVar3', 'DNA Test');
        }
        return this.setProperty('myVar3', false);
    }
}
