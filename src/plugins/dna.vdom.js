import { DNAVDomBaseComponent } from '../extra/dna-vdom-base-component.js';

export * from '../dna.js';
export * from '../extra/dna-vdom-component.js';
export { DNAVDomBaseComponent };

// override deault base component
export let BaseComponent = DNAVDomBaseComponent;
