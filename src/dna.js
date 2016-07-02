/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * A component pattern for Web artisans.
 */
import 'dna/polyfills/src/dom/class-list.js';
import 'dna/polyfills/src/object/set-prototype-of.js';
import 'dna/polyfills/src/extra/dom-parser.js';
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
export { DNAProperty, register, registry, REGISTRY } from './dna-helper.js';
export { create } from './dna-create.js';
export { DNABaseComponent as BaseComponent } from './dna-base-component.js';
export const Config = config;
export const Version = self.__DNA__VERSION__ || 'dev';
