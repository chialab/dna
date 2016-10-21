/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with DOM Mutations.
 */

 import { ELEMENTS } from './src/lib/elements.js';
 import { Polyfill } from './src/lib/polyfill.js';
 import './src/observers/mutations.js';

 ELEMENTS.HTMLElement = new Polyfill(self.HTMLElement);

 export * from './index.js';
 export { registry } from './src/lib/registry.js';
 export { define } from './src/lib/define.js';
 export { Polyfill };
