/**
 * DNA
 * (c) 2015-2016 Chialab (http://chialab.io) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
import 'dna/polyfills/src/dom/class-list.js';
import 'dna/polyfills/src/object/set-prototype-of.js';
import 'dna/polyfills/src/function/name.js';

import * as config from './dna-config.js';

export * from './dna-component.js';
export * from './dna-properties-component.js';
export * from './dna-attributes-component.js';
export * from './dna-events-component.js';
export * from './dna-mixed-component.js';
export * from './dna-style-component.js';
export * from './dna-template-component.js';
export * from './dna-base-component.js';
export { register, registry, REGISTRY } from './dna-helper.js';
export { create } from './dna-create.js';
export const Config = config;
export const Version = this.__DNA__VERSION__ || 'dev';
