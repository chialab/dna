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
export { registry } from '@dnajs/core/src/lib/registry.js';
export { bootstrap } from '@dnajs/core/src/lib/bootstrap.js';
export { define } from '@dnajs/core/src/lib/define.js';
export { render } from '@dnajs/core/src/lib/render.js';
export { IDOM };

export class BaseComponent extends mix().with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    IDOMMixin
) {}
