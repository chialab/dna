/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with JSX extension.
 */
import { JSXTemplateMixin } from './src/mixins/jsx.js';
import { mix, prop, shim, HELPERS, DOM, MIXINS } from '@dnajs/core/src/library-helpers.js';
import { BaseComponent as OriginalComponent } from '@dnajs/core';

MIXINS.JSXTemplateMixin = JSXTemplateMixin;

export { mix, prop, shim, HELPERS, DOM, MIXINS };
export { registry, render, define } from '@dnajs/core';
export class BaseComponent extends mix(OriginalComponent).with(JSXTemplateMixin) {}
