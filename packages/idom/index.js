/**
 * DNA
 * (c) 2015-2019 Chialab (https://www.chialab.it) <dev@chialab.io>
 * http://chialab.io/p/dna
 *
 * Evolution-based components.
 * Use with IncrementalDOM templates.
 */
import './src/lib/observer.js';
import * as IDOM from './src/lib/idom.js';
import { IDOMMixin } from './src/mixins/idom.js';
import { mix, MIXINS, DOM, proxy } from '@dnajs/core';

MIXINS.IDOMMixin = IDOMMixin;

export {
    mix,
    MIXINS,
    proxy,
    registry,
    DOM,
    DNA_SYMBOL,
    COMPONENT_SYMBOL,
    NODE_SYMBOL,
    STYLE_SYMBOL,
    CONNECTED_SYMBOL,
    namespace,
    prop,
    render,
    bootstrap,
    define,
    scopeStyle,
} from '@dnajs/core';
export { IDOM, IDOMMixin };
export { trust } from './src/lib/trust.js';
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
