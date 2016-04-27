/**
 * DNA
 * (c) 2015-2016 Chialab (http://chialab.io) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
import 'dna/polyfills/src/array/foreach.js';
import 'dna/polyfills/src/array/from.js';
import 'dna/polyfills/src/array/is-array.js';
import 'dna/polyfills/src/dom/class-list.js';
import 'dna/polyfills/src/object/set-prototype-of.js';

import * as config from './dna-config.next.js';

export * from './dna-component.next.js';
export * from './dna-properties-component.next.js';
export * from './dna-attributes-component.next.js';
export * from './dna-events-component.next.js';
export * from './dna-mixed-component.next.js';
export * from './dna-style-component.next.js';
export * from './dna-template-component.next.js';
export * from './dna-base-component.next.js';
export { extend, create, register } from './dna-helper.next.js';
export const Config = config;
export const Version = this.__DNA__VERSION__ || 'dev';
