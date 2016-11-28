/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern with IncrementalDOM templates.
 */
import * as IDOM from './src/lib/idom.js';
import { IDOMMixin } from './src/mixins/idom.js';
import { mix, MIXINS } from '@dnajs/core/src/core.js';

MIXINS.IDOMMixin = IDOMMixin;

export * from '@dnajs/core/src/core.js';
export { registry, render, define } from '@dnajs/core';
export { IDOM };
export class BaseComponent extends mix().with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    IDOMMixin
) {}
