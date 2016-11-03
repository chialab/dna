/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Incremental DOM notifications.
 */
import * as IDOM from 'incremental-dom';
import { IDOMTemplateMixin } from './src/mixins/idom.js';
import { mix, prop, shim, HELPERS, DOM, MIXINS } from '@dna/core/src/library-helpers.js';
import './src/idom-observer.js';

MIXINS.IDOMTemplateMixin = IDOMTemplateMixin;

export { mix, prop, shim, HELPERS, DOM, MIXINS };
export { registry, render, define } from '@dna/core';
export { IDOM };
