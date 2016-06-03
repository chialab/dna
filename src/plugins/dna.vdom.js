import { DNAVDomBaseComponent } from '../extra/dna-vdom-base-component.js';
import { create as _create } from '../dna-create.js';

export * from '../dna.js';
export * from '../extra/dna-vdom-component.js';
export { DNAVDomBaseComponent };

// override deault base component
export let BaseComponent = DNAVDomBaseComponent;

/**
 * Create and register a component using DNAVDomBaseComponent.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function create(fn, options = {}) {
    return _create(fn, options, {
        base: DNAVDomBaseComponent,
    });
}
