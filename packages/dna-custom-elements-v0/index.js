/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with Custom Elements v0 spec.
 */
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import { registry, BaseComponent as OriginalComponent } from '@dnajs/core';
import { shim } from './src/lib/shim.js';
import { CustomElementMixin } from './src/mixins/custom-element.js';

MIXINS.CustomElementMixin = CustomElementMixin;

export { prop } from '@dnajs/core/src/core.js';
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

export class BaseComponent extends mix(
    shim(self.HTMLElement)
).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    CustomElementMixin
) {}
