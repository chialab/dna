/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Evolution-based components.
 * Use with IncrementalDOM templates.
 */
import './src/lib/observer.js';
import * as IDOM from './src/lib/idom.js';
import { IDOMMixin } from './src/mixins/idom.js';
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import DOM from '@dnajs/core/src/lib/dom.js';
import { proxy } from '@dnajs/core/src/lib/proxy.js';
import { registry } from '@dnajs/core/src/lib/registry.js';

MIXINS.IDOMMixin = IDOMMixin;

export * from '@dnajs/core/src/core.js';
export { proxy };
export { registry };
export { bootstrap } from '@dnajs/core/src/lib/bootstrap.js';
export { define } from '@dnajs/core/src/lib/define.js';
export { render } from '@dnajs/core/src/lib/render.js';
export { IDOM };
export const h = IDOM.h;

DOM.lifeCycle(true);

export class BaseComponent extends mix(proxy(class { })).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    IDOMMixin
) {}
