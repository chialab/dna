/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Evolution-based components.
 * Use with Custom Elements spec.
 */
import './src/lib/observer.js';
import { mix } from '@dnajs/core/src/core.js';
import { MIXINS } from '@dnajs/core/src/mixins/index.js';
import * as IDOM from '@dnajs/idom/src/lib/idom.js';
import { IDOMMixin } from '@dnajs/idom/src/mixins/idom.js';
import { CustomElementMixin } from './src/mixins/custom-element.js';
import { shim } from './src/lib/shim.js';

MIXINS.CustomElementMixin = CustomElementMixin;
MIXINS.IDOMMixin = IDOMMixin;

export * from '@dnajs/core/src/core.js';
export { shim, mix, MIXINS, IDOM };
export const h = IDOM.h;
export { registry } from './src/lib/registry.js';
export { define } from './src/lib/define.js';

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
