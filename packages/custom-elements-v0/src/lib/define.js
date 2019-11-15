import { registry } from '@dnajs/core';

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
