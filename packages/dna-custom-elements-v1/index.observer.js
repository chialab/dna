/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with MutationObserver API.
 */
import './src/lib/observer.js';
export * from '@dnajs/core/src/core.js';
export { registry } from '@dnajs/core/src/lib/registry.js';
export { define } from '@dnajs/core/src/lib/define.js';
export { bootstrap } from '@dnajs/core/src/lib/bootstrap.js';
export { shim, render, MIXINS, BaseComponent } from './index.js';
