import { DNAPropertiesComponent } from '../src/dna-properties-component.next.js';

export class TestComponent extends DNAPropertiesComponent {
    static get properties() {
        return ['name', 'lastName'];
    }
}
