/**
 * DNA
 * (c) 2015-2016 Chialab (http://chialab.io) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
import * as Config from './dna-config.next.js';

export * from './dna-component.next.js';
export * from './dna-properties-component.next.js';
export * from './dna-attributes-component.next.js';
export * from './dna-events-component.next.js';
export * from './dna-mixed-component.next.js';
export * from './dna-style-component.next.js';
export * from './dna-template-component.next.js';
export * from './dna-base-component.next.js';
export { Config };
export { extend, create } from './dna-helper.next.js';
export const Version = this.__DNA__VERSION__ || 'dev';
