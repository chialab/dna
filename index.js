/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
import Skin from 'skin-template';

export const Template = Skin;
export * from './src/dna-component.js';
export * from './src/dna-properties-component.js';
export * from './src/dna-events-component.js';
export * from './src/dna-style-component.js';
export * from './src/dna-template-component.js';
export * from './src/dna-base-component.js';
export { bind } from './src/lib/bind.js';
export { mix } from './src/lib/mixins.js';
export { Polyfill } from './src/lib/polyfill.js';
export { define } from './src/lib/define.js';
export { prop } from './src/lib/property.js';
export { render } from './src/lib/render.js';
export { HTMLElement } from './src/lib/html-element.js';
