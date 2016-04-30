import { DNAPropertiesComponent } from '../../src/dna-properties-component.js';

export class TestComponent extends DNAPropertiesComponent {
    static get properties() {
        return ['name', 'lastName', 'married'];
    }
}
