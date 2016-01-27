/**
 * Copyright (c) 2015 Chialab s.r.l. & Channelweb s.r.l.
 * All rights reserved.
 *
 * Write your set of (Web) Components using ES2015, templates and (optionally) Sass.
 */

// import all dependencies
// https://github.com/systemjs/builder/issues/476
import 'dna/delegate';
import 'dna/polyfills/src/array/foreach.js';
import 'dna/polyfills/src/array/from.js';
import 'dna/polyfills/src/array/is-array.js';
import 'dna/polyfills/src/object/set-prototype-of.js';
import 'dna/polyfills/src/dom/class-list.js';

export * from './dna-component.next.js';
export * from './dna-attributes-component.next.js';
export * from './dna-event-component.next.js';
export * from './dna-mixed-component.next.js';
export * from './dna-style-component.next.js';
export * from './dna-template-component.next.js';
export * from './dna-base-component.next.js';
export * from './dna-library.next.js';
export { DNAConfig as Config } from './dna-config.next.js';
