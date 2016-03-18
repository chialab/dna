import { DNAPropertiesComponent } from '../src/dna-properties-component.next.js';
import { DNAHelper } from '../src/dna-helper.next.js';

class TestComponent extends DNAPropertiesComponent {
    static get properties() {
        return ['name', 'lastName'];
    }
}

export const Test = DNAHelper.register('test-properties-component', {
    prototype: TestComponent,
});
