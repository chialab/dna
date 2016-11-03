/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements v0 spec.
 */
import { shim, mix, MIXINS } from 'dna-components/src/library-helpers.js';
import { registry, BaseComponent as OriginalComponent } from 'dna-components';
import { customElementMixin } from './src/mixins/custom-element.js';

MIXINS.customElementMixin = customElementMixin;

export { prop, HELPERS } from 'dna-components/src/library-helpers.js';
export { shim, mix, registry, MIXINS };
export function define(tagName, Component, config = {}) {
    registry.define(tagName, Component, config);
    let opts = {
        prototype: Component.prototype,
    };
    if (config.extends) {
        opts.extends = config.extends;
    }
    return document.registerElement(tagName, opts);
}
export function render(node, Component, props = {}) {
    let element = new Component();
    for (let k in props) {
        element[k] = props[k];
    }
    node.appendChild(element);
    return element;
}

export class BaseComponent extends mix(OriginalComponent).with(
    customElementMixin
) {}
