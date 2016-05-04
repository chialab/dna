import { DNAVDomBaseComponent } from '../extra/dna-vdom-base-component.js';
import { create as _create } from '../dna-helper.js';
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

// override `register` and `create` methods
export const register = _register;

/**
 * Create and register a Custom Element.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function create(fn, options = {}) {
    return _create(fn, options, {
        base: DNAVDomElementsBaseComponent,
        register: _register,
    });
}
