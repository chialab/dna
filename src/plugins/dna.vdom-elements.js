import { DNAVDomBaseComponent } from '../extra/dna-vdom-base-component.js';
import { register as _register } from './dna.elements.js';

// export library
export * from '../dna.js';

// export extras
export * from '../extra/dna-vdom-component.js';
class DNAVDomElementsBaseComponent extends DNAVDomBaseComponent {
    static get useVirtualDomHooks() {
        return false;
    }
}
export { DNAVDomBaseComponent, DNAVDomElementsBaseComponent };

// override deault base component
export let BaseComponent = DNAVDomElementsBaseComponent;

// override `register` and `create` methods
export const register = _register;
