/**
 * DNA
 * (c) 2015-2017 Chialab (http://www.chialab.it) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern with IncrementalDOM templates.
 */
import * as IDOM from './src/lib/idom.js';
import { IDOMMixin } from './src/mixins/idom.js';
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import { proxy } from '@dnajs/core/src/lib/proxy.js';

MIXINS.IDOMMixin = IDOMMixin;

export * from '@dnajs/core/src/core.js';
export { proxy };
export { registry } from '@dnajs/core/src/lib/registry.js';
export { bootstrap } from '@dnajs/core/src/lib/bootstrap.js';
export { define } from '@dnajs/core/src/lib/define.js';
export { render } from '@dnajs/core/src/lib/render.js';
export { IDOM };

const Component = proxy(class {
    constructor(node) {
        this.node = node || document.createElement(this.is);
    }
});

export class BaseComponent extends mix(Component).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    IDOMMixin
) {}
