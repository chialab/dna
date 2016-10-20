/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
import Skin from 'skin-template';

export const Template = Skin;
export const IDOM = Template.IDOM;
export * from './src/dna-component.js';
export * from './src/mixins/dna-properties-component.js';
export * from './src/mixins/dna-events-component.js';
export * from './src/mixins/dna-style-component.js';
export * from './src/mixins/dna-template-component.js';
export * from './src/dna-base-component.js';
export * from './src/lib/nodes.js';
export { mix } from './src/lib/mixins.js';
export { Polyfill } from './src/lib/polyfill.js';
export { define } from './src/lib/define.js';
export { prop } from './src/lib/property.js';
export { HTMLElement } from './src/lib/html-element.js';
