/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Evolution-based components.
 * Use with Custom Elements v0 spec.
 */
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import * as IDOM from '@dnajs/idom/src/lib/idom.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import { IDOMMixin } from '@dnajs/idom/src/mixins/idom.js';
import { shim } from './src/lib/shim.js';
import { CustomElementMixin } from './src/mixins/custom-element.js';

MIXINS.IDOMMixin = IDOMMixin;
MIXINS.CustomElementMixin = CustomElementMixin;

export { prop } from '@dnajs/core/src/core.js';
export { shim, mix, registry, MIXINS, IDOM };
export { define } from './src/lib/define.js';
export { render } from './src/lib/render.js';

export class BaseComponent extends mix(
    shim(self.HTMLElement)
).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    IDOMMixin,
    CustomElementMixin
) {}
