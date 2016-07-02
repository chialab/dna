import { DNAPropertiesComponent } from '../../src/dna-properties-component.js';

export class TestComponent extends DNAPropertiesComponent {
    static get observedProperties() {
        return ['name', 'lastName', 'married', 'age'];
    }
}
