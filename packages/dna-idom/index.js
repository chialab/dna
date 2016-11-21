/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern with IncrementalDOM templates.
 */
import * as IDOM from './src/lib/idom.js';
import { IDomTemplateMixin } from './src/mixins/idom.js';
import { mix, prop, shim, HELPERS, DOM, MIXINS } from '@dnajs/core/src/library-helpers.js';
import { BaseComponent as OriginalComponent } from '@dnajs/core';

MIXINS.IDomTemplateMixin = IDomTemplateMixin;

export { mix, prop, shim, HELPERS, DOM, MIXINS };
export { registry, render, define } from '@dnajs/core';
export { IDOM };
export class BaseComponent extends mix(OriginalComponent).with(IDomTemplateMixin) {}
