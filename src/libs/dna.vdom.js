import { DNAVDomBaseComponent } from '../vdom/dna-vdom-base-component.js';

export * from '../dna.js';
export * from '../vdom/dna-vdom-component.js';
export { DNAVDomBaseComponent };

// override default base component
export let BaseComponent = DNAVDomBaseComponent;
