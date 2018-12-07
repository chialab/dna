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

const Component = proxy(class {
    constructor(node) {
        if (!node) {
            let desc = registry.get(this.is, true);
            let config = desc.config;
            node = document.createElement(
                config.extends ? config.extends : desc.is
            );
            if (config.extends) {
                node.setAttribute('is', desc.is);
            }
        }
        this.node = node;
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
