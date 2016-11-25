/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements spec.
 */
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import { shim } from './src/lib/shim.js';

export { prop } from '@dnajs/core/src/core.js';
export { shim, mix, MIXINS };
export const registry = self.customElements;
export function define(...args) {
    return registry.define(...args);
}
export function render(node, Component, props = {}) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    node.appendChild(element);
    return element;
}

export class BaseComponent extends mix(
    shim(self.HTMLElement)
).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin
) {}
