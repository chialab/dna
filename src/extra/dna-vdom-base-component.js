import { DNABaseComponent } from '../dna-base-component.js';
import { DNAVDomComponent } from './dna-vdom-component.js';

export class DNAVDomBaseComponent extends DNABaseComponent {
    static get behaviors() {
        return DNABaseComponent.behaviors.map((behavior) => {
            if (behavior.name === 'DNATemplateComponent') {
                return DNAVDomComponent;
            }
            return behavior;
        });
    }
}
