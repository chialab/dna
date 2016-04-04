/**
 * DNA
 * (c) 2015-2016 Chialab (http://chialab.io) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */

export * from './dna-component.next.js';
export * from './dna-properties-component.next.js';
export * from './dna-attributes-component.next.js';
export * from './dna-events-component.next.js';
export * from './dna-mixed-component.next.js';
export * from './dna-style-component.next.js';
export * from './dna-template-component.next.js';
export * from './dna-base-component.next.js';
export * from './dna-library.next.js';
export { DNAConfig as Config } from './dna-config.next.js';

export const Version = this.__DNA__VERSION__ || 'dev';
