/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
export { mix } from './helpers/mixins.js'
export * from './dna-component.js';
export * from './dna-properties-component.js';
export * from './dna-events-component.js';
export * from './dna-style-component.js';
export * from './dna-template-component.js';
export * from './dna-base-component.js';
export { BaseComponent as BaseComponent } from './dna-base-component.js';
export { Template } from 'skin-template/src/template.js';
export { polyfillElement as polyfill } from './helpers/polyfill-element.js';
export { define } from './helpers/define.js';
export { prop } from './helpers/property.js';
export const Version = self.__DNA__VERSION__ || 'dev';
