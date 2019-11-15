/**
 * DNA
 * (c) 2015-2019 Chialab (https://www.chialab.it) <dev@chialab.io>
 * http://chialab.io/p/dna
 *
 * Evolution-based components.
 * Use with Custom Elements spec.
 */
import './src/lib/observer.js';
import { mix, MIXINS, IDOMMixin } from '@dnajs/idom';
import { CustomElementMixin } from './src/mixins/custom-element.js';
import { shim } from './src/lib/shim.js';

MIXINS.CustomElementMixin = CustomElementMixin;

export {
    mix,
    MIXINS,
    proxy,
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
    scopeStyle,
    IDOM,
    IDOMMixin,
    h,
    trust,
} from '@dnajs/idom';
export { shim };
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
