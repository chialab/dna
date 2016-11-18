/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with JSX extension and IncrementalDOM library.
 */
import { IDomTemplateMixin } from '@dnajs/idom/src/mixins/idom.js';
import { JSXTemplateMixin } from '@dnajs/jsx/src/mixins/jsx.js';
import { JSXIDomTemplateMixin } from './src/mixins/jsx-idom.js';
import { mix, prop, shim, HELPERS, DOM, MIXINS } from '@dnajs/core/src/library-helpers.js';
import { BaseComponent as OriginalComponent } from '@dnajs/core';
import '@dnajs/idom/src/idom-observer.js';

MIXINS.IDomTemplateMixin = IDomTemplateMixin;
MIXINS.JSXTemplateMixin = JSXTemplateMixin;
MIXINS.JSXIDomTemplateMixin = JSXIDomTemplateMixin;

export { mix, prop, shim, HELPERS, DOM, MIXINS };
export { registry, render, define } from '@dnajs/core';
export class BaseComponent extends mix(OriginalComponent).with(
    JSXTemplateMixin,
    JSXIDomTemplateMixin,
    IDomTemplateMixin
) {}
