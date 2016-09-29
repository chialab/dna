/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
export { mix } from 'mixwith';
export * from './dna-component.js';
export * from './dna-properties-component.js';
export * from './dna-events-component.js';
export * from './dna-style-component.js';
export * from './dna-template-component.js';
export * from './dna-base-component.js';
export { DNABaseComponent as BaseComponent } from './dna-base-component.js';
export { DNAProperty as Observer } from './helpers/dna-property.js';
export { Template } from 'skin-template/src/template.js';
export { register } from './helpers/register.js';
export const Version = self.__DNA__VERSION__ || 'dev';
